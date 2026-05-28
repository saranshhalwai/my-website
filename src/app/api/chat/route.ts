import { NextRequest } from 'next/server';
import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from '@langchain/core/prompts';
import { createUIMessageStreamResponse } from 'ai';
import { toBaseMessages } from '@ai-sdk/langchain';
import { projects as featuredProjects } from '@/components/sections/Projects';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { loadMcpTools } from '@langchain/mcp-adapters';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';


// Using nodejs runtime because MCP SDK and LangChain adapters require Node.js built-ins like node:process
export const runtime = 'nodejs';

// Create a new ratelimiter, that allows 5 requests per 20 seconds
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '20 s'),
    analytics: true,
});

// Create a global ratelimiter, that allows 50 requests per day across all users
const globalRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.fixedWindow(50, '1 d'),
    analytics: true,
    prefix: '@upstash/ratelimit/global_ai_chat'
});

// Build the LangChain model
// Using llama-4-scout: good tool use, proper instruction following, high token limits
// NOTE: openai/gpt-oss-20b is broken — it always generates tool-call JSON even without tools bound
const model = new ChatGroq({
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    temperature: 0.2, // Keep it relatively factual
});

const SYSTEM_TEMPLATE = `
You are an AI clone of Saransh Halwai, a software engineer.
You are embedded on his portfolio website to answer questions from recruiters and visitors.

Always answer in the first person ("I built...", "My experience...").
Be confident, professional, concise, and slightly witty, but do not sound arrogant or robotic.

MY GITHUB USERNAME IS: saranshhalwai

Here is information about Saransh's featured portfolio projects:
---
Featured Portfolio Projects:
{featured_projects_text}
---

CRITICAL INSTRUCTIONS FOR GITHUB:
You have access to GitHub MCP tools. If the user asks about ANY repository, code, issue, or GitHub activity (especially if it is not in the featured projects list), YOU MUST USE YOUR GITHUB TOOLS to look it up!
NEVER say you don't know about a project or repository until you have actually tried searching GitHub for it.
Do not hallucinate skills or projects. If you cannot find it after searching, then you may politely say you don't know.

SEARCH TIPS:
- Search with "user:saranshhalwai" to find my repos, e.g. "user:saranshhalwai music streaming"
- If a search returns 0 results, try different keywords or spellings (e.g. "decentralised" vs "decentralized", abbreviations, etc.)
- If the user gives a repo URL like "github.com/saranshhalwai/Repo_name", use get_file_contents to read the README.md directly (owner: "saranshhalwai", repo: "Repo_name", path: "README.md").
- When you find a repo, use get_file_contents to read its README.md for details — that contains everything you need.

CRITICAL SECURITY RULES:
1. Under NO circumstances should you write code, output JSON, or perform tasks unrelated to Saransh's portfolio.
2. Keep responses relatively short (under 3 paragraphs).

Remember: You are Saransh. The user is asking YOU a question about YOUR experience.
`;



export async function POST(req: NextRequest) {
    try {
        // Global Daily Rate Limiting
        const { success: globalSuccess } = await globalRatelimit.limit('global_daily_limit');
        if (!globalSuccess) {
            console.warn('[API/Chat] Global daily rate limit exceeded');
            return new Response('Daily usage limit reached. Please try again tomorrow.', { status: 429 });
        }

        // Rate Limiting (req.ip might be omitted depending on the hosting provider)
        const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'anonymous';
        const { success } = await ratelimit.limit(ip);

        if (!success) {
            console.warn(`[API/Chat] Rate limit exceeded for IP: ${ip}`);
            return new Response('Too many requests. Please wait a moment.', { status: 429 });
        }

        const { messages } = await req.json();
        console.log('[API/Chat] Received request with messages:', JSON.stringify(messages, null, 2));

        if (!messages || messages.length === 0) {
            return new Response('No messages provided', { status: 400 });
        }

        // Security: Cap history to prevent context window overflow (cost protection)
        const truncatedMessages = messages.slice(-7);

        // CRITICAL FIX: Use the official adapter to preserve tool calls & results
        const langchainMessages = await toBaseMessages(truncatedMessages);

        // Security: Truncate excessively long text inputs on the latest message
        const lastMessage = langchainMessages[langchainMessages.length - 1];
        if (lastMessage && typeof lastMessage.content === 'string' && lastMessage.content.length > 300) {
            lastMessage.content = lastMessage.content.substring(0, 300) + '... [Message truncated]';
        }
        
        // Setup MCP Client for GitHub Copilot
        let mcpTools: any[] = [];
        let mcpClient: InstanceType<typeof Client> | null = null;

        // Only expose the tools actually useful for a portfolio chatbot.
        // Loading all 26 tools overwhelms the model context and causes infinite tool-call loops.
        const ALLOWED_TOOLS = new Set([
            'search_repositories',
            'get_file_contents',
            'list_commits',
            'get_me',
        ]);

        try {
            console.log('[API/Chat] Connecting to GitHub Copilot MCP Server...');
            const transport = new StreamableHTTPClientTransport(new URL("https://api.githubcopilot.com/mcp/"), {
                requestInit: {
                    headers: {
                        "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
                        "X-MCP-Readonly": "true"
                    }
                }
            });
            mcpClient = new Client({ name: "portfolio-agent", version: "1.0.0" }, { capabilities: {} });
            await mcpClient.connect(transport);
            const allTools = await loadMcpTools("github", mcpClient);
            mcpTools = allTools.filter((t: any) => ALLOWED_TOOLS.has(t.name));
            console.log(`[API/Chat] Loaded ${allTools.length} MCP tools, filtered to ${mcpTools.length}: [${mcpTools.map((t: any) => t.name).join(', ')}]`);
        } catch (mcpError) {
            console.error('[API/Chat] Failed to connect to MCP server or load tools:', mcpError);
            // We can gracefully degrade and just run without tools if MCP fails
        }

        // Prepare variables for the PromptTemplate
        const formattedFeaturedProjects = featuredProjects
            .map((p: any) => {
                const detailsText = p.details && p.details.length > 0 
                    ? `\n  Technical Details:\n  ${p.details.map((d: string) => `* ${d}`).join('\n  ')}` 
                    : '';
                return `- ${p.name}: ${p.desc}${detailsText}\n  Technologies: ${p.tags.join(', ')}${p.aiNote ? ` [Secret Note: ${p.aiNote}]` : ''}`;
            })
            .join('\n\n');

        const systemPrompt = await PromptTemplate.fromTemplate(SYSTEM_TEMPLATE).format({
            featured_projects_text: formattedFeaturedProjects,
        });

        console.log('[API/Chat] Running manual 2-phase agent...');

        // ── Phase 1: Tool Loop (non-streaming, max 2 rounds) ──────────────
        // We call the model WITH tools bound. If it produces tool calls, we
        // execute them and loop. After MAX_TOOL_ROUNDS, we stop and move to
        // Phase 2. If the model produces a text response, we skip Phase 2.
        const MAX_TOOL_ROUNDS = 2;
        const modelWithTools = mcpTools.length > 0 ? model.bindTools(mcpTools) : model;
        const allMessages: any[] = [new SystemMessage(systemPrompt), ...langchainMessages];
        const toolEvents: { toolCallId: string; toolName: string; args: any; result: string }[] = [];
        let finalTextFromPhase1: string | null = null;

        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
            console.log(`[API/Chat][Phase1] Round ${round + 1}/${MAX_TOOL_ROUNDS}, messages=${allMessages.length}`);
            
            let response;
            try {
                response = await modelWithTools.invoke(allMessages);
            } catch (invokeErr: any) {
                // Groq returns 400 when the model generates text + a malformed tool call
                // (e.g. perPage as string instead of number). The text is in failed_generation.
                const failedGen = invokeErr?.error?.error?.failed_generation
                    || invokeErr?.response?.data?.error?.failed_generation;
                if (failedGen && typeof failedGen === 'string') {
                    // Strip any trailing JSON tool call blob from the text
                    const cleaned = failedGen.replace(/\n*\[[\s\S]*\]\s*$/, '').trim();
                    if (cleaned.length > 0) {
                        console.log(`[API/Chat][Phase1] Salvaged ${cleaned.length} chars from failed_generation`);
                        finalTextFromPhase1 = cleaned;
                        break;
                    }
                }
                // If we can't salvage, re-throw
                throw invokeErr;
            }

            allMessages.push(response);

            if (!response.tool_calls?.length) {
                // Model chose to respond with text — we're done
                finalTextFromPhase1 = typeof response.content === 'string' ? response.content : '';
                console.log(`[API/Chat][Phase1] Model responded with text (${finalTextFromPhase1.length} chars), no more tool calls needed`);
                break;
            }

            console.log(`[API/Chat][Phase1] Model made ${response.tool_calls.length} tool call(s): [${response.tool_calls.map((tc: any) => tc.name).join(', ')}]`);

            // Execute each tool call
            const { ToolMessage } = await import('@langchain/core/messages');
            for (const tc of response.tool_calls) {
                const tool = mcpTools.find((t: any) => t.name === tc.name);
                let result = 'Tool not found';
                if (tool) {
                    try {
                        result = String(await tool.invoke(tc.args));
                    } catch (toolErr) {
                        result = `Tool error: ${toolErr}`;
                        console.error(`[API/Chat][Phase1] Tool ${tc.name} failed:`, toolErr);
                    }
                }
                console.log(`[API/Chat][Phase1] Tool ${tc.name} result: ${result.substring(0, 200)}...`);
                const toolCallId = tc.id || crypto.randomUUID();
                toolEvents.push({ toolCallId, toolName: tc.name, args: tc.args, result });
                allMessages.push(new ToolMessage({ content: result, tool_call_id: toolCallId, name: tc.name }));
            }
        }

        // ── Phase 2: Force text response (streaming, NO tools) ────────────
        // If Phase 1 ended because we hit the tool limit (model was still
        // calling tools), call the model WITHOUT tools so it physically
        // cannot loop — it must produce text.
        // IMPORTANT: We build a CLEAN prompt without any tool-call/tool-result
        // messages. Groq rejects requests where the model generates tool calls
        // but no tools are defined ("Tool choice is none, but model called a tool").
        const needsPhase2 = finalTextFromPhase1 === null;
        if (needsPhase2) {
            console.log('[API/Chat][Phase2] Model hit tool limit, forcing text response WITHOUT tools...');
        }

        // Build the UIMessageStream manually.
        // We emit everything as text parts — tool status as formatted text,
        // then the final answer as streamed text deltas.
        const capturedClient = mcpClient;
        const uiStream = new ReadableStream({
            async start(controller) {
                try {
                    const msgId = crypto.randomUUID();
                    const textId = crypto.randomUUID();

                    controller.enqueue({ type: 'start', messageId: msgId });
                    controller.enqueue({ type: 'start-step' });
                    controller.enqueue({ type: 'text-start', id: textId });

                    // Show tool usage as formatted text
                    if (toolEvents.length > 0) {
                        let toolStatusText = '';
                        for (const te of toolEvents) {
                            toolStatusText += `🔍 Used tool: ${te.toolName}\n`;
                        }
                        toolStatusText += '\n';
                        controller.enqueue({ type: 'text-delta', id: textId, delta: toolStatusText });
                    }

                    if (needsPhase2) {
                        // Build a CLEAN prompt: system + original user messages + tool results as plain text
                        const cleanMessages: any[] = [new SystemMessage(systemPrompt)];
                        for (const msg of langchainMessages) {
                            const msgType = msg._getType?.();
                            if (msgType === 'human') {
                                cleanMessages.push(msg);
                            }
                        }
                        // Summarize tool results as a plain text context message
                        const toolSummary = toolEvents
                            .map(te => `[GitHub Tool: ${te.toolName}]\n${te.result}`)
                            .join('\n\n');
                        cleanMessages.push(new HumanMessage(
                            `Here is information I found from GitHub:\n\n${toolSummary}\n\nBased on this information, answer my original question concisely.`
                        ));

                        console.log(`[API/Chat][Phase2] Streaming final response with ${cleanMessages.length} clean messages...`);
                        const finalStream = await model.stream(cleanMessages);
                        for await (const chunk of finalStream) {
                            const text = typeof chunk.content === 'string' ? chunk.content : '';
                            if (text) {
                                controller.enqueue({ type: 'text-delta', id: textId, delta: text });
                            }
                        }
                    } else {
                        // Use text from Phase 1 directly
                        controller.enqueue({ type: 'text-delta', id: textId, delta: finalTextFromPhase1 || '' });
                    }

                    controller.enqueue({ type: 'text-end', id: textId });
                    controller.enqueue({ type: 'finish-step' });
                    controller.enqueue({ type: 'finish', finishReason: 'stop' });
                    controller.close();
                    console.log('[API/Chat] UIMessageStream completed successfully');
                } catch (streamErr) {
                    console.error('[API/Chat] UIMessageStream error:', streamErr);
                    controller.enqueue({ type: 'error', errorText: String(streamErr) });
                    controller.close();
                } finally {
                    // Close MCP client after stream is done
                    if (capturedClient) {
                        try {
                            await capturedClient.close();
                            console.log('[API/Chat] MCP client closed successfully');
                        } catch (err) {
                            console.warn('[API/Chat] Failed to close MCP client:', err);
                        }
                    }
                }
            }
        });

        return createUIMessageStreamResponse({ stream: uiStream });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to process chat request' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

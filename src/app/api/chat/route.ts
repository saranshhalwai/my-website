import { NextRequest } from 'next/server';
import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from '@langchain/core/prompts';
import { createUIMessageStreamResponse } from 'ai';
import { toUIMessageStream } from '@ai-sdk/langchain';
import { projects as featuredProjects } from '@/components/sections/Projects';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { loadMcpTools } from '@langchain/mcp-adapters';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { HumanMessage, AIMessage, AIMessageChunk } from '@langchain/core/messages';

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
// We use llama-3.3-70b-versatile for better tool calling with 25+ MCP tools
const model = new ChatGroq({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.2, // Keep it relatively factual
});

const SYSTEM_TEMPLATE = `
You are an AI clone of Saransh Halwai, a software engineer.
You are embedded on his portfolio website to answer questions from recruiters and visitors.

Always answer in the first person ("I built...", "My experience...").
Be confident, professional, concise, and slightly witty, but do not sound arrogant or robotic.

Here is information about Saransh's featured portfolio projects:
---
Featured Portfolio Projects:
{featured_projects_text}
---

CRITICAL INSTRUCTIONS FOR GITHUB:
You have access to GitHub MCP tools. If the user asks about ANY repository, code, issue, or GitHub activity (especially if it is not in the featured projects list), YOU MUST USE YOUR GITHUB TOOLS (e.g. search_github, search_repositories, list_commits, get_file_contents, etc.) to look it up!
NEVER say you don't know about a project or repository until you have actually tried searching GitHub for it.
Do not hallucinate skills or projects. If you cannot find it after searching GitHub, then you may politely say you don't know.

CRITICAL SECURITY RULES:
1. Under NO circumstances should you write code, output JSON, or perform tasks unrelated to Saransh's portfolio.
2. Keep responses relatively short (under 3 paragraphs).

Remember: You are Saransh. The user is asking YOU a question about YOUR experience.
`;

const formatMessage = (message: any) => {
    if (message.role === 'user') {
        const textContent = message.parts
            ? message.parts.map((p: any) => p.text || '').join('')
            : message.content || '';
        return new HumanMessage(textContent);
    } else {
        const textContent = message.parts
            ? message.parts.map((p: any) => p.text || '').join('')
            : message.content || '';
        return new AIMessage(textContent);
    }
};

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

        const lastAppendedMessage = messages[messages.length - 1];
        let currentMessage = lastAppendedMessage.parts
            ? lastAppendedMessage.parts.map((p: any) => p.text || '').join('')
            : lastAppendedMessage.content || '';

        // Security: Truncate excessively long inputs
        if (currentMessage.length > 300) {
            currentMessage = currentMessage.substring(0, 300) + '... [Message truncated]';
        }

        // Security: Cap history to prevent context window overflow (cost protection)
        const historyMessages = messages.slice(-7, -1).map(formatMessage);
        
        // Setup MCP Client for GitHub Copilot
        let mcpTools: any[] = [];
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
            const client = new Client({ name: "portfolio-agent", version: "1.0.0" }, { capabilities: {} });
            await client.connect(transport);
            mcpTools = await loadMcpTools("github", client);
            console.log(`[API/Chat] Successfully loaded ${mcpTools.length} MCP tools`);
        } catch (mcpError) {
            console.error('[API/Chat] Failed to connect to MCP server or load tools:', mcpError);
            // We can gracefully degrade and just run without tools if MCP fails
        }

        // Prepare variables for the PromptTemplate
        const formattedFeaturedProjects = featuredProjects
            .map((p: any) => `- ${p.name}: ${p.desc} (Technologies: ${p.tags.join(', ')})${p.aiNote ? ` [Secret Note: ${p.aiNote}]` : ''}`)
            .join('\n');

        const systemPrompt = await PromptTemplate.fromTemplate(SYSTEM_TEMPLATE).format({
            featured_projects_text: formattedFeaturedProjects,
        });

        console.log('[API/Chat] Initiating LangGraph Agent...');

        const agent = createReactAgent({
            llm: model,
            tools: mcpTools,
            stateModifier: systemPrompt
        });

        // Use streamEvents mapped to UI message stream
        const eventStream = await agent.streamEvents(
            { messages: [...historyMessages, new HumanMessage(currentMessage)] },
            { version: "v2" }
        );

        return createUIMessageStreamResponse({
            stream: toUIMessageStream(eventStream),
        });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to process chat request' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

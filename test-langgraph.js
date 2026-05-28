import { ChatGroq } from '@langchain/groq';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { HumanMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const myTool = tool(
  async ({ input }) => {
    return "This is the result of the tool: repo is bharatbricks_nyaya, 0 stars.";
  },
  {
    name: "list_commits",
    description: "list commits",
    schema: z.object({ input: z.string() })
  }
);

const model = new ChatGroq({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.2,
});

const agent = createReactAgent({
    llm: model,
    tools: [myTool],
});

async function main() {
  const stream = await agent.streamEvents({
    messages: [new HumanMessage("Tell me about bharatbricks_nyaya repo on your github")]
  }, { version: "v2" });
  
  for await (const event of stream) {
    if (event.event === 'on_chat_model_stream') {
        console.log("TEXT:", event.data.chunk?.content);
    }
  }
}

main().catch(console.error);

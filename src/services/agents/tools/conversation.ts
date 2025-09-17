import z from "zod";
import { Tool } from "ai";
import { getAgentById, getIdleAgent } from "../operations";
import { conversationQueue, createConversation } from "../../conversations";
import { getSimulation } from "../../simulations";

export const startConversationTool: Tool<any, string> = {
  description: "Start a new conversation.",
  parameters: z.object({
    senderId: z.string(),
  }),
  execute: async (args: { senderId: string; simulationId: string }) => {
    console.log("Tool: Starting conversation triggered.");

    const sender = await getAgentById(args.senderId);
    const receiver = await getIdleAgent(args.simulationId, args.senderId);
    const simulation = await getSimulation(args.simulationId);
    const conversation = await createConversation(simulation, sender, receiver);

    await conversationQueue.add("conversation.start", {
      simulation,
      conversation,
      sender,
    });

    return `Conversation started with conversationId: ${conversation.id}`;
  },
};

export const converseTool: Tool<any, string> = {
  description:
    "Use this when you want to continue the conversation with the other agent. Call this tool with the current conversationId.",
  parameters: z.object({
    conversationId: z.string().describe("The conversationId."),
  }),
  execute: async (args: { conversationId: string }) => {
    console.log("Tool: Keep conversation going triggered.");
    /*
    await conversationQueue.add("conversation.converse", {
      conversationId: args.conversationId,
    });
*/
    return `conversationId ${args.conversationId} is ongoing.`;
  },
};

export const endConversationTool: Tool<any, string> = {
  description:
    "Use this when you feel the conversation has reached a natural conclusion or there's nothing more to discuss. Call this tool with the current conversationId.",
  parameters: z.object({
    conversationId: z.string().describe("The conversationId."),
  }),
  execute: async (args: { conversationId: string }) => {
    console.log("Tool: Ending conversation triggered.");

    await conversationQueue.add("conversation.end", {
      conversationId: args.conversationId,
    });

    return `conversationId ${args.conversationId} is ended.`;
  },
};

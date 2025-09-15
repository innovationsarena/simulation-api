import z from "zod";
import { Tool } from "ai";
import { getAgentById, getIdleAgent } from "../operations";
import { conversationQueue, createConversation } from "../../conversations";
import { getSimulation } from "../../simulations";

export const findConversationPartnerTool: Tool<any, { recieverId: string }> = {
  description: "Find a free partner to conversate.",
  parameters: z.object({
    senderId: z.string(),
    simulationId: z.string(),
  }),
  execute: async (args: { senderId: string; simulationId: string }) => {
    console.log("Tool: Finding a free conversation partner triggered.");

    const { id } = await getIdleAgent(args.simulationId, args.senderId);

    return { recieverId: id };
  },
};

export const startConversationTool: Tool<any, void> = {
  description: "Start a conversation between senderId and receiverId.",
  parameters: z.object({
    senderId: z.string(),
    receiverId: z.string(),
    simulationId: z.string(),
  }),
  execute: async (args: {
    senderId: string;
    receiverId: string;
    simulationId: string;
  }) => {
    console.log("Tool: Starting conversation triggered.");

    const simulation = await getSimulation(args.simulationId);
    const sender = await getAgentById(args.senderId);
    const receiver = await getAgentById(args.receiverId);
    const conversation = await createConversation(simulation, sender, receiver);

    await conversationQueue.add("conversation.start", {
      simulation,
      conversation,
      sender,
    });
    return;
  },
};

export const conversateTool: Tool<any, void> = {
  description: "Keep conversation going between senderId and receiverId.",
  parameters: z.object({
    conversationId: z.string(),
  }),
  execute: async (args: { conversationId: string }) => {
    console.log("Tool: Keep conversation going triggered.");

    await conversationQueue.add("conversation.converse", {
      conversationId: args.conversationId,
    });

    return;
  },
};

export const endConversationTool: Tool = {
  description: "End conversation between senderId and receiverId.",
  parameters: z.object({
    conversationId: z.string(),
  }),
  execute: async (args: { conversationId: string }) => {
    console.log("Tool: Ending conversation triggered.");
    await conversationQueue.add("conversation.end", {
      conversationId: args.conversationId,
    });
    return;
  },
};

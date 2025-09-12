import z from "zod";
import { Tool } from "ai";
import { getIdleAgent } from "../operations";
import { conversationQueue } from "../../conversations";

export const findConversationPartnerTool: Tool<any, { recieverId: string }> = {
  description: "Find a free partner to conversate.",
  parameters: z.object({
    senderId: z.string(),
    simulationId: z.string(),
  }),
  execute: async (args: { senderId: string; simulationId: string }) => {
    console.log("Tool: Finding a free conversation partner triggered.");

    // Return free agent Id.
    const { id } = await getIdleAgent(args.simulationId, args.senderId);

    return { recieverId: id };
  },
};

export const startConversationTool: Tool<any, void> = {
  description: "Start a conversation between senderId and receiverId.",
  parameters: z.object({
    senderId: z.string(),
    receiverId: z.string(),
  }),
  execute: async (args: { senderId: string; receiverId: string }) => {
    console.log("Tool: Starting conversation triggered.");

    await conversationQueue.add("conversation.start", {
      senderId: args.senderId,
      receiverId: args.receiverId,
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

    await conversationQueue.add("conversation.conversate", {
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

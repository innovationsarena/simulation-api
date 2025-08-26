import { Tool } from "ai";
import { supabase } from "../supabase";
import z from "zod";

export const findConversationPartner: Tool = {
  description: "Find a free partner to conversate in given simulation.",
  parameters: z.object({
    senderId: z.string(),
    simulationId: z.string(),
  }),
  execute: async (args: any) => {
    console.log("Finding a free conversation partner...");
    // Return free agent Id.
    const { data, error } = await supabase
      .from(process.env.AGENTS_TABLE_NAME as string)
      .select("*")
      .eq("simulationId", args.simulationId)
      .eq("inActivityId", null)
      .eq("state", "idle")
      .single();

    if (error) throw new Error(error.message);

    if (data === null) return null;
    return String(data.id);
  },
};

export const startConversation: Tool = {
  description: "Start conversation.",
  parameters: z.object({
    senderId: z.string(),
    receiverId: z.string(),
  }),
  execute: async (args: any) => {
    // Set agents state 'inConversation'.
    return String(args.senderId + " " + args.receiverId);
  },
};

export const endConversation: Tool = {
  description: "End conversation.",
  parameters: z.object({
    conversationId: z.string(),
  }),
  execute: async (args: any) => {
    // Set agents state 'idle'.
    // Set conversation state to 'done'.
    return String(args.senderId + " " + args.receiverId);
  },
};

export const conversate: Tool = {
  description: "Make conversation.",
  parameters: z.object({
    senderId: z.string(),
    conversationId: z.string(),
  }),
  execute: async (args: any) => {
    // Set agents state 'inConversation'.
    return String(
      args.senderId + " " + args.receiverId + " " + args.conversationId
    );
  },
};

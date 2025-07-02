import { FastifyReply, FastifyRequest } from "fastify";
import { Conversation, id, Message, Simulation, supabase } from "../core";
import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

export const createConversationController = async (
  request: FastifyRequest<{
    Body: { senderId: string; recieverId: string; simulationId: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { senderId, recieverId, simulationId } = request.body;

    // get simulation data
    const { data }: PostgrestSingleResponse<Simulation> = await supabase
      .from(process.env.SIMULATIONS_TABLE_NAME as string)
      .select("*")
      .eq("id", simulationId)
      .single();

    // Create conversation

    const conversationId = id(12);

    const conversation: Omit<Conversation, "messages"> = {
      id: conversationId,
      simulationId,
      active: true,
      topic: data?.topic as string,
      dialogists: [senderId, recieverId],
    };

    await supabase
      .from(process.env.CONVERSATIONS_TABLE_NAME as string)
      .insert(conversation)
      .select();

    await reply.status(201).send({
      ...conversation,
      messages: [],
    });
  } catch (error: any) {
    reply.log.error(error.message);
    throw new Error(error.message);
  }
};

export const getConversationController = async (
  request: FastifyRequest<{
    Params: { conversation: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { conversation: conversationId } = request.params;

    const { data: conversation }: PostgrestSingleResponse<Conversation> =
      await supabase
        .from(process.env.CONVERSATIONS_TABLE_NAME as string)
        .select("*")
        .eq("id", conversationId)
        .single();

    if (!conversation) throw new Error("No conversation found.");

    const { data: messages }: PostgrestResponse<Message> = await supabase
      .from(process.env.MESSAGES_TABLE_NAME as string)
      .select("*")
      .eq("conversationId", conversationId);

    await reply.status(200).send({ ...conversation, messages });
  } catch (error: any) {
    reply.log.error(error.message);
    throw new Error(error.message);
  }
};

export const makeConversationController = async (
  request: FastifyRequest<{
    Params: { conversation: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { conversation } = request.params;
    await reply.status(200).send({
      id: conversation,
      title: "Sample Conversation",
      description: "A sample conversation",
      created_at: new Date().toISOString(),
      messages: [],
    });
  } catch (error: any) {
    reply.log.error(error.message);
    throw new Error(error.message);
  }
};

export const endConversationController = async (
  request: FastifyRequest<{
    Params: { conversation: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { conversation } = request.params;
    await reply
      .status(200)
      .send({ message: `Conversation ${conversation} ended.` });
  } catch (error: any) {
    reply.log.error(error.message);
    throw new Error(error.message);
  }
};

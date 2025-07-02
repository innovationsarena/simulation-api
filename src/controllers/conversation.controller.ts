import { FastifyReply, FastifyRequest } from "fastify";
import {
  Conversation,
  getConversation,
  id,
  Message,
  Simulation,
  supabase,
} from "../core";
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

    const { data: createConversation, error: createConversationError } =
      await supabase
        .from(process.env.CONVERSATIONS_TABLE_NAME as string)
        .insert(conversation)
        .select();

    if (createConversationError)
      return reply
        .status(createConversationError.code as unknown as number)
        .send(createConversationError.message);

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

    const conversation = await getConversation(conversationId, reply);

    await reply.status(200).send(conversation);
  } catch (error: any) {
    reply.log.error(error.message);
    throw new Error(error.message);
  }
};

export const makeConversationController = async (
  request: FastifyRequest<{
    Params: { conversation: string };
    Body: { senderId: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { conversation } = request.params;
    const { senderId } = request.body;

    // get Agent
    // Parse prompt
    // Call LLM
    // Create message
    // Update conversation

    await reply.status(200).send();
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

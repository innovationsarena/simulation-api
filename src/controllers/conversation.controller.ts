import { FastifyReply, FastifyRequest } from "fastify";
import {
  Conversation,
  getAgent,
  getConversation,
  handleControllerError,
  id,
  Message,
  parseMessages,
  parsePrompt,
  Simulation,
  supabase,
} from "../core";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

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
  } catch (error) {
    handleControllerError(error, reply);
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

    reply.status(200).send(conversation);
  } catch (error) {
    handleControllerError(error, reply);
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
    const { conversation: conversationId } = request.params;
    const { senderId } = request.body;

    // get Agent
    const agent = await getAgent(senderId, reply);
    // Get Conversation
    const { simulationId, topic, messages } = await getConversation(
      conversationId,
      reply
    );

    if (agent.inCoversationId !== conversationId) {
      // you turn to talk --->

      // Parse system prompt
      const system = await parsePrompt(agent);
      // Parse messages
      const parsedMessages = parseMessages(messages, senderId);
      // Fetch conversation

      // Call LLM
      const { text } = await generateText({
        model: openai(agent.llmSettings.model),
        temperature: agent.llmSettings.temperature,
        maxTokens: agent.llmSettings.messageToken,
        system: system as string,
        messages: parsedMessages,
      });

      // Create message
      const firstMessage: Message = {
        senderId,
        conversationId,
        simulationId,
        content: text,
        tokens: {
          promptTokens: 0,
          completionTokens: 0,
        },
      };
      await supabase
        .from(process.env.MESSAGES_TABLE_NAME as string)
        .insert([firstMessage])
        .select()
        .single();

      // Update conversation
      // Update agents inConversation
    } else {
      // Your turn to wait
    }

    reply.status(200).send();
  } catch (error) {
    handleControllerError(error, reply);
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
  } catch (error) {
    handleControllerError(error, reply);
  }
};

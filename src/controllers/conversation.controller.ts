import { FastifyReply, FastifyRequest } from "fastify";
import {
  Conversation,
  getAgentById,
  getConversation,
  getSimulation,
  handleControllerError,
  id,
  Message,
  parseMessages,
  parsePrompt,
  supabase,
} from "../core";
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

    const { topic } = await getSimulation(simulationId, reply);

    // CREATE CONVERSATION
    const conversationId = id(12);

    const conversation: Omit<Conversation, "messages"> = {
      id: conversationId,
      simulationId,
      active: false,
      topic: topic,
      participants: [senderId, recieverId],
    };

    // Update user states
    const { data: senderData, error: senderError } = await supabase
      .from(process.env.AGENTS_TABLE_NAME as string)
      .update({ state: "active", inActivityId: conversationId })
      .eq("id", senderId)
      .select();

    if (senderError) handleControllerError(senderError, reply);

    const { data: recieverData, error: recieverError } = await supabase
      .from(process.env.AGENTS_TABLE_NAME as string)
      .update({ state: "active", inActivityId: conversationId })
      .eq("id", recieverId)
      .select();

    if (recieverError) handleControllerError(recieverError, reply);

    // Create conversation
    const { data: createConversation, error: createConversationError } =
      await supabase
        .from(process.env.CONVERSATIONS_TABLE_NAME as string)
        .insert(conversation)
        .select();

    if (createConversationError)
      handleControllerError(createConversationError, reply);

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
    const agent = await getAgentById(senderId, reply);
    // Get Conversation
    const { simulationId, topic, messages } = await getConversation(
      conversationId,
      reply
    );

    const simulation = await getSimulation(simulationId, reply);

    if (agent.inActivityId !== conversationId) {
      // you turn to talk --->

      // Parse system prompt
      const system = await parsePrompt(agent, simulation);

      // Parse messages in conversation
      const parsedMessages = parseMessages(messages, senderId);

      // Call LLM
      const { text } = await generateText({
        model: openai(agent.llmSettings.model),
        temperature: agent.llmSettings.temperature,
        maxTokens: agent.llmSettings.messageToken,
        system: system as string,
        messages: parsedMessages,
      });

      // Create message
      const Msg: Message = {
        senderId,
        parentId: conversationId,
        simulationId,
        content: text,
        tokens: {
          promptTokens: 0,
          completionTokens: 0,
        },
      };

      await supabase
        .from(process.env.MESSAGES_TABLE_NAME as string)
        .insert([Msg])
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

export const startConversationController = async (
  request: FastifyRequest<{
    Params: { conversation: string };
    Body: { senderId: string; recieverId: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { conversation: conversationId } = request.params;
    const { senderId, recieverId } = request.body;

    // get Agent
    const sender = await getAgentById(senderId, reply);
    const reciever = await getAgentById(recieverId, reply);
    const { topic } = await getConversation(conversationId, reply);

    // Update user states
    await supabase
      .from(process.env.AGENTS_TABLE_NAME as string)
      .update({ state: "active", inActivityId: conversationId })
      .eq("id", senderId)
      .select();

    await supabase
      .from(process.env.AGENTS_TABLE_NAME as string)
      .update({ state: "active", inActivityId: conversationId })
      .eq("id", recieverId)
      .select();

    // Update conversation state and updated_at = onChange
    await supabase
      .from(process.env.CONVERSATIONS_TABLE_NAME as string)
      .update({ active: true })
      .eq("id", conversationId)
      .select();

    // Send first message
    const prompt = `Hej! Vi har fått i uppdrag att diskutera följande fråga: ${topic}. Vad är dina tankar kring detta ämne?`;

    await reply.status(200).send({
      message: `Conversation ${conversationId} between ${sender.name} and ${reciever.name} has started.`,
    });
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

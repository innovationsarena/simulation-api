import { FastifyReply, FastifyRequest } from "fastify";
import { handleControllerError, Message, parseMessages } from "../core";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  createConversation,
  createMessage,
  getAgentById,
  getConversation,
  getSimulation,
  parsePrompt,
  supabase,
  updateConversation,
} from "../services";

export const createConversationController = async (
  request: FastifyRequest<{
    Body: { senderId: string; recieverId: string; simulationId: string };
  }>,
  reply: FastifyReply
) => {
  try {
    console.log("Creating conversation...");

    const { senderId, recieverId, simulationId } = request.body;

    const simulation = await getSimulation(simulationId, reply);
    const sender = await getAgentById(senderId, reply);
    const reciever = await getAgentById(recieverId, reply);

    // Create conversation
    const conversation = await createConversation(
      simulation,
      sender,
      reciever,
      reply
    );

    // Update agents states
    const { data: senderData, error: senderError } = await supabase
      .from(process.env.AGENTS_TABLE_NAME as string)
      .update({ state: "active", inActivityId: conversation.id })
      .eq("id", senderId)
      .select();

    if (senderError) handleControllerError(senderError, reply);

    const { data: recieverData, error: recieverError } = await supabase
      .from(process.env.AGENTS_TABLE_NAME as string)
      .update({ state: "active", inActivityId: conversation.id })
      .eq("id", recieverId)
      .select();

    if (recieverError) handleControllerError(recieverError, reply);

    // Create channel?

    // Send first message
    const { text, usage } = await generateText({
      model: openai(process.env.DEFAULT_LLM_MODEL as string),
      system: await parsePrompt(sender, simulation),
      prompt: `Formulera en fördjupande och tydlig fråga kring följande topic: ${simulation.topic}`,
    });

    const initMessage: Message = {
      parentId: conversation.id,
      content: text,
      senderId,
      simulationId,
      tokens: usage,
    };

    await createMessage(initMessage, reply);

    // Update conversation state and updated_at = onChange
    await supabase
      .from(process.env.CONVERSATIONS_TABLE_NAME as string)
      .update({ active: true })
      .eq("id", conversation.id)
      .select();

    await reply.status(201).send({
      ...conversation,
      messages: [initMessage],
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
    const { simulationId, messages, activeSpeakerId, id } =
      await getConversation(conversationId, reply);

    const simulation = await getSimulation(simulationId, reply);

    // Check if its your turn to talk
    if (agent.inActivityId === conversationId && agent.id !== activeSpeakerId) {
      // Parse system prompt
      const system = await parsePrompt(agent, simulation);

      // Parse messages in conversation
      const parsedMessages = parseMessages(messages, senderId);

      // Call LLM
      const { text, usage } = await generateText({
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
        tokens: usage,
      };

      await createMessage(Msg, reply);

      // Update conversation
      await updateConversation(conversationId, senderId);
    }

    reply.status(200).send();
  } catch (error) {
    handleControllerError(error, reply);
  }
};

export const startConversationController = async (
  request: FastifyRequest<{
    Params: { conversation: string };
    Body: { senderId: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { conversation: conversationId } = request.params;
    const { topic, simulationId, participants } = await getConversation(
      conversationId,
      reply
    );

    const { senderId } = request.body;

    const recieverId = participants.find((p) => p !== senderId);

    if (!recieverId) throw new Error("Reciever Id in conversation not found.");

    // get Agent
    const sender = await getAgentById(senderId, reply);
    const reciever = await getAgentById(recieverId as string, reply);
    const simulation = await getSimulation(simulationId, reply);

    // Send first message
    const { text, usage } = await generateText({
      model: openai(process.env.DEFAULT_LLM_MODEL as string),
      system: await parsePrompt(sender, simulation),
      prompt: `Formulera en fördjupande och tydlig fråga kring följande topic: ${topic}`,
    });

    const initMessage: Message = {
      parentId: conversationId,
      content: text,
      senderId,
      simulationId,
      tokens: usage,
    };

    await createMessage(initMessage, reply);

    // Update conversation state and updated_at = onChange
    await supabase
      .from(process.env.CONVERSATIONS_TABLE_NAME as string)
      .update({ active: true })
      .eq("id", conversationId)
      .select();

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
    const { conversation: conversationId } = request.params;

    await supabase
      .from(process.env.CONVERSATIONS_TABLE_NAME as string)
      .update({ active: false })
      .eq("id", conversationId)
      .select();

    await reply
      .status(200)
      .send({ message: `Conversation ${conversationId} ended.` });
  } catch (error) {
    handleControllerError(error, reply);
  }
};

export async function makeConversation(
  conversationId: string,
  senderId: string,
  reply: FastifyReply
) {}

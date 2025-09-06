import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler, Message, parseMessages } from "../core";
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

export const createConversationController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: { senderId: string; recieverId: string; simulationId: string };
    }>,
    reply: FastifyReply
  ) => {
    console.log("Creating conversation...");

    const { senderId, recieverId, simulationId } = request.body;

    const simulation = await getSimulation(simulationId);
    const sender = await getAgentById(senderId);
    const reciever = await getAgentById(recieverId);

    // Create conversation
    const conversation = await createConversation(simulation, sender, reciever);

    // Update agents states
    const { data: senderData, error: senderError } = await supabase
      .from(process.env.AGENTS_TABLE_NAME as string)
      .update({ state: "active", inActivityId: conversation.id })
      .eq("id", senderId)
      .select();

    if (senderError) throw new Error(senderError.message);

    const { data: recieverData, error: recieverError } = await supabase
      .from(process.env.AGENTS_TABLE_NAME as string)
      .update({ state: "active", inActivityId: conversation.id })
      .eq("id", recieverId)
      .select();

    if (recieverError) throw new Error(recieverError.message);

    // Send first message
    const { text, usage } = await generateText({
      model: openai(process.env.DEFAULT_LLM_MODEL as string),
      system: await parsePrompt(sender, simulation),
      prompt: `Formulera en fördjupande och tydlig fråga kring följande topic: ${simulation.topic}`,
    });

    const initMessage: Message = {
      parentId: conversation.id,
      parentType: "conversation",
      content: text,
      senderId,
      simulationId,
      tokens: usage,
    };

    await createMessage(initMessage);

    // Update conversation state and updated_at = onChange
    await supabase
      .from(process.env.CONVERSATIONS_TABLE_NAME as string)
      .update({ active: true })
      .eq("id", conversation.id)
      .select();

    return reply.status(201).send({
      ...conversation,
      messages: [initMessage],
    });
  }
);

export const getConversationController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { conversation: string };
    }>,
    reply: FastifyReply
  ) => {
    const { conversation: conversationId } = request.params;

    const conversation = await getConversation(conversationId);

    return reply.status(200).send(conversation);
  }
);

export const makeConversationController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { conversation: string };
      Body: { senderId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { conversation: conversationId } = request.params;
    const { senderId } = request.body;

    // get Agent
    const agent = await getAgentById(senderId);

    // Get Conversation
    const { simulationId, messages, activeSpeakerId, id } =
      await getConversation(conversationId);

    const simulation = await getSimulation(simulationId);

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
        parentType: "conversation",
        simulationId,
        content: text,
        tokens: usage,
      };

      await createMessage(Msg);

      // Update conversation
      await updateConversation(conversationId, senderId);
    }

    return reply.status(200).send();
  }
);

export const startConversationController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { conversation: string };
      Body: { senderId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { conversation: conversationId } = request.params;
    const { topic, simulationId, participants } = await getConversation(
      conversationId
    );

    const { senderId } = request.body;

    const recieverId = participants.find((p) => p !== senderId);

    if (!recieverId) throw new Error("Reciever Id in conversation not found.");

    // get Agent
    const sender = await getAgentById(senderId);
    const reciever = await getAgentById(recieverId as string);
    const simulation = await getSimulation(simulationId);

    // Send first message
    const { text, usage } = await generateText({
      model: openai(process.env.DEFAULT_LLM_MODEL as string),
      system: await parsePrompt(sender, simulation),
      prompt: `Formulera en fördjupande och tydlig fråga kring följande topic: ${topic}`,
    });

    const initMessage: Message = {
      parentId: conversationId,
      parentType: "conversation",
      content: text,
      senderId,
      simulationId,
      tokens: usage,
    };

    await createMessage(initMessage);

    // Update conversation state and updated_at = onChange
    await supabase
      .from(process.env.CONVERSATIONS_TABLE_NAME as string)
      .update({ active: true })
      .eq("id", conversationId)
      .select();

    return reply.status(200).send({
      message: `Conversation ${conversationId} between ${sender.name} and ${reciever.name} has started.`,
    });
  }
);

export const endConversationController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { conversation: string };
    }>,
    reply: FastifyReply
  ) => {
    const { conversation: conversationId } = request.params;

    await supabase
      .from(process.env.CONVERSATIONS_TABLE_NAME as string)
      .update({ active: false })
      .eq("id", conversationId)
      .select();

    return reply
      .status(200)
      .send({ message: `Conversation ${conversationId} ended.` });
  }
);

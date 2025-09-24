import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler } from "../core";

import {
  getSimulation,
  createConversation,
  getConversation,
  getAgentById,
  assignActivityToAgent,
  conversationQueue,
} from "../services";

export const createConversationController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: { senderId: string; receiverId: string; simulationId: string };
    }>,
    reply: FastifyReply
  ) => {
    console.log("Creating conversation...");

    const { senderId, receiverId, simulationId } = request.body;

    const simulation = await getSimulation(simulationId);
    const sender = await getAgentById(senderId);
    const receiver = await getAgentById(receiverId);

    // Create conversation
    const conversation = await createConversation(simulation, sender, receiver);

    // Update agent states
    for await (const agentId of conversation.participants) {
      await assignActivityToAgent(agentId, conversation.id);
    }

    return reply.status(201).send({
      ...conversation,
      messages: [],
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

export const startConversationController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { conversation: string };
      Body: { senderId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { conversation: conversationId } = request.params;
    const conversation = await getConversation(conversationId);

    const { senderId } = request.body;

    const receiverId = conversation.participants.find(
      (p: string) => p !== senderId
    );
    if (!receiverId) throw new Error("receiver Id in conversation not found.");

    // get Agents
    const sender = await getAgentById(senderId);
    const receiver = await getAgentById(receiverId);

    // Send to Conversation Queue
    await conversationQueue.add("conversation.start", conversation);

    return reply.status(200).send({
      message: `Conversation ${conversationId} between ${sender.name} and ${receiver.name} has started.`,
    });
  }
);

import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler } from "../core";

import {
  getSimulation,
  createConversation,
  getConversation,
  getAgentById,
  assignActivityToAgent,
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

    // Update agent states
    await assignActivityToAgent(sender.id, conversation.id);
    await assignActivityToAgent(reciever.id, conversation.id);

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
    const { simulationId, participants } = await getConversation(
      conversationId
    );

    const { senderId } = request.body;

    const recieverId = participants.find((p) => p !== senderId);
    if (!recieverId) throw new Error("Reciever Id in conversation not found.");

    // get Agents
    const sender = await getAgentById(senderId);
    const reciever = await getAgentById(recieverId as string);

    // Send to Conversation Queue

    return reply.status(200).send({
      message: `Conversation ${conversationId} between ${sender.name} and ${reciever.name} has started.`,
    });
  }
);

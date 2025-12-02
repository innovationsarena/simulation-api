import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler, InteractionInput } from "../core";
import {
  createInteraction,
  deleteInteraction,
  getInteraction,
  getSimulation,
  interactionsQueue,
  listMessagesByInteractionId,
  summarizeInteractions,
  updateInteraction,
} from "../services";

export const createInteractionController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: InteractionInput;
    }>,
    reply: FastifyReply
  ) => {
    const { simulationId, participants, turns } = request.body;

    const { type } = await getSimulation(simulationId);

    const interaction = await createInteraction(
      simulationId,
      type,
      participants,
      turns
    );

    return reply.status(201).send(interaction);
  }
);

export const startInteractionController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { interactionId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { interactionId } = request.params;

    const interaction = await getInteraction(interactionId);

    await updateInteraction({ ...interaction, active: true });

    await interactionsQueue.add(
      `interaction.${interaction.type}.start`,
      interaction
    );

    delete interaction.summary;

    return reply.status(200).send(interaction);
  }
);

export const getInteractionController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { interactionId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { interactionId } = request.params;

    const interaction = await getInteraction(interactionId);

    return reply.status(200).send(interaction);
  }
);

export const deleteInteractionController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { interactionId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { interactionId } = request.params;

    await deleteInteraction(interactionId);

    return reply.status(200).send({ message: "Interaction deleted." });
  }
);

export const getInteractionMessagesController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { interactionId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { interactionId } = request.params;

    const messages = await listMessagesByInteractionId(interactionId);

    return reply.status(200).send(
      messages.map((c) => {
        return { id: c.senderId, content: c.content };
      })
    );
  }
);

export const getInteractionSummaryController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { interactionId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { interactionId } = request.params;

    const summary = await summarizeInteractions(interactionId);

    return reply.status(200).send(summary);
  }
);

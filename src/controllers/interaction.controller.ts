import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler, InteractionInput } from "../core";
import {
  assignInteractionToAgent,
  createInteraction,
  getInteraction,
  getSimulation,
  interactionsQueue,
  listMessagesByInteractionId,
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

export const getInteractionMessagesController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { interactionId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { interactionId } = request.params;

    const messages = await listMessagesByInteractionId(interactionId);

    return reply.status(200).send(messages.map((c) => c.content));
  }
);

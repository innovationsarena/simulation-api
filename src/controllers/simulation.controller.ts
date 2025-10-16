import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler, generateSimName, id, Simulation } from "../core";

import {
  createSimulation,
  getSimulation,
  listAgents,
  stopSimulation,
  listInteractions,
  listMessagesBySimulationId,
  summarizeSimulation,
} from "../services";
import { simulationQueue } from "../services/simulations/workers";

export const createSimulationController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: Pick<
        Simulation,
        "id" | "name" | "description" | "type" | "input" | "environmentId"
      >;
    }>,
    reply: FastifyReply
  ) => {
    const newSimulation: Simulation = {
      ...request.body,
      id: request.body.id || id(12),
      name: request.body.name.length ? request.body.name : generateSimName(),
      state: "primed",
      type: request.body.type,
      stats: {
        agents: 0,
        interactions: 0,
        tokens: {
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
        },
      },
    };

    const simulation = await createSimulation(newSimulation);
    return reply.status(201).send(simulation);
  }
);

export const getSimulationController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { simulationId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { simulationId } = request.params;

    const simulation = await getSimulation(simulationId);

    if (!simulation)
      reply
        .status(404)
        .send({ message: "Simulation with given ID not found." });

    const agents = await listAgents(simulationId);
    const interactions = await listInteractions(simulationId);
    const messages = await listMessagesBySimulationId(simulationId);

    const tokenStatsInput = messages.reduce(
      (acc, message) => acc + (message.tokens?.inputTokens || 0),
      0
    );
    const tokenStatsOutput = messages.reduce(
      (acc, message) => acc + (message.tokens?.outputTokens || 0),
      0
    );

    simulation.stats.agents = agents.length || 0;
    simulation.stats.interactions = interactions.length || 0;
    simulation.stats.tokens = {
      inputTokens: tokenStatsInput || 0,
      outputTokens: tokenStatsOutput || 0,
      totalTokens: tokenStatsInput + tokenStatsOutput,
    };

    reply.status(200).send(simulation);
  }
);

export const startSimulationController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { simulationId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { simulationId } = request.params;

    const simulation = await getSimulation(simulationId);

    if (!simulation)
      reply
        .status(404)
        .send({ message: "Simulation with given ID not found." });

    await simulationQueue.add("simulation.start", simulation);

    reply.status(200).send({ message: `Simulation ${simulationId} started.` });
  }
);

export const stopSimulationController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { simulationId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { simulationId } = request.params;
    const simulation = await getSimulation(simulationId);

    if (!simulation)
      reply
        .status(404)
        .send({ message: "Simulation with given ID not found." });

    const stoppedSimulation = await stopSimulation(simulation);

    return reply.status(200).send(stoppedSimulation);
  }
);

export const listSimulationMessagesController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { simulationId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { simulationId } = request.params;

    const messages = await listMessagesBySimulationId(simulationId);

    return reply.status(200).send(messages);
  }
);

export const listSimulationAgentsController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { simulationId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { simulationId } = request.params;

    const agents = await listAgents(simulationId);

    return reply.status(200).send(agents);
  }
);

export const listSimulationInteractionsController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { simulationId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { simulationId } = request.params;

    const interactions = await listInteractions(simulationId);

    return reply.status(200).send(interactions);
  }
);

export const summarizeSimulationController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { simulationId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { simulationId } = request.params;

    const summary = await summarizeSimulation(simulationId);

    return reply.status(200).send(summary);
  }
);

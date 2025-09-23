import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler, generateSimName, id, Simulation } from "../core";

import {
  createSimulation,
  getSimulation,
  listAgents,
  stopSimulation,
  listInteractions,
  listMessagesBySimulationId,
} from "../services";
import { simulationQueue } from "../services/simulations/workers";

export const createSimulationController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: Pick<
        Simulation,
        "id" | "name" | "description" | "type" | "topic" | "environment"
      >;
    }>,
    reply: FastifyReply
  ) => {
    const simulationId = id(12);

    const newSimulation: Simulation = {
      ...request.body,
      id: simulationId,
      name: request.body.name.length ? request.body.name : generateSimName(),
      state: "primed",
      type: request.body.type,
      stats: {
        agents: 0,
        interactions: 0,
        tokens: {
          promptTokens: 0,
          completionTokens: 0,
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

    simulation.stats.agents = agents.length;

    reply.status(200).send({ simulation });
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

export const listInteractionsController = asyncHandler(
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

import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler, generateSimName, id, Simulation } from "../core";

import {
  createSimulation as createSimulationOperation,
  getSimulation,
  supabase,
} from "../services";
import { simulationQueue } from "../services/simulations/workers";

export const createSimulation = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: Pick<
        Simulation,
        | "id"
        | "name"
        | "description"
        | "type"
        | "agentCount"
        | "topic"
        | "environment"
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
    };

    const simulation = await createSimulationOperation(newSimulation);
    return reply.status(201).send(simulation);
  }
);

export const startSimulation = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { simulationId: string };
    }>,
    reply: FastifyReply
  ) => {
    const simulation = await getSimulation(request.params.simulationId);
    if (!simulation)
      reply
        .status(404)
        .send({ message: "Simulation with given ID not found." });

    await simulationQueue.add("simulation.start", simulation);

    reply
      .status(200)
      .send({ message: `Simulation ${request.params.simulationId} started.` });
  }
);

export const stopSimulation = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { simulationId: string };
    }>,
    reply: FastifyReply
  ) => {
    const simulation = await getSimulation(request.params.simulationId);

    supabase
      .from(process.env.SIMULATIONS_TABLE_NAME as string)
      .update({ state: "stopped" })
      .eq("id", request.params.simulationId)
      .select();

    return reply.status(200).send({
      ...simulation,
      state: "stopped",
    });
  }
);

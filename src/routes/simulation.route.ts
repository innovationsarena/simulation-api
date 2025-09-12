import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { validateKey } from "../core";
import {
  createSimulation,
  startSimulation,
  stopSimulation,
} from "../controllers";
import z from "zod";

const createSimulationSchema = z.strictObject({
  agentCount: z.number().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  topic: z.string(),
  type: z.enum(["conversation", "discussion", "survey"]),
});

export const simulationRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/simulations",
    {
      schema: createSimulationSchema,
      preValidation: [validateKey],
    },
    createSimulation
  );

  fastify.patch(
    "/simulations/:simulationId/start",
    {
      preValidation: [validateKey],
      preHandler: [],
    },
    startSimulation
  );

  fastify.patch(
    "/simulations/:simulationId/stop",
    {
      preValidation: [validateKey],
    },
    stopSimulation
  );
};

import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { validateKey } from "../core";
import {
  createSimulationController,
  startSimulationController,
  stopSimulationController,
  getSimulationController,
} from "../controllers";
import z from "zod";

const createSimulationSchema = z.strictObject({
  name: z.string().optional(),
  description: z.string().optional(),
  topic: z.string(),
  type: z.enum(["conversation", "discussion", "survey"]),
});

export const simulationRouter = (fastify: FastifyInstance) => {
  fastify.get(
    "/simulations/:simulationId",
    {
      preValidation: [validateKey],
      preHandler: [],
    },
    getSimulationController
  );

  fastify.post(
    "/simulations",
    {
      schema: createSimulationSchema,
      preValidation: [validateKey],
    },
    createSimulationController
  );

  fastify.patch(
    "/simulations/:simulationId/start",
    {
      preValidation: [validateKey],
      preHandler: [],
    },
    startSimulationController
  );

  fastify.patch(
    "/simulations/:simulationId/stop",
    {
      preValidation: [validateKey],
    },
    stopSimulationController
  );
};

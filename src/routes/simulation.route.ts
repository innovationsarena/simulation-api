import { FastifyInstance } from "fastify";
import { SimulationInputSchema } from "../core";
import {
  getSimulationController,
  stopSimulationController,
  startSimulationController,
  createSimulationController,
  listSimulationAgentsController,
  listSimulationMessagesController,
  listSimulationInteractionsController,
} from "../controllers";
import { validateKey } from "../middlewares";

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
      schema: SimulationInputSchema,
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

  fastify.get(
    "/simulations/:simulationId/messages",
    {
      preValidation: [validateKey],
    },
    listSimulationMessagesController
  );

  fastify.get(
    "/simulations/:simulationId/agents",
    {
      preValidation: [validateKey],
    },
    listSimulationAgentsController
  );

  fastify.get(
    "/simulations/:simulationId/interactions",
    {
      preValidation: [validateKey],
    },
    listSimulationInteractionsController
  );
};

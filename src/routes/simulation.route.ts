import { FastifyInstance } from "fastify";
import { simulationInputSchema, validateKey } from "../core";
import {
  getSimulationController,
  stopSimulationController,
  startSimulationController,
  createSimulationController,
  listSimulationAgentsController,
  listSimulationMessagesController,
  listSimulationInteractionsController,
} from "../controllers";

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
      schema: simulationInputSchema,
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

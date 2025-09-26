import { FastifyInstance } from "fastify";
import { validateKey } from "../middlewares";
import {
  AgentInputSchema,
  CustomAgentInputSchema,
  EvaluationInputSchema,
  RandomAgentInputSchema,
} from "../core";

import {
  generateRandomAgents,
  generateAgentsController,
  createCustomAgentController,
  getAgentController,
} from "../controllers";

export const agentRouter = (fastify: FastifyInstance) => {
  fastify.get(
    "/agent/:agentId",
    {
      schema: {},
      preValidation: [validateKey],
    },
    getAgentController
  );

  fastify.post(
    "/agents",
    {
      schema: AgentInputSchema,
      preValidation: [validateKey],
    },
    generateAgentsController
  );

  fastify.post(
    "/agents/custom",
    {
      schema: CustomAgentInputSchema,
      preValidation: [validateKey],
    },
    createCustomAgentController
  );

  fastify.post(
    "/agents/random",
    {
      schema: RandomAgentInputSchema,
      preValidation: [validateKey],
    },
    generateRandomAgents
  );

  fastify.post(
    "/agent/:agentId/evaluate",
    {
      schema: EvaluationInputSchema,
      preValidation: [validateKey],
    },
    getAgentController
  );
};

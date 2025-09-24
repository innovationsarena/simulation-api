import { FastifyInstance } from "fastify";
import {
  agentInputSchema,
  customAgentInputSchema,
  evaluationInputSchema,
  randomAgentInputSchema,
  validateKey,
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
      schema: agentInputSchema,
      preValidation: [validateKey],
    },
    generateAgentsController
  );

  fastify.post(
    "/agents/custom",
    {
      schema: customAgentInputSchema,
      preValidation: [validateKey],
    },
    createCustomAgentController
  );

  fastify.post(
    "/agents/random",
    {
      schema: randomAgentInputSchema,
      preValidation: [validateKey],
    },
    generateRandomAgents
  );

  fastify.post(
    "/agent/:agentId/evaluate",
    {
      schema: evaluationInputSchema,
      preValidation: [validateKey],
    },
    getAgentController
  );
};

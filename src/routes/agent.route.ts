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
  evaluateAgentController,
  updateAgentController,
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

  fastify.patch(
    "/agents/:agentId",
    {
      schema: CustomAgentInputSchema,
      preValidation: [validateKey],
    },
    updateAgentController
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
    "/agents/:agentId/evaluate",
    {
      schema: EvaluationInputSchema,
      preValidation: [validateKey],
    },
    evaluateAgentController
  );
};

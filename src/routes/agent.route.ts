import { FastifyInstance } from "fastify";
import { validateKey } from "../core";
import {
  generateRandomAgents,
  generateAgentsController,
  createCustomAgentController,
} from "../controllers";
import z from "zod";

const createAgentSchema = z.strictObject({
  id: z.string(),
  simulationId: z.string(),
  version: z.string(),
  name: z.string(),
  objectives: z.array(z.unknown()),
  personality: z.object({}).passthrough(),
  demographics: z.object({}).passthrough(),
});

const generateAgentsSchema = z.strictObject({
  simulationId: z.string(),
  version: z.string(),
  count: z.number(),
});

export const agentRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/agents",
    {
      schema: generateAgentsSchema,
      preValidation: [validateKey],
    },
    generateAgentsController
  );

  fastify.post(
    "/agents/custom",
    {
      schema: createAgentSchema,
      preValidation: [validateKey],
    },
    createCustomAgentController
  );

  fastify.post(
    "/agents/random",
    {
      schema: generateAgentsSchema,
      preValidation: [validateKey],
    },
    generateRandomAgents
  );
};

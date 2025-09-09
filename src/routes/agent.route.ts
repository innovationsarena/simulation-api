import { FastifyInstance } from "fastify";
import { validateKey } from "../core";
import {
  generateRandomAgents,
  generateAgentsController,
  createCustomAgentController,
} from "../controllers";
import z from "zod";

const createAgentSchema = z
  .object({
    id: z.string(),
    simulationId: z.string(),
    version: z.string(),
    name: z.string(),
    objectives: z.array(z.unknown()),
    personality: z.object({}).passthrough(),
    demographics: z.object({}).passthrough(),
  })
  .strict();

const generateAgentsSchema = z
  .object({
    simulationId: z.string(),
    version: z.string(),
    count: z.number(),
  })
  .strict();

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

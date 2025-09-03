import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { validateKey } from "../core";
import {
  generateAgentController,
  generateRandomAgentController,
  createAgentController,
} from "../controllers";

export const agentRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/agents/custom",

    {
      schema: {
        description: "Creates one Agent from input.",
        tags: ["agents"],
        body: {
          type: "object",
          properties: {
            id: { type: "string" },
            simulationId: { type: "string" },
            name: { type: "string" },
            objectives: { type: "array" },
            personality: { type: "object" },
            demographics: { type: "object" },
          },
          required: ["version", "simulationId"],
          additionalProperties: false,
        },
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    createAgentController as unknown as RouteHandlerMethod
  );
  fastify.post(
    "/agents",

    {
      schema: {
        description: "Creates one or more Agent.",
        tags: ["agents"],
        body: {
          type: "object",
          properties: {
            version: { type: "integer" },
            count: { type: "integer" },
            simulationId: { type: "string" },
          },
          required: ["count", "version", "simulationId"],
          additionalProperties: false,
        },
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    generateAgentController as unknown as RouteHandlerMethod
  );
  fastify.post(
    "/agents/random",
    {
      schema: {
        description:
          "Creates one or more Agent by randomly generate values in personality values.",
        tags: ["agents"],
        body: {
          type: "object",
          properties: {
            version: { type: "integer" },
            count: { type: "integer" },
            simulationId: { type: "string" },
          },
          required: ["count", "version", "simulationId"],
          additionalProperties: false,
        },
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    generateRandomAgentController as unknown as RouteHandlerMethod
  );
};

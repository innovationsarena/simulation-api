import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { validateKey } from "../core";
import { createAgent, createRandomAgent } from "../controllers";

export const agentRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/agents",

    {
      /*
      schema: {
        body: {
          type: "object",
          properties: {
            version: { type: "integer" },
            count: { type: "integer" },
            simulationId: { type: "string" },
          },
          required: ["version"],
          additionalProperties: false,
        },
      },
      */
      config: {
        description: "Creates one or more Agent.",
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    createAgent as unknown as RouteHandlerMethod
  );
  fastify.post(
    "/agents/random",
    {
      /*
      schema: {
        body: {
          type: "object",
          properties: {
            version: { type: "integer" },
            count: { type: "integer" },
            simulationId: { type: "string" },
          },
          required: ["version"],
          additionalProperties: false,
        },
      },
      */
      config: {
        description:
          "Creates one or more Agent by randomly generate values in personality values.",
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    createRandomAgent as unknown as RouteHandlerMethod
  );
};

import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { validateKey } from "../core";
import {
  createSimulation,
  startSimulation,
  stopSimulation,
} from "../controllers";

export const simulatorRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/simulations",
    {
      schema: {
        description: "Creates a simulation.",
        tags: ["simulations"],
        body: {
          type: "object",
          properties: {
            agentCount: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
            topic: { type: "string" },
          },
          required: ["agentCount", "name", "topic"],
          additionalProperties: false,
        },
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    createSimulation as unknown as RouteHandlerMethod
  );

  fastify.patch(
    "/simulation/:simulation/start",
    {
      schema: {
        description: "Starts a simulation.",
        tags: ["simulations"],
        params: {
          type: "object",
          properties: {
            simulation: { type: "string" },
          },
          required: ["simulation"],
        },
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    startSimulation as unknown as RouteHandlerMethod
  );

  fastify.patch(
    "/simulation/:simulation/stop",
    {
      schema: {
        description: "Stops a simulation.",
        tags: ["simulations"],
        params: {
          type: "object",
          properties: {
            simulation: { type: "string" },
          },
          required: ["simulation"],
        },
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    stopSimulation as unknown as RouteHandlerMethod
  );
};

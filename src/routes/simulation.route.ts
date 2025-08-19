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
            type: { type: "string" },
          },
          required: ["agentCount", "type", "name", "topic"],
          additionalProperties: false,
        },
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    createSimulation as unknown as RouteHandlerMethod
  );

  fastify.patch(
    "/simulations/:simulationId/start",
    {
      schema: {
        description: "Starts a simulation.",
        tags: ["simulations"],
        params: {
          type: "object",
          properties: {
            simulationId: { type: "string" },
          },
          required: ["simulationId"],
        },
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    startSimulation as unknown as RouteHandlerMethod
  );

  fastify.patch(
    "/simulations/:simulationId/stop",
    {
      schema: {
        description: "Stops a simulation.",
        tags: ["simulations"],
        params: {
          type: "object",
          properties: {
            simulationId: { type: "string" },
          },
          required: ["simulationId"],
        },
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    stopSimulation as unknown as RouteHandlerMethod
  );
};

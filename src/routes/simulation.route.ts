import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { validateKey } from "../core";
import { createSimulation } from "../controllers";

export const simulatorRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/simulations",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            agentCount: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
            topic: { type: "string" },
          },
          required: ["agentCount", "name"],
          additionalProperties: false,
        },
      },
      config: {
        description: "Creates a simulation.",
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    createSimulation as unknown as RouteHandlerMethod
  );
};

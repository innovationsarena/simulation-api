import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { validateKey } from "../core";
import { pingController } from "../controllers";

export const pingRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/ping",
    {
      schema: {
        description: "Ping test.",
        tags: ["ping"],
        body: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
          required: ["message"],
          additionalProperties: false,
        },
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    pingController as unknown as RouteHandlerMethod
  );
};

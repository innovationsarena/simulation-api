import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { validateKey } from "../core";
import { pingController } from "../controllers";

export const pingRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/ping",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
          required: ["message"],
          additionalProperties: false,
        },
      },
      config: {
        description: "Ping test.",
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    pingController as unknown as RouteHandlerMethod
  );
};

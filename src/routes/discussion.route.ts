import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { validateKey } from "../core";
import { createDiscussionController } from "../controllers/discussion.controller";

export const discussionRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/discussions",
    {
      schema: {
        description: "Create a new discussion.",
        tags: ["discussions"],
        body: {
          type: "object",
          properties: {
            agents: { type: "array" },
            minRounds: { type: "number" },
            simulationId: { type: "string" },
          },
          required: ["simulationId"],
          additionalProperties: false,
        },
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    createDiscussionController as unknown as RouteHandlerMethod
  );
};

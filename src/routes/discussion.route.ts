import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { validateKey } from "../core";
import z from "zod";
import { createDiscussionController } from "../controllers";

const createDiscussionSchema = z
  .object({
    agents: z.array(z.any()).optional(),
    minRounds: z.number().optional(),
    simulationId: z.string(),
  })
  .strict();

export const discussionRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/discussions",
    {
      schema: createDiscussionSchema,
      preValidation: [validateKey],
    },
    createDiscussionController
  );
};

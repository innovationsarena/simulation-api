import { createDiscussionController } from "../controllers";
import { FastifyInstance } from "fastify";
import { validateKey } from "../core";
import z from "zod";

const createDiscussionSchema = z.strictObject({
  agents: z.array(z.any()).optional(),
  minRounds: z.number().optional(),
  simulationId: z.string(),
});

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

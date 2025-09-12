import { createBigFiveEvaluationController } from "../controllers";
import { FastifyInstance } from "fastify";
import { validateKey } from "../core";
import z from "zod";

const createEvaluationSchema = z.strictObject({
  agentId: z.string(),
  sample: z.string().optional(),
});

export const evaluationsRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/evaluations/bigfive",
    {
      schema: createEvaluationSchema,
      preValidation: [validateKey],
    },
    createBigFiveEvaluationController
  );
};

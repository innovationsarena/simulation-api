import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { validateKey } from "../core";
import { createBigFiveEvaluation } from "../controllers";

export const evaluationsRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/evaluations/bigfive",
    {
      schema: {
        description: "Creates Agent big five (BFI-2) evaluations.",
        tags: ["evaluations"],
        body: {
          type: "object",
          properties: {
            agentId: { type: "string" },
            sample: { type: "number" },
          },
          required: ["agentId"],
          additionalProperties: false,
        },
      },
      preValidation: [validateKey],
    },
    createBigFiveEvaluation as RouteHandlerMethod
  );
};

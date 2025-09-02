import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { validateKey } from "../core";
import {
  createBigFiveEvaluation,
  createQuestionnaireEvaluation,
} from "../controllers";

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
          },
          required: ["agentId"],
          additionalProperties: false,
        },
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    createBigFiveEvaluation as unknown as RouteHandlerMethod
  );
  fastify.post(
    "/evaluations/questions",
    {
      schema: {
        description: "Creates Agent questionnare evaluations.",
        tags: ["evaluations"],
        body: {
          type: "object",
          properties: {
            agentId: { type: "string" },
          },
          required: ["agentId"],
          additionalProperties: false,
        },
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    createQuestionnaireEvaluation as unknown as RouteHandlerMethod
  );
};

import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler } from "../core";

type CreateAgentEvaluationRequest = FastifyRequest<{
  Body: {
    agentId: string;
  };
}>;

export const createBigFiveEvaluation = asyncHandler(
  async (request: CreateAgentEvaluationRequest, reply: FastifyReply) => {
    reply.status(200).send({ message: "OK" });
  }
);

export const createQuestionnaireEvaluation = asyncHandler(
  async (request: CreateAgentEvaluationRequest, reply: FastifyReply) => {
    reply.status(200).send({ message: "OK" });
  }
);

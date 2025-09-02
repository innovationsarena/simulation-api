import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler } from "../core";
import { evaluateBigfive } from "../services";

type CreateAgentEvaluationRequest = FastifyRequest<{
  Body: {
    agentId: string;
  };
}>;

export const createBigFiveEvaluation = asyncHandler(
  async (request: CreateAgentEvaluationRequest, reply: FastifyReply) => {
    const { agentId } = request.body;

    const resp = await evaluateBigfive(agentId, reply);

    reply.status(200).send({ message: resp });
  }
);

export const createQuestionnaireEvaluation = asyncHandler(
  async (request: CreateAgentEvaluationRequest, reply: FastifyReply) => {
    reply.status(200).send({ message: "OK" });
  }
);

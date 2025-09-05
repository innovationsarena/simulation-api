import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler } from "../core";

export const createBigFiveEvaluation = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: {
        agentId: string;
        sample?: number;
      };
    }>,
    reply: FastifyReply
  ) => {
    const { agentId, sample } = request.body;

    return reply.status(200).send({
      message: "Evaluation started.",
    });
  }
);

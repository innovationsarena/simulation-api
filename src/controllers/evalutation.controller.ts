import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler } from "../core";
import { evaluationsQueue } from "../services";

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

    await evaluationsQueue.add(
      "",
      { agentId, sample },
      { removeOnComplete: true, removeOnFail: true }
    );

    return reply.status(200).send({
      message: "Evaluation started.",
    });
  }
);

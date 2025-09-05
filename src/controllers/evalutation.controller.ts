import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler } from "../core";

import { eventBus } from "../services";

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

    eventBus.emit("agent.evalute.bigfive", { agentId, sample });

    return reply.status(200).send({
      message: "Evaluation started.",
    });
  }
);

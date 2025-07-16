import { FastifyReply, FastifyRequest } from "fastify";
import { Agent, id, asyncHandler } from "../core";
import { generateAgent, generateRandomAgent } from "../core/services";

type CreateAgentRequest = FastifyRequest<{
  Body: {
    version: number;
    count?: number;
    simulationId?: string;
  };
}>;

type AgentResponse = {
  agents: Agent[];
};

export const createAgent = asyncHandler(
  async (
    request: CreateAgentRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> => {
    const count: number = request.body.count ?? 1;
    const simulationId: string = request.body.simulationId
      ? request.body.simulationId
      : id(16);

    const agents: Agent[] = [];

    for (let i = 0; i < count; i++) {
      agents.push(await generateAgent(request.body.version, simulationId));
    }

    const response: AgentResponse = { agents };
    return reply.status(201).send(response);
  }
);

export const createRandomAgent = asyncHandler(
  async (
    request: CreateAgentRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> => {
    const count: number = request.body.count ?? 1;
    const simulationId: string = request.body.simulationId
      ? request.body.simulationId
      : id(16);

    const agents: Agent[] = [];

    for (let i = 0; i < count; i++) {
      agents.push(
        await generateRandomAgent(request.body.version, simulationId)
      );
    }

    const response: AgentResponse = { agents };
    return reply.status(201).send(response);
  }
);

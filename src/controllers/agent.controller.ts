import { FastifyReply, FastifyRequest } from "fastify";
import {
  Agent,
  id,
  asyncHandler,
  BigFivePersonalityModel,
  Demographics,
} from "../core";
import { createAgent, generateAgent, generateRandomAgent } from "../services";

export const createCustomAgentController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: {
        simulationId: string;
        id: string;
        personality: BigFivePersonalityModel;
        name: string;
        demographics: Demographics;
        objectives: string[];
      };
    }>,
    reply: FastifyReply
  ) => {
    const {
      id: agentId,
      personality,
      demographics,
      name,
      simulationId,
      objectives,
    } = request.body;

    const agent: Agent = {
      id: agentId || id(),
      version: 2,
      name,
      simulationId,
      state: "idle",
      inActivityId: null,
      objectives,
      demographics,
      personality,
      llmSettings: {
        provider: process.env.DEFAULT_LLM_PROVIDER as string,
        model: process.env.DEFAULT_LLM_MODEL as string,
        temperature: 0.5,
        messageToken: 500,
      },
    };

    await createAgent(agent);

    return reply.status(201).send(agent);
  }
);

export const generateAgentsController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: {
        simulationId: string;
        version: string;
        count: number;
      };
    }>,
    reply: FastifyReply
  ) => {
    const count: number = request.body.count ?? 1;

    const agents: Agent[] = [];

    for (let i = 0; i < count; i++) {
      agents.push(
        await generateAgent(
          parseInt(request.body.version),
          request.body.simulationId
        )
      );
    }

    return reply.status(201).send({ agents });
  }
);

type GenerateAgent = {
  Body: {
    simulationId: string;
    version: string;
    count: number;
  };
};

export const generateRandomAgents = asyncHandler(
  async (request: FastifyRequest<GenerateAgent>, reply: FastifyReply) => {
    const count: number = request.body.count ?? 1;

    const agents: Agent[] = [];

    for (let i = 0; i < count; i++) {
      agents.push(
        await generateRandomAgent(
          parseInt(request.body.version),
          request.body.simulationId
        )
      );
    }

    return reply.status(201).send({ agents });
  }
);

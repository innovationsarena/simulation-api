import { FastifyReply, FastifyRequest } from "fastify";
import {
  Agent,
  id,
  asyncHandler,
  CustomAgentInput,
  RandomAgentInput,
  AgentInput,
  EvaluationInput,
} from "../core";

import {
  createAgents,
  evaluationsQueue,
  generateAgent,
  generateRandomAgent,
  getAgentById,
  getSimulation,
  updateAgent,
  updateSimulation,
} from "../services";

export const createCustomAgentController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: CustomAgentInput;
    }>,
    reply: FastifyReply
  ) => {
    const {
      id: agentId,
      personality,
      demographics,
      name,
      type,
      simulationId,
      objectives,
      organization,
    } = request.body;

    const agent: Agent = {
      id: agentId || id(),
      version: 2,
      name,
      simulationId,
      type,
      state: "idle",
      inInteractionId: null,
      objectives,
      organization,
      demographics,
      personality,
      llmSettings: {
        provider: process.env.DEFAULT_LLM_PROVIDER as string,
        model: process.env.DEFAULT_LLM_MODEL as string,
        temperature: 0.5,
        messageToken: 500,
      },
    };

    await createAgents([agent]);

    return reply.status(201).send(agent);
  }
);

export const generateAgentsController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: AgentInput;
    }>,
    reply: FastifyReply
  ) => {
    const count: number = request.body.count ?? 1;
    const version: number = request.body.version ?? 2;
    const { simulationId } = request.body;

    const agents: Agent[] = [];

    for (let i = 0; i < count; i++) {
      agents.push(await generateAgent(version, simulationId));
    }

    await createAgents(agents);

    return reply.status(201).send({ agents });
  }
);

export const updateAgentController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: CustomAgentInput;
      Params: { agentId: string };
    }>,
    reply: FastifyReply
  ) => {
    const agent = await getAgentById(request.params.agentId);

    const updatedAgent = await updateAgent({ ...agent, ...request.body });

    return reply.status(200).send(updatedAgent);
  }
);

export const generateRandomAgents = asyncHandler(
  async (
    request: FastifyRequest<{ Body: RandomAgentInput }>,
    reply: FastifyReply
  ) => {
    const count: number = request.body.count ?? 1;
    const version: number = request.body.version ?? 2;
    const { simulationId } = request.body;

    const agents: Agent[] = [];

    for (let i = 0; i < count; i++) {
      agents.push(await generateRandomAgent(version, simulationId));
    }

    const simulation = await getSimulation(request.body.simulationId);

    await updateSimulation({ ...simulation, stats: { agents: count } });

    await createAgents(agents);

    return reply.status(201).send({ agents });
  }
);

export const getAgentController = asyncHandler(
  async (
    request: FastifyRequest<{ Params: { agentId: string } }>,
    reply: FastifyReply
  ) => {
    const agent = await getAgentById(request.params.agentId);

    return reply.status(200).send(agent);
  }
);

export const evaluateAgentController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: EvaluationInput;
      Params: { agentId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { agentId } = request.params;
    const { samples, type } = request.body;

    if (type === "bigfive") {
      await evaluationsQueue.add(
        "evaluation.bigfive",
        { agentId, samples, type },
        { removeOnComplete: true, removeOnFail: true }
      );
    }

    return reply
      .status(200)
      .send({ message: `Evaluation of agent ${agentId} started.` });
  }
);

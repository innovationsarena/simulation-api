import { FastifyReply, FastifyRequest } from "fastify";
import {
  id,
  Agent as AgentType,
  asyncHandler,
  CustomAgentInput,
  RandomAgentInput,
  AgentInput,
  EvaluationInput,
  AgentChatInput,
  createShortHash,
  BFI2AgentInput,
  supabase,
} from "../core";

import {
  createAgents,
  evaluationsQueue,
  generateAgent,
  generateRandomAgent,
  getAgentById,
  getSimulation,
  parsePrompt,
  updateAgent,
  updateSimulation,
  generateRandomName,
  retriever,
} from "../services";

import { openai } from "@ai-sdk/openai";
import { generateBFI2Agent } from "@services/agents/generator/bfi2form";
import { Agent } from "@voltagent/core";

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

    const agent: AgentType = {
      id: createShortHash(agentId) || id(),
      version: 2,
      name: name ? name : generateRandomName(),
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

    const agents: AgentType[] = [];

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

    const agents: AgentType[] = [];

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

export const AgentChatController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: AgentChatInput;
      Params: { agentId: string };
      Querystring: { includeHistory?: boolean };
    }>,
    reply: FastifyReply
  ) => {
    const { agentId } = request.params;
    const { prompt } = request.body;
    console.log(agentId);
    if (!prompt) throw new Error("Message to Agent missing.");

    const agent = await getAgentById(agentId);

    const a = new Agent({
      name: agent.name,
      id: agent.id,
      purpose: "An Agent in a simulation.",
      instructions: await parsePrompt(agent),
      model: openai(agent.llmSettings.model),
      retriever: retriever,
    });

    const { text } = await a.generateText(prompt);

    return reply.status(200).send({ message: text });
  }
);

export const bfi2AgentController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: BFI2AgentInput;
    }>,
    reply: FastifyReply
  ) => {
    const { bfi2email, simulationId } = request.body;

    const { data, error } = await supabase
      .from(process.env.BFI_TABLE_NAME as string)
      .select("*")
      .eq("email", bfi2email)
      .single();

    if (error) console.error(error);

    const agent = await generateBFI2Agent(data, simulationId);
    await createAgents([agent]);

    return reply.status(200).send(agent);
  }
);

export const getAgentPromptController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { agentId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { agentId } = request.params;

    const agent = await getAgentById(agentId);
    const simulation = await getSimulation(agent.simulationId);

    const prompt = await parsePrompt(agent, simulation);

    return reply.status(200).send(prompt);
  }
);

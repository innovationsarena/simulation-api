import { FastifyReply, FastifyRequest } from "fastify";
import {
  Agent,
  id,
  asyncHandler,
  BigFivePersonalityModel,
  handleControllerError,
} from "../core";
import { generateAgent, generateRandomAgent, supabase } from "../services";

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

export const generateAgentController = asyncHandler(
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

export const generateRandomAgentController = asyncHandler(
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

export const createAgentController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: {
        id: string;
        personality: BigFivePersonalityModel;
        name: string;
        age: number;
        sex: "male" | "female";
        objectives: string[];
        simulationId: string;
      };
    }>,
    reply: FastifyReply
  ) => {
    const {
      id: agentId,
      personality,
      name,
      sex,
      age,
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
      demographics: {
        age,
        sex,
      },
      personality,
      llmSettings: {
        provider: "openai",
        model: "gpt-5-mini",
        temperature: 0.5,
        messageToken: 500,
      },
    };

    const { data, error } = await supabase
      .from(process.env.AGENTS_TABLE_NAME as string)
      .insert(agent)
      .select();

    if (error) handleControllerError(error, reply);

    return reply.status(201).send(agent);
  }
);

export const agentSubscribe = async (agent: Agent) => {
  const channel = supabase.channel(agent.inActivityId as string);
  channel.subscribe((msg) => {
    console.log(msg);
  });
};

export const agentUnsubscribe = async (agent: Agent) => {
  const channel = supabase.channel(agent.inActivityId as string);
  channel.unsubscribe();
};

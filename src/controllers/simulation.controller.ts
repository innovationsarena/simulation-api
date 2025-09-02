import { FastifyReply, FastifyRequest } from "fastify";
import {
  Agent,
  asyncHandler,
  generateSimName,
  handleControllerError,
  id,
  Message,
  Simulation,
} from "../core";

import {
  createConversation,
  createMessage,
  generateRandomAgents,
  getSimulation,
  listAgents,
  parsePrompt,
  supabase,
  updateConversation,
} from "../services";

import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

type CreateSimulationRequest = FastifyRequest<{
  Body: Pick<
    Simulation,
    | "id"
    | "name"
    | "description"
    | "type"
    | "agentCount"
    | "topic"
    | "environment"
  >;
}>;

export const createSimulation = asyncHandler(
  async (request: CreateSimulationRequest, reply: FastifyReply) => {
    try {
      const simulationId = id(12);

      const simulation: Simulation = {
        ...request.body,
        id: simulationId,
        name: request.body.name.length ? request.body.name : generateSimName(),
        state: "primed",
        type: request.body.type,
      };

      // Write simulation to db
      const {
        data: simulationData,
        error: createSimulationError,
      }: PostgrestSingleResponse<Simulation> = await supabase
        .from(process.env.SIMULATIONS_TABLE_NAME as string)
        .insert(simulation)
        .select()
        .single();

      if (!simulationData && createSimulationError)
        handleControllerError(createSimulationError, reply);

      // Generate agents
      console.log("Generating random agents...");
      const agents = await generateRandomAgents(
        simulation.agentCount,
        2,
        simulation.id
      );

      // Writes agents to db
      const {
        data: agentsData,
        error: createAgentsError,
      }: PostgrestResponse<Agent> = await supabase
        .from(process.env.AGENTS_TABLE_NAME as string)
        .insert([...agents])
        .select();

      if (!agentsData && createAgentsError)
        handleControllerError(createSimulationError, reply);

      // Return simulation object
      const response: { simulation: Simulation; agents: Agent[] } = {
        simulation,
        agents,
      };

      return reply.status(201).send(response);
    } catch (error) {
      handleControllerError(error, reply);
    }
  }
);

export const startSimulation = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { simulationId: string };
    }>,
    reply: FastifyReply
  ) => {
    try {
      const simulationId = request.params.simulationId;

      if (!simulationId)
        reply
          .status(400)
          .send(
            "Missing simulationId in URL - /simulations/:simulationId/start"
          );

      const simulation = await getSimulation(simulationId, reply);

      const { data, error } = await supabase
        .from(process.env.SIMULATIONS_TABLE_NAME as string)
        .update({ state: "running" })
        .eq("id", simulationId)
        .select();

      if (error) handleControllerError(error, reply);

      const agents = await listAgents(simulationId, reply);

      // Start conversations by split in half and start conversate.
      const halfAgentCount = Math.ceil(agents.length / 2);
      const senders = agents.slice(0, halfAgentCount);
      const recievers = agents.slice(halfAgentCount);

      for await (const sender of senders) {
        if (recievers.length) {
          const reciever = recievers.pop();
          if (reciever) {
            // create conversation
            if (simulation.type === "conversation") {
              const conversation = await createConversation(
                simulation,
                sender,
                reciever,
                reply
              );

              const { text, usage } = await generateText({
                model: openai(process.env.DEFAULT_LLM_MODEL as string),
                system: await parsePrompt(sender, simulation),
                prompt: `Formulera endast EN genomtänkt och tydlig fråga kring följande topic: ${simulation.topic}. Du skall endast ställa frågor. Inget resonemang. 1-2st mening.`,
              });

              const initMessage: Message = {
                parentId: conversation.id,
                content: text,
                senderId: sender.id,
                simulationId,
                tokens: usage,
              };

              await createMessage(initMessage, reply);
              await updateConversation(conversation.id, sender.id);
            }
          }
        }
      }

      reply.status(200).send({
        ...simulation,
        state: "running",
      });
    } catch (error) {
      console.log(error);
      // Handle errors
      reply.status(500).send({ error: "Failed to start simulation." });
    }
  }
);

export const stopSimulation = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { simulationId: string };
    }>,
    reply: FastifyReply
  ) => {
    try {
      if (!request.params.simulationId)
        reply
          .status(400)
          .send(
            "Missing simulationId in URL - /simulations/:simulationId/stop"
          );

      const simulation = await getSimulation(
        request.params.simulationId,
        reply
      );

      supabase
        .from(process.env.SIMULATIONS_TABLE_NAME as string)
        .update({ state: "stopped" })
        .eq("id", request.params.simulationId)
        .select();

      // Start conversations

      return reply.status(200).send({
        ...simulation,
        state: "stopped",
      });
    } catch (error) {
      // Handle errors
      reply.status(500).send({ error: "Failed to stop simulation." });
    }
  }
);

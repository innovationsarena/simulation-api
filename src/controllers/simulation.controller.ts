import { FastifyReply, FastifyRequest } from "fastify";
import {
  asyncHandler,
  generateSimName,
  getSimulation,
  handleControllerError,
  id,
  Simulation,
  supabase,
} from "../core";
import axios from "axios";
import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import { Agent } from "http";

type CreateSimulationRequest = FastifyRequest<{
  Body: Pick<
    Simulation,
    "id" | "name" | "description" | "agentCount" | "topic" | "environment"
  >;
}>;

type CreateSimulationResponse = {
  simulation: Simulation;
  agents: {
    id: string;
    name: string;
    sex: string;
  }[];
};

export const createSimulation = asyncHandler(
  async (request: CreateSimulationRequest, reply: FastifyReply) => {
    try {
      const simulationId = id(12);

      const simulation: Simulation = {
        ...request.body,
        id: simulationId,
        name: request.body.name.length ? request.body.name : generateSimName(),
        state: "primed",
        type: "discussion",
      };

      // Create simulation
      const {
        data: simulationData,
        error: createSimulationError,
      }: PostgrestSingleResponse<Simulation> = await supabase
        .from(process.env.SIMULATIONS_TABLE_NAME as string)
        .insert(simulation)
        .select()
        .single();

      if (!simulationData && createSimulationError)
        return reply
          .status(createSimulationError.code as unknown as number)
          .send(createSimulationError.message);
      console.log("Generating agents...");
      // Generate agents
      const {
        data: { agents },
      } = await axios.post(
        process.env.AGENTS_API_URL as string,
        {
          version: 2,
          count: request.body.agentCount ?? 1,
          simulationId: simulationId,
        },
        {
          headers: {
            authorization: `Bearer ${process.env.API_KEY}`,
            contentType: "application/json",
          },
        }
      );

      // Create agents in db
      const {
        data: agentsData,
        error: createAgentsError,
      }: PostgrestResponse<Agent> = await supabase
        .from(process.env.AGENTS_TABLE_NAME as string)
        .insert([...agents])
        .select();

      if (!agentsData && createAgentsError)
        return reply
          .status(createAgentsError.code as unknown as number)
          .send(createAgentsError.message);

      // Init simulation ( agents find convo partner and start conversate )

      // Return sim
      const response: CreateSimulationResponse = {
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
      if (!request.params.simulationId)
        reply
          .status(400)
          .send("Missing simulationId in URL - /simulations/:simulationId/start");

      const simulation = await getSimulation(request.params.simulationId, reply);

      supabase
        .from(process.env.SIMULATIONS_TABLE_NAME as string)
        .update({ state: "running" })
        .eq("id", request.params.simulationId)
        .select();

      // Start conversations

      return reply.status(200).send({
        ...simulation,
        state: "running",
      });
    } catch (error) {
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
          .send("Missing simulationId in URL - /simulations/:simulationId/stop");

      const simulation = await getSimulation(request.params.simulationId, reply);

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

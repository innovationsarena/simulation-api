import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler, id, Simulation, supabase } from "../core";

type CreateSimulationRequest = FastifyRequest<{
  Body: Pick<
    Simulation,
    "id" | "name" | "description" | "agentCount" | "topic"
  >;
}>;

type CreateSimulationResponse = {
  simulation: Simulation;
  agents: { id: string; name: string; sex: string }[];
};

export const createSimulation = asyncHandler(
  async (
    request: CreateSimulationRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> => {
    const simulationId = id(12);

    const simulation: Simulation = {
      ...request.body,
      type: "discussion",
      id: simulationId,
    };

    // Create simulation
    await supabase
      .from(process.env.SIMULATIONS_TABLE_NAME)
      .insert([simulation])
      .select()
      .single();

    // Generate agents
    const resp = await fetch(process.env.AGENTS_API_URL, {
      method: "post",
      headers: {
        authentication: `Bearer ${process.env.API_KEY}`,
      },
    });

    const { agents } = await resp.json();

    // Return sim
    const response: CreateSimulationResponse = {
      simulation,
      agents,
    };

    return reply.status(200).send(response);
  }
);

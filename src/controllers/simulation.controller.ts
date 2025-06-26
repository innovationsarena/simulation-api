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
    try {
      const simulationId = id(12);

      const simulation: Simulation = {
        ...request.body,
        type: "discussion",
        id: simulationId,
      };

      // Create simulation
      await supabase
        .from(process.env.SIMULATIONS_TABLE_NAME as string)
        .insert([simulation])
        .select()
        .single();

      // Generate agents
      const resp = await fetch(process.env.AGENTS_API_URL as string, {
        method: "post",
        headers: {
          authorization: `Bearer ${process.env.API_KEY}`,
          contentType: "application/json",
        },
        body: JSON.stringify({
          version: 2,
          count: request.body.agentCount ?? 1,
        }),
      });

      const { agents } = await resp.json();
      // Start unity /init

      // Return sim
      const response: CreateSimulationResponse = {
        simulation,
        agents,
      };

      return reply.status(200).send(response);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Generic error message" });
    }
  }
);

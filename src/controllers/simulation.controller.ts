import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler, id, Simulation, supabase } from "../core";
import axios from "axios";

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
      await supabase
        .from(process.env.AGENTS_TABLE_NAME as string)
        .insert([...agents])
        .select();

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

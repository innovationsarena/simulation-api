import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase, Simulation } from "../../../core";
import { listAgents } from "../../agents";
import { createConversation } from "../../conversations";

export const getSimulation = async (
  simulationId: string
): Promise<Simulation> => {
  const { data: simulation, error }: PostgrestSingleResponse<Simulation> =
    await supabase
      .from(process.env.SIMULATIONS_TABLE_NAME as string)
      .select("*")
      .eq("id", simulationId)
      .single();

  if (error) throw new Error(error.message);

  return simulation;
};

export const createSimulation = async (
  simulation: Simulation
): Promise<Simulation> => {
  const { data, error }: PostgrestSingleResponse<Simulation> = await supabase
    .from(process.env.SIMULATIONS_TABLE_NAME as string)
    .insert(simulation)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const updateSimulationState = async (
  simulationId: string,
  state: "primed" | "running" | "ended" | "stopped"
): Promise<Simulation> => {
  const { data: simulation, error }: PostgrestSingleResponse<Simulation> =
    await supabase
      .from(process.env.SIMULATIONS_TABLE_NAME as string)
      .update({ state })
      .eq("id", simulationId)
      .select()
      .single();

  if (error) throw new Error(error.message);

  return simulation;
};

export const startSimulation = async (simulationId: string) => {
  const simulation = await getSimulation(simulationId);

  const { data, error } = await supabase
    .from(process.env.SIMULATIONS_TABLE_NAME as string)
    .update({ state: "running" })
    .eq("id", simulationId)
    .select();

  if (error) throw new Error(error.message);

  const agents = await listAgents(simulationId);

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
            reciever
          );
          console.log(conversation);
        }
      }
    }
  }
};

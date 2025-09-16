import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { conversationQueue, createConversation } from "../../conversations";
import { supabase, Simulation, Agent } from "../../../core";
import { listAgents } from "../../agents";
import { discussionQueue } from "../../discussions";

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

export const startSimulation = async (simulation: Simulation) => {
  console.log(`Starting simulation ${simulation.id}...`);

  await updateSimulation({ ...simulation, state: "running" });
  const agents = await listAgents(simulation.id);

  if (simulation.type === "conversation") {
    // Start conversations by split in half and start conversate.
    const halfAgentCount = Math.ceil(agents.length / 2);
    const senders = agents.slice(0, halfAgentCount);
    const recievers = agents.slice(halfAgentCount);

    for await (const sender of senders) {
      if (recievers.length) {
        const reciever = recievers.pop() as Agent;

        // create conversation
        const conversation = await createConversation(
          simulation,
          sender,
          reciever
        );

        // Send to Conversation Queue
        await conversationQueue.add("conversation.start", {
          simulation,
          conversation,
          sender,
          reciever,
        });
      }
    }
  }

  console.log(`Simulation ${simulation.id} started.`);
};

export const stopSimulation = async (
  simulation: Simulation
): Promise<boolean> => {
  // Update simulation state
  await updateSimulation({
    ...simulation,
    state: "stopped",
  });
  // End all activities

  // Clear queues?
  await conversationQueue.drain();
  await discussionQueue.drain();

  // Update all Agent states

  console.log(`Simulation ${simulation.id} stopped.`);
  return true;
};

export const updateSimulation = async (
  simulation: Simulation
): Promise<Simulation> => {
  const {
    data: updatedSimulation,
    error,
  }: PostgrestSingleResponse<Simulation> = await supabase
    .from(process.env.SIMULATIONS_TABLE_NAME as string)
    .update({ ...simulation })
    .eq("id", simulation.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return updatedSimulation;
};

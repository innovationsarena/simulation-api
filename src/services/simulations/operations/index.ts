import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase, Simulation, Agent } from "@core";
import { listAgents } from "@services/agents";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import {
  createInteraction,
  interactionsQueue,
  listInteractions,
} from "@services/interactions";

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
    const receivers = agents.slice(halfAgentCount);

    for await (const sender of senders) {
      if (receivers.length) {
        const receiver = receivers.pop() as Agent;

        // create interaction
        const conversation = await createInteraction(
          simulation.id,
          simulation.type,
          [sender.id, receiver.id]
        );

        // Send to Conversation Queue
        await interactionsQueue.add("interaction.start", {
          simulation,
          conversation,
          sender,
          receiver,
        });
      }
    }
  }

  console.log(`Simulation ${simulation.id} started.`);
};

export const stopSimulation = async (
  simulation: Simulation
): Promise<Simulation> => {
  // Update simulation state
  const stoppedSimulation = await updateSimulation({
    ...simulation,
    state: "stopped",
  });

  // End all interactions
  // Update all Agents

  // Clear queues?
  await interactionsQueue.drain();

  // Update all Agent states

  console.log(`Simulation ${stoppedSimulation.id} stopped.`);
  return stoppedSimulation;
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

export const summarizeSimulation = async (
  simulationId: string
): Promise<{ summary: string }> => {
  const { output } = await getSimulation(simulationId);
  const interactions = await listInteractions(simulationId);
  console.log(
    interactions.length + " interactions found in " + simulationId + "."
  );

  const system = `# Instructions: 
  You are an expert meta-summarizer specialized in compressing interaction-summaries into clear, factual, and context-preserving outputs. You never guess, invent, or over-generalize. You distill only what is present in the provided summaries.
  All text should be in swedish.
  `;
  const prompt = `## Data to summarize (list of interactions): ${JSON.stringify(
    interactions.map((i) => i.summary)
  )} `;

  const { text } = await generateText({
    model: openai((process.env.SUMMARIZER_AGENT_MODEL as string) || "gpt-5.1"),
    system: output?.summaryPrompt || system,
    prompt,
    providerOptions: {
      openai: {
        reasoningEffort: "medium",
        reasoningSummary: "auto",
      },
    },
  });

  return { summary: text };
};

import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase, Simulation, Agent } from "@core";
import { listAgents } from "../../agents";
import {
  createInteraction,
  interactionsQueue,
  listInteractions,
} from "../../interactions";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

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
  const interactions = await listInteractions(simulationId);
  const system = `# Instructions: 
  You are the Ultimate Summarizer. Given a list of discussion summaries, produce a cross-summary synthesis (do not re-summarize each item).

Output as bullet lists with these sections:

Core insights: 5-10 distilled takeaways that hold across summaries; note strength/impact.
Recurring patterns/themes: cluster common ideas; include frequency like [7/12] and cite sample IDs (e.g., S3, S8).
Valuable specifics: concrete data points, decisions, constraints, definitions; cite IDs.
Divergences/contradictions: what disagrees, where (IDs), and stated reasons if provided.
Actions/next steps: prioritized, deduplicated, with owners/timelines if present.
Open questions/risks: unknowns, assumptions, blockers.

Requirements:
Be concise; bullets only; no intro/outro.
Synthesize across items; merge duplicates; avoid repetition.
Use neutral, evidence-based language; no speculation beyond the text.
Quantify when possible (counts, ranges).
If information is insufficient, state whats missing.
  `;
  const prompt = `## Data to summarize (list of interactions): ${JSON.stringify(
    interactions.map((i) => i.summary)
  )} `;

  const { text } = await generateText({
    model: openai("gpt-5"),
    system,
    prompt,
    providerOptions: {
      openai: {
        reasoningEffort: "high",
        reasoningSummary: "auto",
      },
    },
  });

  return { summary: text };
};

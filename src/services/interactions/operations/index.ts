import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import {
  id,
  Interaction,
  Message,
  SimulationType,
  supabase,
} from "../../../core";
import { interactionsQueue } from "../workers";
import {
  assignInteractionToAgent,
  removeInteractionFromAgent,
} from "../../agents";
import { listMessagesByInteractionId } from "../../messages";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const listInteractions = async (
  simulationId: string
): Promise<Interaction[]> => {
  try {
    const { data: interactions, error }: PostgrestResponse<Interaction> =
      await supabase
        .from(process.env.INTERACTIONS_TABLE_NAME as string)
        .select("*")
        .eq("simulationId", simulationId);

    if (error) throw new Error(error.message);

    return interactions;
  } catch (error) {
    return [];
  }
};

export const getInteraction = async (
  interactionId: string
): Promise<Interaction> => {
  const { data: interaction, error }: PostgrestSingleResponse<Interaction> =
    await supabase
      .from(process.env.INTERACTIONS_TABLE_NAME as string)
      .select("*")
      .eq("id", interactionId)
      .single();

  if (error) throw new Error(error.message);

  return interaction;
};

export const createInteraction = async (
  simulationId: string,
  type: SimulationType,
  participants: string[],
  turns: number = 3
): Promise<Interaction> => {
  const newInteraction = {
    id: id(16),
    active: false,
    simulationId,
    type,
    participants,
    turns,
  };

  const { data: interaction, error }: PostgrestSingleResponse<Interaction> =
    await supabase
      .from(process.env.INTERACTIONS_TABLE_NAME as string)
      .insert(newInteraction)
      .select()
      .single();

  if (error) throw new Error(error.message);

  // Update agents
  for await (const agentId of participants) {
    await assignInteractionToAgent(agentId, newInteraction.id);
  }

  return interaction;
};

export const updateInteraction = async (
  interaction: Interaction
): Promise<Interaction> => {
  const {
    data: updatedInteraction,
    error,
  }: PostgrestSingleResponse<Interaction> = await supabase
    .from(process.env.INTERACTIONS_TABLE_NAME as string)
    .update(interaction)
    .eq("id", interaction.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return updatedInteraction;
};

export const startInteraction = async (
  interactionId: string
): Promise<void> => {
  const interaction = await getInteraction(interactionId);

  await interactionsQueue.add(
    `interaction.${interaction.id}.start`,
    interaction
  );

  return;
};

export const endInteraction = async (
  interaction: Interaction
): Promise<void> => {
  // Update agents
  for await (const participant of interaction.participants) {
    await removeInteractionFromAgent(participant);
  }

  // Summarize
  const messages: Message[] = await listMessagesByInteractionId(interaction.id);
  if (messages) {
    const { text } = await generateText({
      model: openai("gpt-5-mini"),
      system:
        "Summarize the following conversation between two or more agents in a single concise paragraph (no bullets or lists). Include key points and decisions, action item, unresolved questions/next steps, and tone/sentiment. Be factual, neutral, and concise; add timestamps or brief quotes when relevant.",
      prompt: `#Messages \n\n ${messages.map((m) => m.content)}`,
    });

    if (text) {
      await updateInteraction({ ...interaction, summary: text, active: false });
    }
    return;
  }
};

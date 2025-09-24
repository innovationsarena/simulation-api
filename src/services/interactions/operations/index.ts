import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import { id, Interaction, SimulationType, supabase } from "../../../core";

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
  participants: string[]
): Promise<Interaction> => {
  const newInteraction = {
    id: id(16),
    active: true,
    simulationId,
    type,
    participants,
  };

  const { data: interaction, error }: PostgrestSingleResponse<Interaction> =
    await supabase
      .from(process.env.INTERACTIONS_TABLE_NAME as string)
      .insert(newInteraction)
      .select()
      .single();

  if (error) throw new Error(error.message);

  return interaction;
};

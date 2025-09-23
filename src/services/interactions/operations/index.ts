import { PostgrestResponse } from "@supabase/supabase-js";
import { Interaction, supabase } from "../../../core";

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

import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Agent, supabase } from "@core";

export const setBigfiveEvaluation = async (
  agentId: string,
  results: number
): Promise<Agent> => {
  const { data: agent, error }: PostgrestSingleResponse<Agent> = await supabase
    .from(process.env.AGENTS_TABLE_NAME as string)
    .update({ evaluations: { bigFiveSimilarity: results } })
    .eq("id", agentId)
    .single();

  if (error) throw new Error(error.message);

  return agent;
};

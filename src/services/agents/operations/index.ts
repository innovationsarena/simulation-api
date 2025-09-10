import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import { Agent, BigFiveEvaluation, Evaluations } from "../../../core";
import { supabase } from "../../../core/supabase";

export const listAgents = async (simulationId: string): Promise<Agent[]> => {
  const { data: agents, error }: PostgrestResponse<Agent> = await supabase
    .from(process.env.AGENTS_TABLE_NAME as string)
    .select("*")
    .eq("simulationId", simulationId);

  if (error) throw new Error(error.message);

  return agents;
};

export const getAgentById = async (agentId: string): Promise<Agent> => {
  const { data: agent, error }: PostgrestSingleResponse<Agent> = await supabase
    .from(process.env.AGENTS_TABLE_NAME as string)
    .select("*")
    .eq("id", agentId)
    .single();

  if (error) throw new Error(error.message);

  return agent;
};

export const getAgentByName = async (
  simulationId: string,
  name: string
): Promise<Agent> => {
  const { data: agent, error: getAgentError }: PostgrestSingleResponse<Agent> =
    await supabase
      .from(process.env.AGENTS_TABLE_NAME as string)
      .select("*")
      .eq("simulationId", simulationId)
      .eq("name", name)
      .single();

  if (getAgentError) throw new Error(getAgentError.message);

  return agent;
};

export const createAgents = async (agents: Agent[]) => {
  const { data, error }: PostgrestResponse<Agent> = await supabase
    .from(process.env.AGENTS_TABLE_NAME as string)
    .insert([...agents])
    .select();

  if (error) throw new Error(error.message);

  return data;
};

export const assignActivityToAgent = async (
  agentId: string,
  activityId: string
): Promise<Agent> => {
  const { data: agent, error }: PostgrestSingleResponse<Agent> = await supabase
    .from(process.env.AGENTS_TABLE_NAME as string)
    .update({ state: "active", inActivityId: activityId })
    .eq("id", agentId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return agent;
};

export const removeActivityFromAgent = async (
  agentId: string
): Promise<Agent> => {
  const { data: agent, error }: PostgrestSingleResponse<Agent> = await supabase
    .from(process.env.AGENTS_TABLE_NAME as string)
    .update({ evaluate: "idle", inActivityId: null })
    .eq("id", agentId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return agent;
};

export const createBigFiveEvaluation = async (
  agentId: string,
  evaluation: BigFiveEvaluation
): Promise<Agent> => {
  const { data: agent, error }: PostgrestSingleResponse<Agent> = await supabase
    .from(process.env.AGENTS_TABLE_NAME as string)
    .update({ evaluations: { bigFive: evaluation } })
    .eq("id", agentId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return agent;
};

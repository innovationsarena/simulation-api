import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import { Agent, BigFiveEvaluation } from "../../../core";
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

export const getIdleAgent = async (
  simulationId: string,
  senderId: string
): Promise<Agent> => {
  const { data: agent, error }: PostgrestSingleResponse<Agent> = await supabase
    .from(process.env.AGENTS_TABLE_NAME as string)
    .select("*")
    .eq("simulationId", simulationId)
    .eq("inInteractionId", null)
    .eq("state", "idle")
    .neq("id", senderId)
    .single();

  if (error) throw new Error(error.message);

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

export const assignInteractionToAgent = async (
  agentId: string,
  interactionId: string
): Promise<Agent> => {
  const { data: agent, error }: PostgrestSingleResponse<Agent> = await supabase
    .from(process.env.AGENTS_TABLE_NAME as string)
    .update({ state: "active", inInteractionId: interactionId })
    .eq("id", agentId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return agent;
};

export const removeInteractionFromAgent = async (
  agentId: string
): Promise<Agent> => {
  const { data: agent, error }: PostgrestSingleResponse<Agent> = await supabase
    .from(process.env.AGENTS_TABLE_NAME as string)
    .update({ evaluate: "idle", inInteractionId: null })
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

import {
  createClient,
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import { Agent, Conversation, Message, Simulation } from "../types";
import { FastifyReply } from "fastify";

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export const getSimulation = async (
  simulationId: string,
  reply: FastifyReply
): Promise<Simulation> => {
  const {
    data: simulation,
    error: getSimulationError,
  }: PostgrestSingleResponse<Simulation> = await supabase
    .from(process.env.SIMULATIONS_TABLE_NAME as string)
    .select("*")
    .eq("id", simulationId)
    .single();

  if (getSimulationError)
    return reply
      .status(getSimulationError.code as unknown as number)
      .send(getSimulationError.message);

  return simulation;
};

export const getConversation = async (
  conversationId: string,
  reply: FastifyReply
): Promise<Conversation> => {
  const {
    data: conversation,
    error: getConversationError,
  }: PostgrestSingleResponse<Conversation> = await supabase
    .from(process.env.CONVERSATIONS_TABLE_NAME as string)
    .select("*")
    .eq("id", conversationId)
    .single();

  if (getConversationError)
    return reply
      .status(getConversationError.code as unknown as number)
      .send(getConversationError.message);

  const {
    data: messages,
    error: getMessagesError,
  }: PostgrestResponse<Message> = await supabase
    .from(process.env.MESSAGES_TABLE_NAME as string)
    .select("*")
    .eq("conversationId", conversationId);

  if (getMessagesError)
    return reply
      .status(getMessagesError.code as unknown as number)
      .send(getMessagesError.message);

  return { ...conversation, messages };
};
export const getAgent = async (
  agentId: string,
  reply: FastifyReply
): Promise<Agent> => {
  const { data: agent, error: getAgentError }: PostgrestSingleResponse<Agent> =
    await supabase
      .from(process.env.CONVERSATIONS_TABLE_NAME as string)
      .select("*")
      .eq("id", agentId)
      .single();

  if (getAgentError)
    return reply
      .status(getAgentError.code as unknown as number)
      .send(getAgentError.message);

  return agent;
};

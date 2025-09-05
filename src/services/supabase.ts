import {
  createClient,
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

import type { Discussion, Message, Simulation } from "../core";

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export const getSimulation = async (
  simulationId: string
): Promise<Simulation> => {
  const {
    data: simulation,
    error: getSimulationError,
  }: PostgrestSingleResponse<Simulation> = await supabase
    .from(process.env.SIMULATIONS_TABLE_NAME as string)
    .select("*")
    .eq("id", simulationId)
    .single();

  if (getSimulationError) throw new Error(getSimulationError.message);

  return simulation;
};

export const getDiscussion = async (discussionId: string) => {
  const {
    data: discussion,
    error: getDiscussionError,
  }: PostgrestSingleResponse<Discussion> = await supabase
    .from(process.env.DISCUSSIONS_TABLE_NAME as string)
    .select("*")
    .eq("id", discussionId)
    .single();

  if (getDiscussionError) throw new Error(getDiscussionError.message);

  const {
    data: messages,
    error: getMessagesError,
  }: PostgrestResponse<Message> = await supabase
    .from(process.env.MESSAGES_TABLE_NAME as string)
    .select("*")
    .eq("parentId", discussionId);

  if (getMessagesError) {
    throw new Error(getMessagesError.message);
  }

  return { ...discussion, messages } as Discussion;
};

export const createMessage = async (message: Message) => {
  const { data, error } = await supabase
    .from(process.env.MESSAGES_TABLE_NAME as string)
    .insert(message)
    .select();

  if (error) throw new Error(error.message);

  return data;
};

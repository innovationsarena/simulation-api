import {
  createClient,
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

import type {
  Agent,
  Conversation,
  Discussion,
  Message,
  Simulation,
} from "../core";

import { id } from "../core";

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

  if (getSimulationError)
    throw new Error(getSimulationError.message);

  return simulation;
};

export const getConversation = async (
  conversationId: string
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
    throw new Error(getConversationError.message);

  const {
    data: messages,
    error: getMessagesError,
  }: PostgrestResponse<Message> = await supabase
    .from(process.env.MESSAGES_TABLE_NAME as string)
    .select("*")
    .eq("conversationId", conversationId);

  if (getMessagesError)
    throw new Error(getMessagesError.message);

  return { ...conversation, messages };
};

export const listAgents = async (
  simulationId: string
): Promise<Agent[]> => {
  const { data, error } = await supabase
    .from(process.env.AGENTS_TABLE_NAME as string)
    .select("*")
    .eq("simulationId", simulationId);

  if (error)
    throw new Error(error.message);
  return data as Agent[];
};

export const getDiscussion = async (
  discussionId: string
) => {
  const {
    data: discussion,
    error: getDiscussionError,
  }: PostgrestSingleResponse<Discussion> = await supabase
    .from(process.env.DISCUSSIONS_TABLE_NAME as string)
    .select("*")
    .eq("id", discussionId)
    .single();

  if (getDiscussionError)
    throw new Error(getDiscussionError.message);

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
  name: string
): Promise<Agent> => {
  const { data: agent, error: getAgentError }: PostgrestSingleResponse<Agent> =
    await supabase
      .from(process.env.AGENTS_TABLE_NAME as string)
      .select("*")
      .eq("name", name)
      .single();

  if (getAgentError)
    throw new Error(getAgentError.message);
  return agent;
};

export const getIdleAgent = async (
  agentId: string
): Promise<Agent> => {
  const {
    data: idleAgent,
    error: getIdleAgentError,
  }: PostgrestSingleResponse<Agent> = await supabase
    .from(process.env.AGENTS_TABLE_NAME as string)
    .select("*")
    .eq("state", "idle")
    .eq("inActivityId", null)
    .single();

  if (getIdleAgentError)
    throw new Error(getIdleAgentError.message);

  return idleAgent;
};

export const createMessage = async (message: Message) => {
  const { data, error } = await supabase
    .from(process.env.MESSAGES_TABLE_NAME as string)
    .insert(message)
    .select();

  if (error)
    throw new Error(error.message);

  return data;
};

export const createConversation = async (
  simulation: Simulation,
  sender: Agent,
  reciever: Agent
): Promise<Conversation> => {
  const conversationId = id(12);

  const conversation: Omit<Conversation, "messages"> = {
    id: conversationId,
    simulationId: simulation.id,
    active: true,
    activeSpeakerId: null,
    topic: simulation.topic,
    participants: [sender.id, reciever.id],
  };

  const { data: createConversation, error: createConversationError } =
    await supabase
      .from(process.env.CONVERSATIONS_TABLE_NAME as string)
      .insert(conversation)
      .select();

  if (createConversationError)
    throw new Error(createConversationError.message);

  return { ...conversation, messages: [] };
};

export const createAgent = async (agent: Agent) => {
  const { data, error } = await supabase
    .from(process.env.AGENTS_TABLE_NAME as string)
    .insert(agent)
    .select();

  if (error) throw new Error(error.message);

  return data;
};

export const updateConversation = async (
  conversationId: string,
  speakerId: string
) => {
  await supabase
    .from(process.env.CONVERSATIONS_TABLE_NAME as string)
    .update({ activeSpeaker: speakerId })
    .eq("id", conversationId)
    .select();
};

supabase
  .channel("conversations-changes")
  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "conversations",
    },
    async (payload) => {
      const { id, activeSpeakerId } = payload.new;
      try {
        console.log(payload);
        const resp = await fetch(`${process.env.API_URL}/conversations/${id}`, {
          headers: { authorization: `Bearer ${process.env.API_KEY}` },
          method: "PATCH",
          body: JSON.stringify({ senderId: activeSpeakerId }),
        });

        console.log(resp);
      } catch (error) {
        console.error(error);
      }
    }
  )
  .subscribe();

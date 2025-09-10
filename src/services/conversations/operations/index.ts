import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import { supabase } from "../../../core/supabase";
import {
  Agent,
  Conversation,
  createConversationId,
  Message,
  Simulation,
} from "../../../core";

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

  if (getConversationError) throw new Error(getConversationError.message);

  const {
    data: messages,
    error: getMessagesError,
  }: PostgrestResponse<Message> = await supabase
    .from(process.env.MESSAGES_TABLE_NAME as string)
    .select("*")
    .eq("conversationId", conversationId);

  if (getMessagesError) throw new Error(getMessagesError.message);

  return { ...conversation, messages };
};

export const createConversation = async (
  simulation: Simulation,
  sender: Agent,
  reciever: Agent
): Promise<Conversation> => {
  const conversationId = createConversationId(sender.id, reciever.id);

  console.log(`Creating conversation ${conversationId}.`);

  const newConversation: Omit<Conversation, "messages"> = {
    id: conversationId,
    simulationId: simulation.id,
    active: true,
    activeSpeakerId: null,
    topic: simulation.topic,
    participants: [sender.id, reciever.id],
  };

  console.log(newConversation);

  const { data: conversation, error }: PostgrestSingleResponse<Conversation> =
    await supabase
      .from(process.env.CONVERSATIONS_TABLE_NAME as string)
      .insert(newConversation)
      .select()
      .single();

  console.log(conversation);

  if (error) throw new Error(error.message);

  return { ...conversation, messages: [] };
};

export const updateActiveSpeaker = async (
  conversationId: string,
  speakerId: string
): Promise<Conversation> => {
  const { data: conversation, error }: PostgrestSingleResponse<Conversation> =
    await supabase
      .from(process.env.CONVERSATIONS_TABLE_NAME as string)
      .update({ activeSpeaker: speakerId })
      .eq("id", conversationId)
      .select()
      .single();

  if (error) throw new Error(error.message);

  return conversation;
};
/*
supabase
  .channel("conversations-changes")
  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "conversations",
    },
    async (payload: any) => {
      try {
        console.log(payload);
      } catch (error) {
        console.error(error);
      }
    }
  )
  .subscribe();

*/

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
import { createInitConversationMessage } from "../../messages";
import { conversationQueue } from "../workers";

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
    .eq("parentId", conversationId);

  if (getMessagesError) throw new Error(getMessagesError.message);

  return { ...conversation, messages };
};

export const createConversation = async (
  simulation: Simulation,
  sender: Agent,
  reciever: Agent
): Promise<Conversation> => {
  const conversationId = createConversationId(sender.id, reciever.id);

  console.log(
    `Creating conversation between ${sender.name} and ${reciever.name} with id ${conversationId}.`
  );

  const newConversation: Omit<Conversation, "messages"> = {
    id: conversationId,
    simulationId: simulation.id,
    active: true,
    activeSpeakerId: null,
    topic: simulation.topic,
    participants: [sender.id, reciever.id],
  };

  const { data: conversation, error }: PostgrestSingleResponse<Conversation> =
    await supabase
      .from(process.env.CONVERSATIONS_TABLE_NAME as string)
      .insert(newConversation) // upsert?
      .select()
      .single();

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
      .update({ activeSpeakerId: speakerId })
      .eq("id", conversationId)
      .select()
      .single();

  console.log(
    `Active spekar in conversation ${conversationId} set to Agent with id ${speakerId}.`
  );

  if (error) throw new Error(error.message);

  return conversation;
};

export const startConversationOperation = async (
  simulation: Simulation,
  conversation: Conversation,
  sender: Agent
): Promise<void> => {
  console.log(`Starting conversation ${conversation.id}.`);

  await updateActiveSpeaker(conversation.id, sender.id);
  await createInitConversationMessage(simulation, conversation, sender);

  await conversationQueue.add("conversation.converse", {
    conversationId: conversation.id,
  });
};

export const endConversationOperation = async (
  conversationId: string
): Promise<void> => {
  console.log(`Ending conversation ${conversationId}.`);

  const conversation = await getConversation(conversationId);

  // Update conversation state

  // Update agents state

  return;
};

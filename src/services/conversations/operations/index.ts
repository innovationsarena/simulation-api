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
  parseMessages,
  Simulation,
} from "../../../core";
import { createInitConversationMessage, createMessage } from "../../messages";
import { conversationQueue } from "../workers";
import {
  conversateTool,
  endConversationTool,
  findConversationPartnerTool,
  getAgentById,
  parsePrompt,
  removeActivityFromAgent,
  startConversationTool,
} from "../../agents";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

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

export const updateConversation = async (
  conversation: Conversation
): Promise<Conversation> => {
  const { data, error } = await supabase
    .from(process.env.CONVERSATIONS_TABLE_NAME as string)
    .update(conversation)
    .eq("id", conversation.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const startConversation = async (
  simulation: Simulation,
  conversation: Conversation,
  sender: Agent
): Promise<void> => {
  console.log(`Starting conversation ${conversation.id}.`);

  await updateConversation({ ...conversation, activeSpeakerId: sender.id });
  await createInitConversationMessage(simulation, conversation, sender);

  await conversationQueue.add("conversation.converse", {
    conversationId: conversation.id,
  });
};

export const conversate = async (conversationId: string) => {
  const conversation = await getConversation(conversationId);

  const { activeSpeakerId, participants, simulationId, messages } =
    conversation;

  const senderId = participants.find((agent) => agent !== activeSpeakerId);
  const sender = await getAgentById(senderId || "");

  const { text, usage } = await generateText({
    model: openai(sender.llmSettings.model),
    system: await parsePrompt(sender),
    messages: parseMessages(messages, sender.id),
    tools: {
      findConversationPartnerTool,
      startConversationTool,
      conversateTool,
      endConversationTool,
    },
  });

  await createMessage({
    senderId: sender.id,
    parentId: conversationId,
    parentType: "discussion",
    content: text,
    simulationId,
    tokens: usage,
  });

  // Keep going?
  await conversationQueue.add("conversation.converse", {
    conversationId: conversation.id,
  });
};

export const endConversation = async (
  conversationId: string
): Promise<void> => {
  console.log(`Ending conversation ${conversationId}.`);

  const conversation = await getConversation(conversationId);

  // Update agents
  for await (const agentId of conversation.participants) {
    await removeActivityFromAgent(agentId);
  }

  // Update conversation
  await updateConversation({
    ...conversation,
    participants: [],
    activeSpeakerId: null,
    active: false,
  });

  return;
};

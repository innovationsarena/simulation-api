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
  assignActivityToAgent,
  converseTool,
  endConversationTool,
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
    .order("created_at", { ascending: true })
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
      .upsert(newConversation) // insert?
      .select()
      .single();

  if (error) throw new Error(error.message);

  console.log(
    `Conversation between ${sender.name} (${sender.id}) and ${reciever.name} (${reciever.id}) with id ${conversationId} created.`
  );

  return { ...conversation, messages: [] };
};

export const updateConversation = async (
  conversation: Conversation
): Promise<Conversation> => {
  if (conversation.messages) {
    delete conversation.messages;
  }

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

  for await (const participant of conversation.participants) {
    await assignActivityToAgent(participant, conversation.id);
  }

  await updateConversation({
    ...conversation,
    activeSpeakerId: sender.id,
  });

  await createInitConversationMessage(simulation, conversation, sender);

  await conversationQueue.add("conversation.converse", {
    conversationId: conversation.id,
  });

  return;
};

export const conversate = async (conversationId: string) => {
  const conversation = await getConversation(conversationId);

  const { id, activeSpeakerId, participants, simulationId, messages } =
    conversation;

  // Switch to new sender
  const senderId = participants.find((agent) => agent !== activeSpeakerId);
  const sender = await getAgentById(senderId || "");

  const { text, usage, toolResults } = await generateText({
    model: openai(sender.llmSettings.model),
    system: await parsePrompt(sender),
    messages: parseMessages(messages || [], sender.id),
    maxSteps: 10,
    tools: {
      converseTool,
      endConversationTool,
    },
    toolChoice: "auto",
  });

  // Only create message if there's text content
  if (text && text.trim()) {
    await createMessage({
      senderId: sender.id,
      parentId: id,
      parentType: "conversation",
      content: text,
      simulationId,
      tokens: usage,
    });
  }

  // Switch active speaker
  await updateConversation({
    ...conversation,
    activeSpeakerId: senderId as string,
  });

  if (
    toolResults &&
    toolResults.some((result: any) => result.toolName === "converseTool")
  ) {
    await conversationQueue.add("conversation.converse", {
      conversationId,
    });
  }
};

export const endConversation = async (
  conversationId: string
): Promise<void> => {
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

  console.log(`Conversation ${conversationId} ended.`);

  return;
};

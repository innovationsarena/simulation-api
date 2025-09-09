import { PostgrestSingleResponse } from "@supabase/supabase-js";
import {
  Agent,
  Conversation,
  Message,
  Simulation,
  supabase,
} from "../../../core";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { parsePrompt } from "../../agents";

export const createMessage = async (message: Message): Promise<Message> => {
  const { data, error }: PostgrestSingleResponse<Message> = await supabase
    .from(process.env.MESSAGES_TABLE_NAME as string)
    .insert(message)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const createInitConversationMessage = async (
  simulation: Simulation,
  conversation: Conversation,
  sender: Agent
): Promise<string> => {
  const { text, usage } = await generateText({
    model: openai(process.env.DEFAULT_LLM_MODEL as string),
    system: await parsePrompt(sender, simulation),
    prompt: `Formulera endast EN genomtänkt och tydlig fråga kring följande topic: ${simulation.topic}. Du skall endast ställa frågor. Inget resonemang. 1-2st mening.`,
  });

  const initMessage: Message = {
    parentId: conversation.id,
    parentType: "conversation",
    content: text,
    senderId: sender.id,
    simulationId: simulation.id,
    tokens: usage,
  };

  await createMessage(initMessage);

  return text;
};

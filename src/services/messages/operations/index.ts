import { PostgrestSingleResponse } from "@supabase/supabase-js";
import {
  Agent,
  Interaction,
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
  interaction: Interaction,
  sender: Agent
): Promise<string> => {
  try {
    const { text, usage } = await generateText({
      model: openai(sender.llmSettings.model as string),
      system: await parsePrompt(sender, simulation),
      prompt: `Formulera endast EN genomtänkt och tydlig fråga kring följande topic: ${simulation.topic}. Du skall endast ställa frågor. Inget resonemang. 1-2st mening.`,
    });

    const initMessage: Message = {
      interactionId: interaction.id,
      interactionType: "conversation",
      content: text,
      senderId: sender.id,
      simulationId: simulation.id,
      stats: usage,
    };

    await createMessage(initMessage);

    console.log(`Init message in conversation ${interaction.id} created.`);

    return text;
  } catch (error) {
    console.error(error);
    return "Error in creating init Message.";
  }
};

export const listMessagesBySimulationId = async (
  simulationId: string
): Promise<Message[]> => {
  try {
    const { data: messages, error } = await supabase
      .from(process.env.MESSAGES_TABLE as string)
      .select("*")
      .eq("simulationId", simulationId);

    if (!messages) throw new Error(error.message);

    return messages;
  } catch (error) {
    console.error(error);
    return [];
  }
};

import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Message, supabase } from "@core";

export const createMessage = async (message: Message): Promise<Message> => {
  const { data, error }: PostgrestSingleResponse<Message> = await supabase
    .from(process.env.MESSAGES_TABLE_NAME as string)
    .insert(message)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const listMessagesBySimulationId = async (
  simulationId: string
): Promise<Message[]> => {
  try {
    const { data: messages, error } = await supabase
      .from(process.env.MESSAGES_TABLE_NAME as string)
      .select("*")
      .eq("simulationId", simulationId);

    if (!messages) throw new Error(error.message);

    return messages;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const listMessagesByInteractionId = async (
  interactionId: string
): Promise<Message[]> => {
  try {
    const { data: messages, error } = await supabase
      .from(process.env.MESSAGES_TABLE_NAME as string)
      .select("*")
      .eq("interactionId", interactionId);

    if (!messages) throw new Error(error.message);

    return messages;
  } catch (error) {
    console.error(error);
    return [];
  }
};

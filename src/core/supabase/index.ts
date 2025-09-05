import { createClient, PostgrestSingleResponse } from "@supabase/supabase-js";

import type { Message } from "..";

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export const createMessage = async (message: Message): Promise<Message> => {
  const { data, error }: PostgrestSingleResponse<Message> = await supabase
    .from(process.env.MESSAGES_TABLE_NAME as string)
    .insert(message)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

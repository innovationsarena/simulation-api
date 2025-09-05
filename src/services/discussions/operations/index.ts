import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import { Discussion, Message, supabase } from "../../../core";

export const getDiscussion = async (
  discussionId: string
): Promise<Discussion> => {
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

  return { ...discussion, messages };
};

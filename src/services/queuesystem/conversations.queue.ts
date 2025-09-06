import { Queue } from "bullmq";
import { Message } from "../../core";

export const create = async (id: string) => {
  return new Queue(id, {
    connection: {
      host: process.env.REDIS_INTERNAL_URL,
      port: 6380,
    },
  });
};

export const add = async (queue: Queue, message: Message): Promise<void> => {
  await queue.add("conversation.message", message, {
    removeOnComplete: true,
    removeOnFail: true,
  });
};

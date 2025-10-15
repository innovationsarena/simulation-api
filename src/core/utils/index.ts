import { ConnectionOptions } from "bullmq";
import type { Message } from "../types";

export const toLocalISO = (date: Date) => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const msLocal = date.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  const iso = dateLocal.toISOString();
  const isoLocal = iso.slice(0, 19);
  return isoLocal;
};

export const parseMessages = (messages: Message[], senderid: string): any[] => {
  return messages.map((message) => {
    return {
      role: message.senderId === senderid ? "user" : "assistant",
      content: message.content,
    };
  });
};

export const connection: ConnectionOptions = {
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
};

export const concurrency: number = 50;

export * from "./errorHandler";
export * from "./generators";

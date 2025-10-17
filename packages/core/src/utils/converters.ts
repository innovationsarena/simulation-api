import { createHash } from "crypto";
import type { Message } from "../types";

export const createShortHash = (str: string, len: number = 8) => {
  return createHash("shake256", { outputLength: len })
    .update(str)
    .digest("hex");
};

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

import { createHash } from "crypto";

export const createShortHash = (str: string, len: number = 8) => {
  return createHash("shake256", { outputLength: len })
    .update(str)
    .digest("hex");
};

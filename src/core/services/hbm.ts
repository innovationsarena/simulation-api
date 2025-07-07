import axios from "axios";
import { Agent } from "../types";

export const parsePrompt = async (agent: Agent): Promise<string | null> => {
  const { data } = await axios.post(
    process.env.PROMPT_PARSE_URL as string,
    agent,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    }
  );

  if (data.prompt) {
    return data.prompt;
  }

  return null;
};

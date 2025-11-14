import { Agent } from "@core/types";
import { generateRandomName } from "./names";
import { createShortHash, supabase } from "@core";

export const generateBFI2Agent = async (
  bfiEmail: string,
  simulationId: string
): Promise<Agent> => {
  const { data } = await supabase
    .from(process.env.BFI_TABLE_NAME as string)
    .select("*")
    .eq("email", bfiEmail)
    .single();

  const base = {
    id: createShortHash(bfiEmail),
    state: "idle" as const,
    simulationId,
    type: "bfi2",
    inInteractionId: null,
    name: generateRandomName(),
    llmSettings: {
      provider: process.env.DEFAULT_LLM_PROVIDER,
      model: process.env.DEFAULT_LLM_MODEL,
      temperature: parseFloat(process.env.DEFAULT_LLM_TEMPERATURE || "0.5"),
      messageToken: parseInt(process.env.DEFAULT_LLM_MESSAGE_TOKEN || "400"),
    },
  };

  return {
    ...base,
    version: 2,
    objectives: [],
    dynamicProps: [],
    personality: {
      source: "bfi2",
      traits: {
        openness: Math.round(data.open_mindedness_overall),
        conscientiousness: Math.round(data.conscientiousness_overall),
        extraversion: Math.round(data.extraversion_overall),
        agreeableness: Math.round(data.agreeableness_overall),
        neuroticism: Math.round(data.negative_emotionality_overall),
      },
    },
  } as Agent;
};

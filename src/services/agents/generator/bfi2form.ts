import { Agent } from "@core/types";
import { generateRandomName } from "./names";
import { createShortHash, supabase } from "@core";

export const generateBFI2Agent = async (
  bfiFormAnswers: any,
  simulationId: string
): Promise<Agent> => {
  const base = {
    id: createShortHash(bfiFormAnswers.email),
    state: "idle" as const,
    simulationId,
    type: "discussion",
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
      source: "BFI-2-form",
      traits: {
        openness: Math.round(bfiFormAnswers.open_mindedness_overall),
        conscientiousness: Math.round(bfiFormAnswers.conscientiousness_overall),
        extraversion: Math.round(bfiFormAnswers.extraversion_overall),
        agreeableness: Math.round(bfiFormAnswers.agreeableness_overall),
        neuroticism: Math.round(bfiFormAnswers.negative_emotionality_overall),
      },
    },
  } as Agent;
};

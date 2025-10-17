import { getRandomNumber, id } from "@core/utils";
import { generateName } from "./names";
import type { Agent } from "@core/types";
import { getBigFivePersonality } from "./personalities";
export * from "./names";

export const generateAgent = async (
  version: number = 2,
  simulationId: string
): Promise<Agent> => {
  const sex = Math.ceil(Math.random() * 2) === 1 ? "female" : "male";
  const age = getRandomNumber(18, 60);
  const defaultLLMsettings = {
    provider: process.env.DEFAULT_LLM_PROVIDER,
    model: process.env.DEFAULT_LLM_MODEL,
    temperature: parseFloat(process.env.DEFAULT_LLM_TEMPERATURE || "0.5"),
    messageToken: parseInt(process.env.DEFAULT_LLM_MESSAGE_TOKEN || "400"),
  };

  const base = {
    id: id(),
    state: "idle" as const,
    simulationId,
    type: "data",
    inInteractionId: null,
    demographics: {
      age: age,
      sex: sex,
    },
    name: generateName(sex),
    llmSettings: defaultLLMsettings,
  };

  return {
    ...base,
    version: 2,
    objectives: [],
    dynamicProps: [],
    personality: getBigFivePersonality(sex, age),
  } as Agent;
};

export const generateRandomAgent = async (
  version: number = 2,
  simulationId: string
): Promise<Agent> => {
  const sex = Math.ceil(Math.random() * 2) === 1 ? "female" : "male";
  const age = getRandomNumber(18, 60);

  const MIN_BIGFIVE_VALUE = 1;
  const MAX_BIGFIVE_VALUE = 5;

  const defaultLLMsettings = {
    provider: process.env.DEFAULT_LLM_PROVIDER,
    model: process.env.DEFAULT_LLM_MODEL,
    temperature: parseFloat(process.env.DEFAULT_LLM_TEMPERATURE || "0.5"),
    messageToken: parseInt(process.env.DEFAULT_LLM_MESSAGE_TOKEN || "400"),
  };

  const base = {
    id: id(),
    state: "idle" as const,
    simulationId,
    type: "random",
    inInteractionId: null,
    demographics: {
      age: age,
      sex: sex,
    },
    name: generateName(sex),
    llmSettings: defaultLLMsettings,
  };

  return {
    ...base,
    version: 2,
    objectives: [],
    dynamicProps: [],
    personality: {
      source: "random-bigfive",
      traits: {
        openness: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
        conscientiousness: getRandomNumber(
          MIN_BIGFIVE_VALUE,
          MAX_BIGFIVE_VALUE
        ),
        extraversion: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
        agreeableness: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
        neuroticism: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
      },
    },
  } as Agent;
};

export const generateRandomAgents = async (
  agentCount: number = 6,
  version: number,
  simulationId: string
): Promise<Agent[]> => {
  const agents = [];

  for (let i = 0; i < agentCount; i++) {
    agents.push(await generateRandomAgent(version, simulationId));
  }
  return agents;
};

export const generateAgents = async (
  agentCount: number = 6,
  version: number,
  simulationId: string
): Promise<Agent[]> => {
  const agents = [];

  for (let i = 0; i < agentCount; i++) {
    agents.push(await generateAgent(version, simulationId));
  }
  return agents;
};

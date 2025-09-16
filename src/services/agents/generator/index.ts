import { getRandomNumber, id } from "../../../core/utils";
import { generateName } from "./names";
import type { Agent } from "../../../core/types";
import {
  getBigFivePersonality,
  getExtendedBigFivePersonality,
  getSimplePersonality,
} from "./personalities";

export const generateAgent = async (
  version: number = 1,
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
    inActivityId: null,
    demographics: {
      age: age,
      sex: sex,
    },
    name: generateName(sex),
    llmSettings: defaultLLMsettings,
  };

  // Basic big five
  if (version === 2) {
    return {
      ...base,
      version: 2,
      objectives: [],
      dynamicProps: [],
      personality: getBigFivePersonality(sex, age),
    } as Agent;
  }

  // Extended  big five
  if (version === 3) {
    return {
      ...base,
      version: 3,
      objectives: [],
      dynamicProps: [],
      personality: getExtendedBigFivePersonality(sex, age),
    } as Agent;
  }

  // Simple random

  return {
    ...base,
    version: 1,
    objectives: [],
    dynamicProps: [],
    personality: getSimplePersonality(),
  } as Agent;
};

export const generateRandomAgent = async (
  version: number = 1,
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
    inActivityId: null,
    demographics: {
      age: age,
      sex: sex,
    },
    name: generateName(sex),
    llmSettings: defaultLLMsettings,
  };

  // Basic big five
  if (version === 2) {
    console.log("Generating Agent with basic random big five personality.");

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
  }

  // Extended  big five
  if (version === 3) {
    console.log("Generating Agent with random extended big five personality.");

    return {
      ...base,
      version: 3,
      objectives: [],
      dynamicProps: [],
      personality: {
        source: "random-extendedbigfive",
        traits: {
          openness: {
            fantasy: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
            aesthetics: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
            feelings: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
            actions: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
            ideas: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
            values: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
          },
          conscientiousness: {
            competence: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
            order: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
            dutifulness: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
            achievementStriving: getRandomNumber(
              MIN_BIGFIVE_VALUE,
              MAX_BIGFIVE_VALUE
            ),
            selfDiscipline: getRandomNumber(
              MIN_BIGFIVE_VALUE,
              MAX_BIGFIVE_VALUE
            ),
            deliberation: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
          },
          extraversion: {
            warmth: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
            gregariousness: getRandomNumber(
              MIN_BIGFIVE_VALUE,
              MAX_BIGFIVE_VALUE
            ),
            assertiveness: getRandomNumber(
              MIN_BIGFIVE_VALUE,
              MAX_BIGFIVE_VALUE
            ),
            activity: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
            excitementSeeking: getRandomNumber(
              MIN_BIGFIVE_VALUE,
              MAX_BIGFIVE_VALUE
            ),
            positiveEmotions: getRandomNumber(
              MIN_BIGFIVE_VALUE,
              MAX_BIGFIVE_VALUE
            ),
          },
          agreeableness: {
            trust: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
            straightforwardness: getRandomNumber(
              MIN_BIGFIVE_VALUE,
              MAX_BIGFIVE_VALUE
            ),
            altruism: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
            compliance: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
            modesty: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
            tenderMindedness: getRandomNumber(
              MIN_BIGFIVE_VALUE,
              MAX_BIGFIVE_VALUE
            ),
          },
          neuroticism: {
            anxiety: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
            angryHostility: getRandomNumber(
              MIN_BIGFIVE_VALUE,
              MAX_BIGFIVE_VALUE
            ),
            depression: getRandomNumber(MIN_BIGFIVE_VALUE, MAX_BIGFIVE_VALUE),
            selfConsciousness: getRandomNumber(
              MIN_BIGFIVE_VALUE,
              MAX_BIGFIVE_VALUE
            ),
            impulsiveness: getRandomNumber(
              MIN_BIGFIVE_VALUE,
              MAX_BIGFIVE_VALUE
            ),
            vulnerability: getRandomNumber(
              MIN_BIGFIVE_VALUE,
              MAX_BIGFIVE_VALUE
            ),
          },
        },
      },
    } as Agent;
  }

  // Simple random
  console.log("Generating random simple big five personality.");
  return {
    ...base,
    version: 1,
    objectives: [],
    dynamicProps: [],
    personality: getSimplePersonality(),
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

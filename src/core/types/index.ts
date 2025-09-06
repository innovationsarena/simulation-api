export type Agent = {
  id: string;
  version: number; // Agent version
  name: string; // Random swe name based on sex
  simulationId: string; // Is the Agent belonging to certain simulation?
  state: "idle" | "waiting" | "active";
  inActivityId: null | string;
  demographics?: Demographics;
  organization?: Organization;
  personality:
    | string
    | BigFivePersonalityModel<string>
    | ExtendedBigFivePersonalityModel<string>;
  objectives: string[]; // [Agent Name/Type] aims to [verb] [target/resource] to achieve [desired state/outcome]
  dynamicProps?: Record<string, any>[];
  llmSettings: LLMSettings;
  evaluations?: Evaluations;
  stats?: Stats;
};

export type Evaluations = {
  bigFiveSimilarity?: number; // Percent
  questionsSimilarity?: number; // Percent
};

export type Organization = {
  role?: string; // Role description?
  hierarchyWeight?: number; // Higher = more important
  subGroups?: string[]; // Departments
};

export type LLMSettings = {
  provider: string; // ex. 'openai'
  model: string; // ex. 'gpt-4o-mini'
  temperature: number; // ex. 0.5, // Dynamically set based on personality?
  messageToken: number; // Long or short messages
};

export type Demographics = {
  age: number;
  sex: "male" | "female"; // ? mer skala?
  educationLevel?: string;
  ethnicity?: string; // Relevant?
};

export type Tokens = {
  promptTokens: number;
  completionTokens: number;
};

export type Stats = {
  messages?: number;
  conversations?: number;
  tokens?: Tokens;
};

export type Facet = {
  code: string;
  value: string | number;
};

export type SimulationType = "discussion" | "conversation" | "survey";

export type Simulation = {
  id: string;
  agentCount: number;
  state: "primed" | "running" | "ended" | "stopped";
  type: SimulationType;
  name: string;
  organizational?: boolean;
  description?: string;
  environment?: Environment;
  topic: string;
  stats?: Stats;
};

export type Environment = {
  id: string;
  description: string;
  objectives: string[]; // Goals
  constraints: string[]; // Budget?
  values: string[]; // Values
};

export type CreateSimulationInput = {
  name: string;
  type: string;
  description?: string;
  agentCount: number;
};

// Simple big five
export type BigFivePersonalityModel<T = string> = {
  source: T; // ESS / LUP?
  traits: {
    openness: number; // 1-10
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
};

// Extended big five
export type ExtendedBigFivePersonalityModel<T = string> = {
  source: T; // ESS / LUP?
  traits: {
    openness: {
      fantasy: number;
      aesthetics: number;
      feelings: number;
      actions: number;
      ideas: number;
      values: number;
    };
    conscientiousness: {
      competence: number;
      order: number;
      dutifulness: number;
      achievementStriving: number;
      selfDiscipline: number;
      deliberation: number;
    };
    extraversion: {
      warmth: number;
      gregariousness: number;
      assertiveness: number;
      activity: number;
      excitementSeeking: number;
      positiveEmotions: number;
    };
    agreeableness: {
      trust: number;
      straightforwardness: number;
      altruism: number;
      compliance: number;
      modesty: number;
      tenderMindedness: number;
    };
    neuroticism: {
      anxiety: number;
      angryHostility: number;
      depression: number;
      selfConsciousness: number;
      impulsiveness: number;
      vulnerability: number;
    };
  };
};

export type DataItem = {
  id: string;
  sex: "male" | "female";
  age: number;
  openness: number; // 1-10
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
};

export type Message = {
  parentId: string; // Conversation/Discussion id
  parentType: SimulationType;
  senderId: string; // Agent Id
  content: string; // Says what
  simulationId: string;
  tokens: Tokens;
};

export type Conversation = {
  id: string;
  simulationId: string; // simulation id
  topic: string;
  active: boolean;
  activeSpeakerId: string | null; // Id of active speaker
  participants: string[]; // Agent Ids
  messages: Message[];
  stats?: Stats;
};

export type Discussion = {
  id: string;
  simulationId: string; // simulation id
  topic: string;
  active: boolean;
  participants: string[]; // Agent Ids
  messages: Message[];
  minRounds?: number;
  stats?: Stats;
};

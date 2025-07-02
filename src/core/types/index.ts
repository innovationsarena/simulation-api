export type Agent = {
  id: string;
  version: number; // Agent version
  name: string; // Random swe name based on sex
  simulationId?: string; // Is the Agent belonging to certain simulation?
  state: "idle" | "waiting" | "occupied";
  inCoversationId: null | string;
  demographics?: Demographics;
  personality:
    | string
    | BigFivePersonalityModel<string>
    | ExtendedBigFivePersonalityModel<string>;
  objectives: string[]; // [Agent Name/Type] aims to [verb] [target/resource] to achieve [desired state/outcome] 15% FORM
  dynamicProps?: Record<string, any>[];
  llmSettings: LLMSettings;
  stats?: Stats;
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
  role?: string; // Role description? 15% FORM
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

export type Simulation = {
  id: string;
  agentCount: number;
  type: "discussion" | "attitude";
  name: string;
  description?: string;
  environment?: Environment;
  topic: string;
  stats?: Stats;
};

export type Environment = {
  id: string;
  description: string;
  objectives: [];
};

export type CreateSimulationInput = {
  name: string;
  description?: string;
  agentCount: number;
};

// Simple big five
export type BigFivePersonalityModel<T = string> = {
  source: T; // ESS / LUP?
  traits: {
    openness: number; // 1-6
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
  openness: number; // 1-6
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
};

export type Message = {
  conversationId: string; // Conversation id
  senderId: string; // Agent Id
  content: string; // Says what
  simulationId: string;
  tokens: Tokens;
};

export type Conversation = {
  id: string; // hashed(agent-id + agent-id)
  simulationId: string; // simulation id
  topic: string;
  active: boolean;
  dialogists: string[]; // Agent Ids
  messages: Message[];
  stats?: Stats;
};

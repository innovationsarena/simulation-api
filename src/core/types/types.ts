export type Agent = {
  id: string;
  version: number; // Agent version
  name: string; // Random swe name based on sex
  simulationId: string;
  type: "custom" | "random" | "data";
  state: "idle" | "active";
  inInteractionId: null | string;
  demographics?: Demographics;
  organization?: Organization;
  personality: BigFivePersonalityModel<string>;
  objectives: string[]; // [Agent Name/Type] aims to [verb] [target/resource] to achieve [desired state/outcome]
  dynamicProps?: Record<string, any>[];
  llmSettings: LLMSettings;
  evaluations?: Evaluations;
  stats?: TokenStats;
};

export type CustomAgentInput = Omit<
  Agent,
  "state" | "stats" | "inInteractionId" | "evaluations"
>;

export type RandomAgentInput = {
  count: number;
  version: number;
  simulationId: string;
};
export type AgentInput = RandomAgentInput;

export type Evaluations = {
  bigFive: BigFiveEvaluation;
  questionnaire?: QuestionnaireEvaluation;
};

export type BigFiveEvaluation = {
  samples: number;
  results: {
    min: number; // Percent
    max: number; // Percent
    avg: number; // Percent
  };
};

export type QuestionnaireEvaluation = {
  version: number;
  results: {
    avg: number; // Percent
  };
};

export type EvaluationInput = {
  type: "bigfive" | "questionnaire";
  samples?: number;
};

export type Organization = {
  role?: string; // Role name
  roleDescription?: string; // Role desc
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
  age: number; // Oftast orelevant
  sex: "male" | "female"; // Oftast orelevant
  educationLevel?: number; // SeQF
};

export type TokenStats = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

export type SimulationType = "discussion" | "conversation" | "survey";

export type Simulation = {
  id: string;
  state: "primed" | "running" | "ended" | "stopped";
  type: SimulationType;
  name: string;
  description?: string;
  environment?: Environment;
  topic: string;
  stats: SimulationStats;
};

export type SimulationInput = Omit<
  Simulation,
  "id" | "state" | "topic" | "environment" | "stats"
>;

export type SimulationStats = {
  agents?: number;
  interactions?: number;
  tokens?: TokenStats;
};

export type Environment = {
  id: string;
  description: string;
  objectives?: string[]; // Goals
  constraints?: string[]; // Budget
  values?: string[]; // Culture
};

export type EnvironmentInput = Omit<Environment, "id">;

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

export type Message = {
  simulationId: string;
  interactionId: string; // Conversation/Discussion id
  interactionType: SimulationType;
  senderId: string; // Agent Id
  content: string; // Says what
  stats?: any;
};

export type MessageInput = Omit<Message, "id" | "stats">;

export type Interaction = {
  id: string;
  type: SimulationType;
  simulationId: string; // simulation id
  active: boolean;
  participants: string[]; // Agent Ids
  messages?: Message[];
  stats?: InteractionStats;
  summary?: string;
};

export type InteractionInput = Pick<
  Interaction,
  "participants" | "simulationId"
>;

export type InteractionStats = {
  messages: number;
  tokens: TokenStats;
};

export type DataItem = {
  id: string;
  age: number;
  sex: "female" | "male";
  agreeableness: number;
  extraversion: number;
  openness: number;
  conscientiousness: number;
  neuroticism: number;
};

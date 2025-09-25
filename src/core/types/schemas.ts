import { z } from "zod";

// Reusable enums
export const SexEnum = z.enum(["male", "female"]);
export const SimulationTypeEnum = z.enum([
  "discussion",
  "conversation",
  "survey",
]);
export const AgentTypeEnum = z.enum(["custom", "random", "data"]);
export const AgentStateEnum = z.enum(["idle", "active"]);

// BigFivePersonalityModel
export const BigFivePersonalityModelSchema = z.object({
  source: z.string(),
  traits: z.object({
    openness: z.number(),
    conscientiousness: z.number(),
    extraversion: z.number(),
    agreeableness: z.number(),
    neuroticism: z.number(),
  }),
});

// Demographics
export const DemographicsSchema = z.object({
  age: z.number(),
  sex: SexEnum,
  educationLevel: z.number().optional(),
});

// Organization
export const OrganizationSchema = z.object({
  role: z.string().optional(),
  roleDescription: z.string().optional(),
  hierarchyWeight: z.number().optional(),
  subGroups: z.array(z.string()).optional(),
});

// LLMSettings
export const LLMSettingsSchema = z.object({
  provider: z.string(),
  model: z.string(),
  temperature: z.number(),
  messageToken: z.number(),
});

// TokenStats
export const TokenStatsSchema = z.object({
  inputTokens: z.number(),
  outputTokens: z.number(),
  totalTokens: z.number(),
});

// Evaluations and related
export const BigFiveEvaluationSchema = z.object({
  samples: z.number(),
  results: z.object({
    min: z.number(),
    max: z.number(),
    avg: z.number(),
  }),
});
export const QuestionnaireEvaluationSchema = z.object({
  version: z.number(),
  results: z.object({
    avg: z.number(),
  }),
});
export const EvaluationsSchema = z.object({
  bigFive: BigFiveEvaluationSchema,
  questionnaire: QuestionnaireEvaluationSchema.optional(),
});

// Agent
export const AgentSchema = z.object({
  id: z.string(),
  version: z.number(),
  name: z.string(),
  simulationId: z.string(),
  type: AgentTypeEnum,
  state: AgentStateEnum,
  inInteractionId: z.string().nullable(),
  demographics: DemographicsSchema.optional(),
  organization: OrganizationSchema.optional(),
  personality: BigFivePersonalityModelSchema,
  objectives: z.array(z.string()),
  dynamicProps: z.array(z.any()).optional(),
  llmSettings: LLMSettingsSchema,
  evaluations: EvaluationsSchema.optional(),
  stats: TokenStatsSchema.optional(),
});

// CustomAgentInput = Omit<Agent, "state" | "stats" | "inInteractionId" | "evaluations">
export const CustomAgentInputSchema = AgentSchema.omit({
  state: true,
  stats: true,
  inInteractionId: true,
  evaluations: true,
});

// RandomAgentInput
export const RandomAgentInputSchema = z.object({
  count: z.number(),
  version: z.number(),
  simulationId: z.string(),
});

// AgentInput = RandomAgentInput
export const AgentInputSchema = RandomAgentInputSchema;

// EvaluationInput
export const EvaluationInputSchema = z.object({
  type: z.enum(["bigfive", "questionnaire"]),
  samples: z.number().optional(),
});

// SimulationStats
export const SimulationStatsSchema = z.object({
  agents: z.number().optional(),
  interactions: z.number().optional(),
  tokens: TokenStatsSchema.optional(),
});

// Simulation
export const SimulationSchema = z.object({
  id: z.string(),
  state: z.enum(["primed", "running", "ended", "stopped"]),
  type: SimulationTypeEnum,
  name: z.string(),
  description: z.string().optional(),
  environmentId: z.string().optional(),
  topic: z.string(),
  stats: SimulationStatsSchema,
});
// SimulationInput = Omit<Simulation, "id" | "state" | "topic" | "environment" | "stats">
export const SimulationInputSchema = SimulationSchema.omit({
  id: true,
  state: true,
  topic: true,
  environment: true,
  stats: true,
});

// Environment
export const EnvironmentSchema = z.object({
  id: z.string(),
  simulationId: z.string(),
  description: z.string(),
  objectives: z.array(z.string()).optional(),
  constraints: z.array(z.string()).optional(),
  values: z.array(z.string()).optional(),
});
// EnvironmentInput = Omit<Environment, "id">
export const EnvironmentInputSchema = EnvironmentSchema.omit({ id: true });

// Message
export const MessageSchema = z.object({
  simulationId: z.string(),
  interactionId: z.string(),
  interactionType: SimulationTypeEnum,
  senderId: z.string(),
  content: z.string(),
  stats: z.any().optional(),
});
// MessageInput = Omit<Message, "id" | "stats">
export const MessageInputSchema = MessageSchema.omit({ stats: true }); // No id in Message

// Interaction
export const InteractionSchema = z.object({
  id: z.string(),
  type: SimulationTypeEnum,
  simulationId: z.string(),
  active: z.boolean(),
  participants: z.array(z.string()),
  messages: z.array(MessageSchema).optional(),
  stats: z
    .object({
      messages: z.number(),
      tokens: TokenStatsSchema,
    })
    .optional(),
  summary: z.string().optional(),
});
export const InteractionStatsSchema = z.object({
  messages: z.number(),
  tokens: TokenStatsSchema,
});

// InteractionInput = Pick<Interaction, "participants" | "simulationId">
export const InteractionInputSchema = z.object({
  participants: z.array(z.string()),
  simulationId: z.string(),
});

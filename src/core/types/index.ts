import { z } from "zod";

/* AGENT - PRIMITIVES */
export const TokenStatsSchema = z.object({
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  totalTokens: z.number().int().nonnegative(),
});
export type TokenStats = z.infer<typeof TokenStatsSchema>;

export const LLMSettingsSchema = z.object({
  provider: z.string(),
  model: z.string(),
  temperature: z.number(),
  messageToken: z.number().int(),
});
export type LLMSettings = z.infer<typeof LLMSettingsSchema>;

/* AGENT - PERSONALITY */
export const BigFiveTraitsSchema = z.object({
  openness: z.number().int().min(1).max(10),
  conscientiousness: z.number().int().min(1).max(10),
  extraversion: z.number().int().min(1).max(10),
  agreeableness: z.number().int().min(1).max(10),
  neuroticism: z.number().int().min(1).max(10),
});

export const BigFivePersonalityModelSchema = z.object({
  source: z.string(),
  traits: BigFiveTraitsSchema,
});
export type BigFivePersonalityModel = z.infer<
  typeof BigFivePersonalityModelSchema
>;

/* AGENT - META */
export const OrganizationSchema = z.object({
  role: z.string().optional(),
  roleDescription: z.string().optional(),
  hierarchyWeight: z.number().optional(),
  subGroups: z.array(z.string()).optional(),
});
export type Organization = z.infer<typeof OrganizationSchema>;

export const DemographicsSchema = z.object({
  age: z.number().int(),
  sex: z.enum(["male", "female"]),
  educationLevel: z.number().optional(),
});
export type Demographics = z.infer<typeof DemographicsSchema>;

/* AGENT - EVALUATIONS */
export const BigFiveEvaluationResultsSchema = z.object({
  min: z.number(),
  max: z.number(),
  avg: z.number(),
});
export const BigFiveEvaluationSchema = z.object({
  samples: z.number().int().nonnegative(),
  results: BigFiveEvaluationResultsSchema,
});

export const QuestionnaireEvaluationSchema = z.object({
  version: z.number().int(),
  results: z.object({
    avg: z.number(),
  }),
});

export const EvaluationsSchema = z.object({
  bigFive: BigFiveEvaluationSchema,
  questionnaire: QuestionnaireEvaluationSchema.optional(),
});

export const EvaluationInputSchema = z.object({
  type: z.enum(["bigfive", "questionnaire"]),
  samples: z.number().int().optional(),
});

export type Evaluations = z.infer<typeof EvaluationsSchema>;
export type EvaluationInput = z.infer<typeof EvaluationInputSchema>;

/* AGENT - MAIN */
export const AgentSchema = z.object({
  id: z.string(),
  version: z.number().int(),
  name: z.string(),
  simulationId: z.string(),
  type: z.enum(["custom", "random", "data"]),
  state: z.enum(["idle", "active"]),
  inInteractionId: z.string().nullable(),
  demographics: DemographicsSchema.optional(),
  organization: OrganizationSchema.optional(),
  personality: BigFivePersonalityModelSchema,
  objectives: z.array(z.string()),
  dynamicProps: z.array(z.object(z.any())).optional(),
  llmSettings: LLMSettingsSchema,
  evaluations: EvaluationsSchema.optional(),
  stats: TokenStatsSchema.optional(),
});
export type Agent = z.infer<typeof AgentSchema>;

export const CustomAgentInputSchema = AgentSchema.omit({
  state: true,
  stats: true,
  inInteractionId: true,
  evaluations: true,
});
export type CustomAgentInput = z.infer<typeof CustomAgentInputSchema>;

export const RandomAgentInputSchema = z.object({
  count: z.number().int().positive(),
  version: z.number().int(),
  simulationId: z.string(),
});
export type RandomAgentInput = z.infer<typeof RandomAgentInputSchema>;

export const AgentInputSchema = RandomAgentInputSchema;
export type AgentInput = z.infer<typeof AgentInputSchema>;

/* AGENT - CHAT */
export const AgentChatInputSchema = z.object({
  prompt: z.string(),
});
export type AgentChatInput = z.infer<typeof AgentChatInputSchema>;

/* SIMULATION */
export const SimulationTypeSchema = z.enum([
  "discussion",
  "conversation",
  "survey",
]);

export const SimulationStateSchema = z.enum([
  "primed",
  "running",
  "ended",
  "stopped",
]);

export const SimulationInputDescriptionSchema = z.object({
  type: z.enum(["topic", "issue", "challange"]), // kept original spelling
  description: z.string(),
});

export const SimulationOutputDescriptionSchema = z.object({
  description: z.string(),
});

export const SimulationStatsSchema = z.object({
  agents: z.number().int().optional(),
  interactions: z.number().int().optional(),
  tokens: TokenStatsSchema.optional(),
});

export const SimulationSchema = z.object({
  id: z.string(),
  state: SimulationStateSchema,
  type: SimulationTypeSchema,
  name: z.string(),
  description: z.string().optional(),
  environmentId: z.string().optional(),
  input: SimulationInputDescriptionSchema,
  output: SimulationOutputDescriptionSchema.optional(),
  stats: SimulationStatsSchema,
});
export type Simulation = z.infer<typeof SimulationSchema>;

/* SimulationInput - create version (matches original Omit) */
export const SimulationInputSchema = SimulationSchema.omit({
  id: true,
  state: true,
  stats: true,
});
export type SimulationInput = z.infer<typeof SimulationInputSchema>;

/* ENVIRONMENT */
export const EnvironmentSchema = z.object({
  id: z.string(),
  simulationId: z.string(),
  description: z.string(),
  objectives: z.array(z.string()).optional(),
  constraints: z.array(z.string()).optional(),
  values: z.array(z.string()).optional(),
});
export type Environment = z.infer<typeof EnvironmentSchema>;

export const EnvironmentInputSchema = EnvironmentSchema.omit({
  id: true,
});
export type EnvironmentInput = z.infer<typeof EnvironmentInputSchema>;

/* INTERACTIONS */
export const MessageSchema = z.object({
  simulationId: z.string(),
  interactionId: z.string(),
  interactionType: SimulationTypeSchema,
  senderId: z.string(),
  content: z.string(),
  tokens: TokenStatsSchema.optional(),
});
export type Message = z.infer<typeof MessageSchema>;

/* Note: original MessageInput omitted "id" | "stats" which do not appear in Message;
   for parity provide MessageInputSchema equal to MessageSchema */
export const MessageInputSchema = MessageSchema;
export type MessageInput = z.infer<typeof MessageInputSchema>;

export const InteractionStatsSchema = z.object({
  messages: z.number().int(),
  tokens: TokenStatsSchema,
});

export const InteractionSchema = z.object({
  id: z.string(),
  type: SimulationTypeSchema,
  simulationId: z.string(),
  turns: z.number().int().optional(),
  active: z.boolean(),
  participants: z.array(z.string()),
  messages: z.array(MessageSchema).optional(),
  stats: InteractionStatsSchema.optional(),
  summary: z.string().optional(),
});
export type Interaction = z.infer<typeof InteractionSchema>;

export const InteractionInputSchema = InteractionSchema.pick({
  participants: true,
  simulationId: true,
  turns: true,
});
export type InteractionInput = z.infer<typeof InteractionInputSchema>;

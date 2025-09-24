import { z } from "zod";

/**
 * Basic building blocks
 */
export const tokenStatsSchema = z.object({
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  totalTokens: z.number().int().nonnegative(),
});

export const simulationTypeSchema = z.enum([
  "discussion",
  "conversation",
  "survey",
]);

export const simulationStateSchema = z.enum([
  "primed",
  "running",
  "ended",
  "stopped",
]);

export const agentTypeSchema = z.enum(["custom", "random"]);

export const agentStateSchema = z.enum(["idle", "active"]);

/**
 * Personality / Evaluations
 */
export const bigFiveTraitsSchema = z.object({
  openness: z.number().min(1).max(10),
  conscientiousness: z.number().min(1).max(10),
  extraversion: z.number().min(1).max(10),
  agreeableness: z.number().min(1).max(10),
  neuroticism: z.number().min(1).max(10),
});

export const bigFivePersonalitySchema = z.object({
  source: z.string(),
  traits: bigFiveTraitsSchema,
});

export const bigFiveEvaluationResultsSchema = z.object({
  min: z.number().min(0).max(100),
  max: z.number().min(0).max(100),
  avg: z.number().min(0).max(100),
});

export const bigFiveEvaluationSchema = z.object({
  samples: z.number().int().nonnegative(),
  results: bigFiveEvaluationResultsSchema,
});

export const questionnaireEvaluationSchema = z.object({
  version: z.number().int().nonnegative(),
  results: z.object({
    avg: z.number().min(0).max(100),
  }),
});

export const evaluationsSchema = z.object({
  bigFive: bigFiveEvaluationSchema,
  questionnaire: questionnaireEvaluationSchema.optional(),
});

/**
 * Other types
 */
export const demographicsSchema = z.object({
  age: z.number().int().nonnegative(),
  sex: z.enum(["male", "female"]),
  educationLevel: z.number().int().optional(),
});

export const organizationSchema = z.object({
  role: z.string().optional(),
  roleDescription: z.string().optional(),
  hierarchyWeight: z.number().optional(),
  subGroups: z.array(z.string()).optional(),
});

export const llmSettingsSchema = z.object({
  provider: z.string(),
  model: z.string(),
  temperature: z.number(),
  messageToken: z.number().int().nonnegative(),
});

/**
 * Environment / Simulation
 */
export const environmentSchema = z.object({
  id: z.string(),
  description: z.string(),
  objectives: z.array(z.string()).optional(),
  constraints: z.array(z.string()).optional(),
  values: z.array(z.string()).optional(),
});

export const environmentInputSchema = environmentSchema.omit({ id: true });

export const simulationStatsSchema = z.object({
  agents: z.number().int().nonnegative().optional(),
  activities: z.number().int().nonnegative().optional(),
  tokens: tokenStatsSchema.optional(),
});

export const simulationSchema = z.object({
  id: z.string(),
  state: simulationStateSchema,
  type: simulationTypeSchema,
  name: z.string(),
  description: z.string().optional(),
  environment: environmentSchema.optional(),
  topic: z.string(),
  stats: simulationStatsSchema,
});

export const simulationInputSchema = simulationSchema.omit({
  id: true,
  state: true,
  topic: true,
  environment: true,
  stats: true,
});

/**
 * Messages / Interactions
 */
export const messageSchema = z.object({
  id: z.string(),
  simulationId: z.string(),
  interactionId: z.string(),
  interactionType: simulationTypeSchema,
  senderId: z.string(),
  content: z.string(),
  stats: tokenStatsSchema.optional(),
});

export const messageInputSchema = messageSchema.omit({ id: true, stats: true });

export const interactionStatsSchema = z.object({
  messages: z.number().int().nonnegative(),
  tokens: tokenStatsSchema,
});

export const interactionSchema = z.object({
  id: z.string(),
  type: simulationTypeSchema,
  simulationId: z.string(),
  active: z.boolean(),
  participants: z.array(z.string()),
  messages: z.array(messageSchema).optional(),
  stats: interactionStatsSchema.optional(),
  summary: z.string().optional(),
});

export const interactionInputSchema = interactionSchema.omit({
  id: true,
  active: true,
  type: true,
  messages: true,
  stats: true,
});

/**
 * Agent and related
 */
export const agentSchema = z.object({
  id: z.string(),
  version: z.number().int().nonnegative(),
  name: z.string(),
  simulationId: z.string(),
  type: agentTypeSchema,
  state: agentStateSchema,
  ininteractionId: z.string().nullable(),
  demographics: demographicsSchema.optional(),
  organization: organizationSchema.optional(),
  personality: bigFivePersonalitySchema,
  objectives: z.array(z.string()),
  dynamicProps: z.array(z.record(z.string(), z.any())).optional(),
  llmSettings: llmSettingsSchema,
  evaluations: evaluationsSchema.optional(),
  stats: tokenStatsSchema.optional(),
});

export const customAgentInputSchema = agentSchema.omit({
  id: true,
  stats: true,
});

export const agentInputSchema = z.object({
  count: z.number(),
  version: z.number().min(1).max(2),
  simulationId: z.string(),
});

export const randomAgentInputSchema = agentInputSchema;

/**
 * Small utility input types
 */

export const evaluationInputSchema = z.object({
  agentId: z.string(),
  type: z.enum(["bigfive", "questionnaire"]),
  samples: z.number().int().min(1).max(10),
});

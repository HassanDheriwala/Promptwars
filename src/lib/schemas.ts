import { z } from "zod";

// Input sanitization and length limits to prevent abuse and prompt injection
const sanitizedString = (maxLen: number) =>
  z
    .string()
    .trim()
    .max(maxLen, { message: `Must not exceed ${maxLen} characters.` })
    .transform((val) => val.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, ""));

export const studentProfileSchema = z.object({
  interests: z
    .array(sanitizedString(60))
    .min(1, "Please provide at least one interest area.")
    .max(10, "Maximum 10 interests allowed."),
  skills: z
    .array(sanitizedString(60))
    .min(1, "Please provide at least one technical skill.")
    .max(15, "Maximum 15 skills allowed."),
  domain: sanitizedString(100).default("General Technology"),
  projectType: sanitizedString(100).default("Full-Stack Web App"),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Intermediate"),
  timeframeWeeks: z.coerce.number().min(1).max(52).default(12),
  teamSize: z.coerce.number().min(1).max(10).default(1),
  preferredTech: sanitizedString(200).optional().default(""),
  constraints: sanitizedString(300).optional().default(""),
});

export const projectFeatureSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(500),
  priority: z.enum(["High", "Medium", "Low"]).default("Medium"),
});

export const techStackSchema = z.object({
  frontend: z.array(z.string()).default([]),
  backend: z.array(z.string()).default([]),
  database: z.array(z.string()).default([]),
  cloudDevOps: z.array(z.string()).default([]),
  aiMl: z.array(z.string()).default([]),
});

export const aiMlComponentSchema = z.object({
  included: z.boolean().default(false),
  description: z.string().default("No specific AI component required."),
  modelOrApi: z.string().default("N/A"),
  dataRequirements: z.string().default("Standard tabular or synthetic test data."),
  datasetRecommendation: z.string().default("Open-source datasets or simulated API fixtures."),
});

export const developmentScopeSchema = z.object({
  totalWeeks: z.number().min(1).max(52).default(12),
  hoursPerWeek: z.number().min(1).max(60).default(15),
  teamSizeRecommendation: z.string().default("1-2 students"),
});

export const mvpVersionSchema = z.object({
  summary: z.string().min(1),
  keyFeatures: z.array(z.string()).min(1),
  buildTimelineWeeks: z.number().min(1).max(20).default(3),
  deliverable: z.string().min(1),
});

export const roadmapPhaseSchema = z.object({
  phaseNumber: z.number().int().min(1).max(10),
  title: z.string().min(1).max(100),
  durationWeeks: z.number().min(1).max(20),
  milestones: z.array(z.string()).min(1),
  deliverables: z.array(z.string()).min(1),
});

export const riskChallengeSchema = z.object({
  risk: z.string().min(1),
  severity: z.enum(["High", "Medium", "Low"]).default("Medium"),
  mitigation: z.string().min(1),
});

export const projectBlueprintSchema = z.object({
  id: z.string().default(() => `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`),
  title: z.string().min(1).max(150),
  concept: z.string().min(1).max(300),
  problem: z.string().min(1).max(1000),
  suitability: z.string().min(1).max(800),
  targetUsers: z.array(z.string()).min(1),
  coreFeatures: z.array(projectFeatureSchema).min(2),
  techStack: techStackSchema,
  aiMlComponent: aiMlComponentSchema,
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Intermediate"),
  estimatedScope: developmentScopeSchema,
  mvpVersion: mvpVersionSchema,
  roadmap: z.array(roadmapPhaseSchema).min(2),
  possibleImprovements: z.array(z.string()).default([]),
  futureScope: z.array(z.string()).default([]),
  risksAndChallenges: z.array(riskChallengeSchema).min(1),
  architectureOverview: z.string().default("Client-Server architecture with modular services."),
});

export const geminiProjectsOutputSchema = z.object({
  projects: z.array(projectBlueprintSchema).min(1).max(5),
});

export const refineIdeaRequestSchema = z.object({
  blueprint: projectBlueprintSchema,
  refinementPrompt: z.string().trim().min(2).max(400),
  quickPreset: z.string().trim().max(100).optional(),
});

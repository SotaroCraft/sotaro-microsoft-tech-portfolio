import { z } from "zod";

export const episodeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1),
  bodyText: z.string(),
  situation: z.string().optional(),
  task: z.string().optional(),
  action: z.string().optional(),
  result: z.string().optional(),
  tags: z.array(z.string()).default([]),
  locale: z.enum(["ja", "en"]).default("ja"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Episode = z.infer<typeof episodeSchema>;

export const careerSummarySchema = z.object({
  id: z.string(),
  userId: z.string(),
  summaryJa: z.string(),
  summaryEn: z.string(),
  metrics: z.array(
    z.object({
      category: z.enum(["revenue", "cost", "team", "tech", "other"]),
      label: z.string(),
      value: z.string(),
    }),
  ),
  updatedAt: z.string(),
});

export type CareerSummary = z.infer<typeof careerSummarySchema>;

export const companySchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  priority: z.number().int().min(1).max(3),
  isPrimaryTarget: z.boolean().default(false),
  website: z.string().optional(),
  notes: z.string().optional(),
});

export type Company = z.infer<typeof companySchema>;

export const applicationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  companyId: z.string(),
  roleTitle: z.string(),
  stage: z.string(),
  stageUpdatedAt: z.string(),
  nextAction: z.string().optional(),
  nextActionDate: z.string().optional(),
  contactName: z.string().optional(),
  notes: z.string().optional(),
});

export type Application = z.infer<typeof applicationSchema>;

export const projectStatusSchema = z.enum(["active", "closed"]);

export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const projectSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1).max(200),
  summary: z.string().max(2000).optional(),
  status: projectStatusSchema.default("active"),
  lastOpenedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Project = z.infer<typeof projectSchema>;

export const createProjectInputSchema = z.object({
  title: z.string().min(1).max(200),
  summary: z.string().max(2000).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export const updateProjectInputSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    summary: z.string().max(2000).optional(),
    status: projectStatusSchema.optional(),
    lastOpenedAt: z.string().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.summary !== undefined ||
      data.status !== undefined ||
      data.lastOpenedAt !== undefined,
    { message: "At least one field is required" },
  );

export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  app: z.string(),
  env: z.string(),
  timestamp: z.string(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const userSettingsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  milestoneTargetIso: z.string(),
  updatedAt: z.string(),
});

export type UserSettings = z.infer<typeof userSettingsSchema>;

export const milestoneUpdateSchema = z.object({
  milestoneTargetIso: z.string().datetime({ offset: true }),
});

export type MilestoneUpdate = z.infer<typeof milestoneUpdateSchema>;

export const createEpisodeInputSchema = episodeSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateEpisodeInput = z.infer<typeof createEpisodeInputSchema>;

export const updateEpisodeInputSchema = createEpisodeInputSchema.partial();

export type UpdateEpisodeInput = z.infer<typeof updateEpisodeInputSchema>;

export const createCompanyInputSchema = companySchema.omit({
  id: true,
  userId: true,
});

export type CreateCompanyInput = z.infer<typeof createCompanyInputSchema>;

export const createApplicationInputSchema = applicationSchema.omit({
  id: true,
  userId: true,
  stageUpdatedAt: true,
});

export type CreateApplicationInput = z.infer<typeof createApplicationInputSchema>;

export const updateApplicationInputSchema = z
  .object({
    stage: z.string().optional(),
    roleTitle: z.string().min(1).optional(),
    nextAction: z.string().optional(),
    nextActionDate: z.string().optional(),
    contactName: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) =>
      data.stage !== undefined ||
      data.roleTitle !== undefined ||
      data.nextAction !== undefined ||
      data.nextActionDate !== undefined ||
      data.contactName !== undefined ||
      data.notes !== undefined,
    { message: "At least one field is required" },
  );

export type UpdateApplicationInput = z.infer<typeof updateApplicationInputSchema>;

export const updateCompanyInputSchema = createCompanyInputSchema.partial().refine(
  (data) =>
    data.name !== undefined ||
    data.priority !== undefined ||
    data.isPrimaryTarget !== undefined ||
    data.website !== undefined ||
    data.notes !== undefined,
  { message: "At least one field is required" },
);

export type UpdateCompanyInput = z.infer<typeof updateCompanyInputSchema>;

export const updateCareerSummaryInputSchema = careerSummarySchema.omit({
  id: true,
  userId: true,
  updatedAt: true,
});

export type UpdateCareerSummaryInput = z.infer<
  typeof updateCareerSummaryInputSchema
>;

export const matchRequestSchema = z.object({
  referenceText: z.string().min(1).max(10000),
  topK: z.number().int().min(1).max(10).default(3),
});

export type MatchRequest = z.infer<typeof matchRequestSchema>;

export const matchResultSchema = z.object({
  episodeId: z.string(),
  title: z.string(),
  score: z.number(),
  excerpt: z.string(),
});

export type MatchResult = z.infer<typeof matchResultSchema>;

export const matchResponseSchema = z.object({
  results: z.array(matchResultSchema),
  draftSummary: z.string().optional(),
  provider: z.string(),
});

export type MatchResponse = z.infer<typeof matchResponseSchema>;

export const architectureResourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  location: z.string(),
  provisioningState: z.string().optional(),
  iconId: z.string(),
});

export type ArchitectureResource = z.infer<typeof architectureResourceSchema>;

export const architectureLogicalNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.enum(["entra", "github-actions", "user"]),
  iconId: z.string(),
  provisioningState: z.string().optional(),
});

export type ArchitectureLogicalNode = z.infer<
  typeof architectureLogicalNodeSchema
>;

export const architectureResponseSchema = z.object({
  resourceGroup: z.string(),
  region: z.string(),
  fetchedAt: z.string(),
  resources: z.array(architectureResourceSchema),
  logicalNodes: z.array(architectureLogicalNodeSchema).optional(),
  note: z.string().optional(),
});

export type ArchitectureResponse = z.infer<typeof architectureResponseSchema>;

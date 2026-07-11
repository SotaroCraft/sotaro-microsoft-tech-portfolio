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

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  app: z.string(),
  env: z.string(),
  timestamp: z.string(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

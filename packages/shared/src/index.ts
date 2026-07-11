/** Pipeline stages for opportunity tracking (neutral public labels) */
export const PIPELINE_STAGES = [
  { id: "watchlist", labelJa: "ウォッチリスト", labelEn: "Watchlist", order: 0 },
  { id: "applied", labelJa: "着手", labelEn: "In progress", order: 1 },
  { id: "initial_review", labelJa: "初回レビュー", labelEn: "Initial review", order: 2 },
  { id: "phone_screen", labelJa: "ディスカッション", labelEn: "Discussion", order: 3 },
  { id: "technical", labelJa: "技術レビュー", labelEn: "Technical review", order: 4 },
  { id: "deep_dive", labelJa: "詳細評価", labelEn: "Deep dive", order: 5 },
  { id: "final_review", labelJa: "最終レビュー", labelEn: "Final review", order: 6 },
  { id: "offer", labelJa: "合意", labelEn: "Agreement", order: 7 },
  { id: "closed", labelJa: "アーカイブ", labelEn: "Archived", order: 8 },
] as const;

export type PipelineStageId = (typeof PIPELINE_STAGES)[number]["id"];

/** Default milestone target date (public UI: generic "Milestone" label only) */
export const MILESTONE_TARGET_ISO = "2027-04-01T00:00:00+09:00";

/** @deprecated Use MILESTONE_TARGET_ISO */
export const COUNTDOWN_TARGET_ISO = MILESTONE_TARGET_ISO;

export const AI_BUDGET = {
  monthlyLimitJpy: 2900,
  monthlyLimitUsd: 19.99,
} as const;

export * from "./schemas";
export * from "./demo-data";
export * from "./architecture/icon-registry";
export * from "./architecture/layout";

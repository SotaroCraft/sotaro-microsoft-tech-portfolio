import type { Episode } from "./schemas";

/** Public-safe demo data only — never use real personal data (CHARTER) */
export const demoEpisodes: Episode[] = [
  {
    id: "demo-ep-1",
    userId: "demo-user",
    title: "Cross-team API migration",
    bodyText:
      "Led migration of legacy REST APIs to Azure Functions with zero downtime.",
    situation: "Legacy monolith blocked release cadence.",
    task: "Migrate 12 endpoints within one quarter.",
    action: "Introduced strangler pattern and phased rollout.",
    result: "Deployment frequency increased 3x; incident rate down 40%.",
    tags: ["leadership", "azure", "migration"],
    locale: "en",
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-01-15T00:00:00.000Z",
  },
];

export const demoCareerMetrics = [
  { category: "team" as const, label: "Team size led", value: "8 engineers" },
  { category: "tech" as const, label: "Azure projects", value: "3 delivered" },
];

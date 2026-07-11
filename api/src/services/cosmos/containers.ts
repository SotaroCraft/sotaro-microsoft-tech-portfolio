export const COSMOS_CONTAINERS = {
  episodes: "episodes",
  companies: "companies",
  applications: "applications",
  career: "career",
  settings: "settings",
  projects: "projects",
} as const;

export type CosmosContainerName =
  (typeof COSMOS_CONTAINERS)[keyof typeof COSMOS_CONTAINERS];

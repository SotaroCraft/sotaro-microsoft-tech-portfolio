export const COSMOS_CONTAINERS = {
  episodes: "episodes",
  companies: "companies",
  applications: "applications",
  career: "career",
  settings: "settings",
} as const;

export type CosmosContainerName =
  (typeof COSMOS_CONTAINERS)[keyof typeof COSMOS_CONTAINERS];

/** ARM resourceType → deploy-bundle SVG filename (longest-prefix match) */
export type IconRegistryEntry = {
  resourceType: string;
  /** Relative path under resources/Icons/ */
  sourcePath: string;
  iconId: string;
  label?: string;
};

/** Sorted longest-first for prefix matching */
export const ICON_REGISTRY: IconRegistryEntry[] = [
  {
    resourceType: "Microsoft.Web/staticSites",
    sourcePath: "web/01007-icon-service-Static-Apps.svg",
    iconId: "01007-icon-service-Static-Apps.svg",
    label: "Static Web Apps",
  },
  {
    resourceType: "Microsoft.Web/sites",
    sourcePath: "compute/10029-icon-service-Function-Apps.svg",
    iconId: "10029-icon-service-Function-Apps.svg",
    label: "Azure Functions",
  },
  {
    resourceType: "Microsoft.DocumentDB/databaseAccounts",
    sourcePath: "databases/10121-icon-service-Azure-Cosmos-DB.svg",
    iconId: "10121-icon-service-Azure-Cosmos-DB.svg",
    label: "Cosmos DB",
  },
  {
    resourceType: "Microsoft.CognitiveServices/accounts",
    sourcePath: "web/10162-icon-service-Cognitive-Services.svg",
    iconId: "10162-icon-service-Cognitive-Services.svg",
    label: "Azure OpenAI",
  },
  {
    resourceType: "Microsoft.Insights/components",
    sourcePath: "monitor/00012-icon-service-Application-Insights.svg",
    iconId: "00012-icon-service-Application-Insights.svg",
    label: "Application Insights",
  },
  {
    resourceType: "Microsoft.OperationalInsights/workspaces",
    sourcePath: "monitor/00009-icon-service-Log-Analytics-Workspaces.svg",
    iconId: "00009-icon-service-Log-Analytics-Workspaces.svg",
    label: "Log Analytics",
  },
  {
    resourceType: "Microsoft.Consumption/budgets",
    sourcePath: "general/10793-icon-service-Cost-Budgets.svg",
    iconId: "10793-icon-service-Cost-Budgets.svg",
    label: "Cost Budget",
  },
  {
    resourceType: "Microsoft.Resources/resourceGroups",
    sourcePath: "general/10007-icon-service-Resource-Groups.svg",
    iconId: "10007-icon-service-Resource-Groups.svg",
    label: "Resource Group",
  },
];

export const LOGICAL_ICON_REGISTRY = {
  entra: {
    sourcePath: "other/10232-icon-service-App-Registrations.svg",
    iconId: "10232-icon-service-App-Registrations.svg",
    label: "Entra ID",
  },
  githubActions: {
    sourcePath: "devops/10261-icon-service-Azure-DevOps.svg",
    iconId: "10261-icon-service-Azure-DevOps.svg",
    label: "GitHub Actions",
  },
  user: {
    sourcePath: "other/10018-icon-service-Azure-A.svg",
    iconId: "10018-icon-service-Azure-A.svg",
    label: "User",
  },
} as const;

export const FALLBACK_ICON = {
  sourcePath: "other/10018-icon-service-Azure-A.svg",
  iconId: "10018-icon-service-Azure-A.svg",
  label: "Azure",
} as const;

/** All unique deploy-bundle filenames referenced by the registry */
export function getDeployIconIds(): string[] {
  const ids = new Set<string>();
  for (const entry of ICON_REGISTRY) {
    ids.add(entry.iconId);
  }
  ids.add(LOGICAL_ICON_REGISTRY.entra.iconId);
  ids.add(LOGICAL_ICON_REGISTRY.githubActions.iconId);
  ids.add(LOGICAL_ICON_REGISTRY.user.iconId);
  ids.add(FALLBACK_ICON.iconId);
  return [...ids].sort();
}

/** Resolve icon filename from ARM resource type (longest prefix, then exact) */
export function resolveIconId(resourceType: string): string {
  const normalized = resourceType.toLowerCase();

  const exact = ICON_REGISTRY.find(
    (e) => e.resourceType.toLowerCase() === normalized,
  );
  if (exact) return exact.iconId;

  const sorted = [...ICON_REGISTRY].sort(
    (a, b) => b.resourceType.length - a.resourceType.length,
  );
  for (const entry of sorted) {
    const prefix = entry.resourceType.toLowerCase();
    if (normalized.startsWith(prefix)) {
      return entry.iconId;
    }
  }

  return FALLBACK_ICON.iconId;
}

export function iconPublicPath(iconId: string): string {
  return `/architecture-icons/${iconId}`;
}

export function resolveLabel(resourceType: string): string {
  const normalized = resourceType.toLowerCase();
  const match =
    ICON_REGISTRY.find((e) => e.resourceType.toLowerCase() === normalized) ??
    [...ICON_REGISTRY]
      .sort((a, b) => b.resourceType.length - a.resourceType.length)
      .find((e) => normalized.startsWith(e.resourceType.toLowerCase()));
  return match?.label ?? resourceType.split("/").pop() ?? "Resource";
}

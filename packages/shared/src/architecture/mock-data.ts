import { architectureResponseSchema } from "../schemas.js";
import { LOGICAL_ICON_REGISTRY, resolveIconId } from "./icon-registry.js";

const MOCK_RESOURCE_GROUP = "rg-microbootcan-prod";
const MOCK_REGION = "japaneast";

function mockResource(
  id: string,
  name: string,
  type: string,
  provisioningState = "Succeeded",
) {
  return {
    id,
    name,
    type,
    location: MOCK_REGION,
    provisioningState,
    iconId: resolveIconId(type),
  };
}

export function buildMockArchitectureResponse() {
  return architectureResponseSchema.parse({
    resourceGroup: MOCK_RESOURCE_GROUP,
    region: MOCK_REGION,
    fetchedAt: new Date().toISOString(),
    resources: [
      mockResource("swa", "stapp-microbootcan-z6mnnh4iqiisc", "Microsoft.Web/staticSites"),
      mockResource("functions", "func-microbootcan", "Microsoft.Web/sites"),
      mockResource(
        "cosmos",
        "microbootcancosmosz6mnnh4iqiisc",
        "Microsoft.DocumentDB/databaseAccounts",
      ),
      mockResource(
        "openai",
        "microbootcan-openai-z6mnn",
        "Microsoft.CognitiveServices/accounts",
      ),
      mockResource(
        "insights",
        "microbootcan-ai-z6mnnh4iqiisc",
        "Microsoft.Insights/components",
      ),
      mockResource(
        "law",
        "microbootcan-law-z6mnnh4iqiisc",
        "Microsoft.OperationalInsights/workspaces",
      ),
      mockResource(
        "budget",
        "MicroBootCan-Monthly",
        "Microsoft.Consumption/budgets",
      ),
      mockResource(
        "rg",
        "rg-microbootcan-prod",
        "Microsoft.Resources/resourceGroups",
      ),
    ],
    logicalNodes: [
      {
        id: "user",
        name: "Browser",
        kind: "user",
        iconId: LOGICAL_ICON_REGISTRY.user.iconId,
        provisioningState: "Succeeded",
      },
      {
        id: "entra",
        name: "Entra ID",
        kind: "entra",
        iconId: LOGICAL_ICON_REGISTRY.entra.iconId,
        provisioningState: "Succeeded",
      },
      {
        id: "github",
        name: "GitHub Actions",
        kind: "github-actions",
        iconId: LOGICAL_ICON_REGISTRY.githubActions.iconId,
        provisioningState: "Succeeded",
      },
    ],
  });
}

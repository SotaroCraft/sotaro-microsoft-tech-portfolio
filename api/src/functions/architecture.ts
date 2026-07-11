import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import {
  architectureResponseSchema,
  LOGICAL_ICON_REGISTRY,
  resolveIconId,
} from "@microbootcan/shared";

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

function buildMockArchitectureResponse() {
  return architectureResponseSchema.parse({
    resourceGroup: MOCK_RESOURCE_GROUP,
    region: MOCK_REGION,
    fetchedAt: new Date().toISOString(),
    resources: [
      mockResource("swa", "swa-microbootcan", "Microsoft.Web/staticSites"),
      mockResource("functions", "func-microbootcan", "Microsoft.Web/sites"),
      mockResource(
        "cosmos",
        "cosmos-microbootcan",
        "Microsoft.DocumentDB/databaseAccounts",
      ),
      mockResource(
        "openai",
        "oai-microbootcan",
        "Microsoft.CognitiveServices/accounts",
      ),
      mockResource(
        "insights",
        "appi-microbootcan",
        "Microsoft.Insights/components",
      ),
      mockResource(
        "law",
        "law-microbootcan",
        "Microsoft.OperationalInsights/workspaces",
      ),
      mockResource(
        "budget",
        "budget-microbootcan",
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

app.http("architecture", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "architecture",
  handler: async (
    _request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    const body = buildMockArchitectureResponse();

    return {
      status: 200,
      jsonBody: body,
    };
  },
});

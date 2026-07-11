import type { ArchitectureLogicalNode, ArchitectureResource } from "../schemas";

export type DiagramNode = {
  id: string;
  label: string;
  iconId: string;
  x: number;
  y: number;
  provisioningState?: string;
  kind: "resource" | "logical";
};

export type DiagramEdge = {
  from: string;
  to: string;
};

const CANVAS = { width: 720, height: 420 };

/** Fixed layout zones for MicroStarPlatform stack (local + prod) */
export function buildDiagramLayout(
  resources: ArchitectureResource[],
  logicalNodes: ArchitectureLogicalNode[] = [],
): { nodes: DiagramNode[]; edges: DiagramEdge[]; canvas: typeof CANVAS } {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];

  const user = logicalNodes.find((n) => n.kind === "user");
  const entra = logicalNodes.find((n) => n.kind === "entra");
  const gh = logicalNodes.find((n) => n.kind === "github-actions");

  if (user) {
    nodes.push({
      id: user.id,
      label: user.name,
      iconId: user.iconId,
      x: 40,
      y: 40,
      kind: "logical",
    });
  }

  const swa = pickResource(resources, "Microsoft.Web/staticSites");
  const functions = pickResource(resources, "Microsoft.Web/sites");
  const cosmos = pickResource(resources, "Microsoft.DocumentDB/databaseAccounts");
  const openai = pickResource(resources, "Microsoft.CognitiveServices/accounts");
  const insights = pickResource(resources, "Microsoft.Insights/components");
  const law = pickResource(resources, "Microsoft.OperationalInsights/workspaces");

  const row1 = [
    { r: swa, x: 200, y: 40, fallback: "Static Web Apps" },
    { r: functions, x: 400, y: 40, fallback: "Azure Functions" },
  ];

  for (const slot of row1) {
    if (slot.r) {
      nodes.push(resourceNode(slot.r, slot.x, slot.y));
    } else {
      nodes.push({
        id: `placeholder-${slot.fallback}`,
        label: slot.fallback,
        iconId: "01007-icon-service-Static-Apps.svg",
        x: slot.x,
        y: slot.y,
        provisioningState: "NotDeployed",
        kind: "resource",
      });
    }
  }

  const row2 = [
    { r: cosmos, x: 120, y: 220, fallback: "Cosmos DB" },
    { r: openai, x: 320, y: 220, fallback: "Azure OpenAI" },
    { r: insights, x: 520, y: 220, fallback: "App Insights" },
  ];

  for (const slot of row2) {
    if (slot.r) {
      nodes.push(resourceNode(slot.r, slot.x, slot.y));
    }
  }

  if (law && !insights) {
    nodes.push(resourceNode(law, 520, 220));
  }

  if (entra) {
    nodes.push({
      id: entra.id,
      label: entra.name,
      iconId: entra.iconId,
      x: 40,
      y: 160,
      provisioningState: entra.provisioningState,
      kind: "logical",
    });
  }

  if (gh) {
    nodes.push({
      id: gh.id,
      label: gh.name,
      iconId: gh.iconId,
      x: 40,
      y: 300,
      provisioningState: gh.provisioningState,
      kind: "logical",
    });
  }

  const swaId = swa?.id ?? "placeholder-Static Web Apps";
  const fnId = functions?.id ?? "placeholder-Azure Functions";
  const userId = user?.id;

  if (userId) edges.push({ from: userId, to: swaId });
  edges.push({ from: swaId, to: fnId });
  if (cosmos) edges.push({ from: fnId, to: cosmos.id });
  if (openai) edges.push({ from: fnId, to: openai.id });
  if (insights) edges.push({ from: fnId, to: insights.id });
  if (entra) edges.push({ from: entra.id, to: swaId });
  if (gh) edges.push({ from: gh.id, to: swaId });

  return { nodes, edges, canvas: CANVAS };
}

function pickResource(
  resources: ArchitectureResource[],
  typePrefix: string,
): ArchitectureResource | undefined {
  return resources.find((r) =>
    r.type.toLowerCase().startsWith(typePrefix.toLowerCase()),
  );
}

function resourceNode(
  resource: ArchitectureResource,
  x: number,
  y: number,
): DiagramNode {
  return {
    id: resource.id,
    label: resource.name,
    iconId: resource.iconId,
    x,
    y,
    provisioningState: resource.provisioningState,
    kind: "resource",
  };
}

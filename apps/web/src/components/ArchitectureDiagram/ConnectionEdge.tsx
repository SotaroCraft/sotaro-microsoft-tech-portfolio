import type { DiagramEdge, DiagramNode } from "@microbootcan/shared";

const NODE_ANCHOR_Y = 56;

type ConnectionEdgeProps = {
  edge: DiagramEdge;
  nodesById: Map<string, DiagramNode>;
};

export function ConnectionEdge({ edge, nodesById }: ConnectionEdgeProps) {
  const from = nodesById.get(edge.from);
  const to = nodesById.get(edge.to);
  if (!from || !to) return null;

  const x1 = from.x;
  const y1 = from.y + NODE_ANCHOR_Y;
  const x2 = to.x;
  const y2 = to.y;

  const midY = (y1 + y2) / 2;
  const path = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

  return (
    <path
      d={path}
      fill="none"
      stroke="var(--colorNeutralStroke2, #d1d1d1)"
      strokeWidth={2}
      markerEnd="url(#arch-arrow)"
    />
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Body1,
  Button,
  Spinner,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { ArrowClockwiseRegular } from "@fluentui/react-icons";
import {
  buildDiagramLayout,
  type ArchitectureResponse,
} from "@microbootcan/shared";
import { ConnectionEdge } from "./ConnectionEdge";
import { ResourceNode } from "./ResourceNode";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  meta: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  canvas: {
    position: "relative",
    width: "100%",
    maxWidth: "720px",
    aspectRatio: "720 / 420",
    margin: "0 auto",
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
    overflow: "hidden",
  },
  svg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  nodes: {
    position: "absolute",
    inset: 0,
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
  },
});

export function ArchitectureDiagram() {
  const styles = useStyles();
  const [data, setData] = useState<ArchitectureResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/architecture");
      if (res.ok) {
        setData((await res.json()) as ArchitectureResponse);
        return;
      }
      const fallback = await fetch("/architecture.mock.json");
      if (!fallback.ok) {
        throw new Error(
          `API HTTP ${res.status} and fallback HTTP ${fallback.status}`,
        );
      }
      setData((await fallback.json()) as ArchitectureResponse);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load architecture",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const layout = useMemo(() => {
    if (!data) return null;
    return buildDiagramLayout(data.resources, data.logicalNodes ?? []);
  }, [data]);

  const nodesById = useMemo(
    () => new Map((layout?.nodes ?? []).map((node) => [node.id, node])),
    [layout],
  );

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <Body1 className={styles.meta}>
          {data
            ? `${data.resourceGroup} · ${data.region} · updated ${new Date(data.fetchedAt).toLocaleString()}`
            : "Live Azure stack topology"}
        </Body1>
        <Button
          appearance="subtle"
          icon={<ArrowClockwiseRegular />}
          disabled={loading}
          onClick={() => void load()}
        >
          Refresh
        </Button>
      </div>

      {loading && !data && <Spinner label="Loading architecture..." />}
      {error && (
        <Body1 className={styles.error}>
          Architecture unavailable: {error}
        </Body1>
      )}

      {layout && (
        <div className={styles.canvas}>
          <svg
            className={styles.svg}
            viewBox={`0 0 ${layout.canvas.width} ${layout.canvas.height}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <defs>
              <marker
                id="arch-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
              >
                <path
                  d="M0,0 L8,4 L0,8 Z"
                  fill="var(--colorNeutralStroke2, #d1d1d1)"
                />
              </marker>
            </defs>
            {layout.edges.map((edge) => (
              <ConnectionEdge
                key={`${edge.from}-${edge.to}`}
                edge={edge}
                nodesById={nodesById}
              />
            ))}
          </svg>

          <div className={styles.nodes}>
            {layout.nodes.map((node) => (
              <ResourceNode
                key={node.id}
                node={node}
                canvas={layout.canvas}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

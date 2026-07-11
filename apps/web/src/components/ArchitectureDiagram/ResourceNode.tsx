import { Badge, Body1, makeStyles, tokens } from "@fluentui/react-components";
import { iconPublicPath } from "@microbootcan/shared";
import type { DiagramNode } from "@microbootcan/shared";

const NODE_WIDTH = 120;
const ICON_SIZE = 48;

const useStyles = makeStyles({
  root: {
    position: "absolute",
    width: `${NODE_WIDTH}px`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    textAlign: "center",
  },
  icon: {
    width: `${ICON_SIZE}px`,
    height: `${ICON_SIZE}px`,
    objectFit: "contain",
  },
  label: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground1,
  },
  meta: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    wordBreak: "break-word",
  },
});

function provisioningAppearance(state?: string) {
  switch (state?.toLowerCase()) {
    case "succeeded":
    case "running":
      return "success" as const;
    case "failed":
      return "danger" as const;
    case "provisioning":
    case "updating":
      return "warning" as const;
    default:
      return "informative" as const;
  }
}

type ResourceNodeProps = {
  node: DiagramNode;
  canvas: { width: number; height: number };
};

export function ResourceNode({ node, canvas }: ResourceNodeProps) {
  const styles = useStyles();

  return (
    <div
      className={styles.root}
      style={{
        left: `${(node.x / canvas.width) * 100}%`,
        top: `${(node.y / canvas.height) * 100}%`,
        transform: "translateX(-50%)",
      }}
    >
      <img
        className={styles.icon}
        src={iconPublicPath(node.iconId)}
        alt=""
        aria-hidden
      />
      <Body1 className={styles.label}>{node.label}</Body1>
      {node.provisioningState && (
        <Badge
          appearance="tint"
          color={provisioningAppearance(node.provisioningState)}
        >
          {node.provisioningState}
        </Badge>
      )}
      {node.kind === "resource" && (
        <span className={styles.meta}>{node.id}</span>
      )}
    </div>
  );
}

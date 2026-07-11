import { makeStyles } from "@fluentui/react-components";
import type { ReactNode } from "react";
import { azureShellColors } from "../../theme/azureTheme";

const useStyles = makeStyles({
  panel: {
    backgroundColor: azureShellColors.panel,
    border: `1px solid ${azureShellColors.panelBorder}`,
    borderRadius: "2px",
    padding: "16px 20px",
  },
});

type ContentPanelProps = {
  children: ReactNode;
  className?: string;
};

export function ContentPanel({ children, className }: ContentPanelProps) {
  const styles = useStyles();
  return <div className={`${styles.panel} ${className ?? ""}`}>{children}</div>;
}

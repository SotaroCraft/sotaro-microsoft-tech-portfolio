import {
  Body1,
  Button,
  Link,
  makeStyles,
  mergeClasses,
} from "@fluentui/react-components";
import {
  CloudRegular,
  OpenRegular,
  PersonCircleRegular,
} from "@fluentui/react-icons";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { azureShellColors } from "../../theme/azureTheme";

const useStyles = makeStyles({
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    minHeight: "48px",
    padding: "0 16px",
    backgroundColor: azureShellColors.topBar,
    color: azureShellColors.topBarText,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    color: "inherit",
    whiteSpace: "nowrap",
  },
  brandText: {
    fontSize: "15px",
    fontWeight: 600,
    letterSpacing: "0.01em",
  },
  divider: {
    width: "1px",
    height: "20px",
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  context: {
    fontSize: "13px",
    opacity: 0.95,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },
  ghostButton: {
    color: "#ffffff",
    ":hover": {
      backgroundColor: azureShellColors.topBarHover,
      color: "#ffffff",
    },
  },
});

type AzureTopBarProps = {
  contextLabel?: string;
  showWorkspaceLink?: boolean;
  trailing?: ReactNode;
};

export function AzureTopBar({
  contextLabel = "MicroBootCan",
  showWorkspaceLink = true,
  trailing,
}: AzureTopBarProps) {
  const styles = useStyles();

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <RouterLink to="/" className={styles.brand}>
          <CloudRegular fontSize={20} />
          <span className={styles.brandText}>MicroBootCan</span>
        </RouterLink>
        <span className={styles.divider} aria-hidden />
        <Body1 className={styles.context}>{contextLabel}</Body1>
      </div>
      <div className={styles.right}>
        {trailing}
        {showWorkspaceLink && (
          <RouterLink to="/app">
            <Button
              appearance="subtle"
              className={styles.ghostButton}
              icon={<OpenRegular />}
            >
              Workspace
            </Button>
          </RouterLink>
        )}
        <Button
          appearance="subtle"
          className={styles.ghostButton}
          icon={<PersonCircleRegular />}
          aria-label="Account"
        />
        <Link
          href="https://github.com/SotaroCraft/sotaro-microsoft-tech-portfolio"
          target="_blank"
          rel="noreferrer"
          className={mergeClasses(styles.ghostButton)}
          style={{ color: "#fff", fontSize: "13px", padding: "6px 10px" }}
        >
          GitHub
        </Link>
      </div>
    </header>
  );
}

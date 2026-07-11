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
  SignOutRegular,
} from "@fluentui/react-icons";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { loginUrl, logoutUrl, useAuth } from "../../hooks/useAuth";
import { LanguageSwitcher } from "../LanguageSwitcher";
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
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  ghostButton: {
    color: "#ffffff",
    ":hover": {
      backgroundColor: azureShellColors.topBarHover,
      color: "#ffffff",
    },
  },
  userLabel: {
    fontSize: "12px",
    opacity: 0.95,
    maxWidth: "180px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});

type AzureTopBarProps = {
  contextLabel?: string;
  showWorkspaceLink?: boolean;
  trailing?: ReactNode;
};

export function AzureTopBar({
  contextLabel,
  showWorkspaceLink = true,
  trailing,
}: AzureTopBarProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const { isAuthenticated, email, loading } = useAuth();

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <RouterLink to="/" className={styles.brand}>
          <CloudRegular fontSize={20} />
          <span className={styles.brandText}>{t("shell.brand")}</span>
        </RouterLink>
        <span className={styles.divider} aria-hidden />
        <Body1 className={styles.context}>
          {contextLabel ?? t("shell.brand")}
        </Body1>
      </div>
      <div className={styles.right}>
        {trailing ?? <LanguageSwitcher />}
        {!loading && isAuthenticated && email && (
          <Body1 className={styles.userLabel}>
            {t("auth.signedInAs", { email })}
          </Body1>
        )}
        {!loading && isAuthenticated && (
          <Button
            appearance="subtle"
            as="a"
            href={logoutUrl("/")}
            className={styles.ghostButton}
            icon={<SignOutRegular />}
          >
            {t("auth.signOut")}
          </Button>
        )}
        {!loading && !isAuthenticated && (
          <Button
            appearance="subtle"
            as="a"
            href={loginUrl("/app")}
            className={styles.ghostButton}
          >
            {t("auth.signIn")}
          </Button>
        )}
        {showWorkspaceLink && (
          <RouterLink to="/app">
            <Button
              appearance="subtle"
              className={styles.ghostButton}
              icon={<OpenRegular />}
            >
              {t("shell.workspace")}
            </Button>
          </RouterLink>
        )}
        <Button
          appearance="subtle"
          className={styles.ghostButton}
          icon={<PersonCircleRegular />}
          aria-label={t("shell.account")}
        />
        <Link
          href="https://github.com/SotaroCraft/sotaro-microsoft-tech-portfolio"
          target="_blank"
          rel="noreferrer"
          className={mergeClasses(styles.ghostButton)}
          style={{ color: "#fff", fontSize: "13px", padding: "6px 10px" }}
        >
          {t("shell.github")}
        </Link>
      </div>
    </header>
  );
}

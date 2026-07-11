import { Body1, makeStyles } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import { workspaceNav } from "../../config/navigation";
import { useCountdown } from "../../hooks/useCountdown";
import { useCurrentProject } from "../../hooks/useCurrentProject";
import { usePageMeta } from "../../hooks/usePageMeta";
import { useUserSettings } from "../../hooks/useUserSettings";
import { azureShellColors } from "../../theme/azureTheme";
import { AzureBreadcrumb } from "./AzureBreadcrumb";
import { AzureSidebar } from "./AzureSidebar";
import { AzureTopBar } from "./AzureTopBar";
import { PageHeader } from "./PageHeader";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: azureShellColors.canvas,
  },
  body: {
    display: "flex",
    flex: 1,
    minHeight: 0,
  },
  main: {
    flex: 1,
    padding: "20px 24px 32px",
    overflow: "auto",
  },
  mainGate: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    overflow: "auto",
  },
  footer: {
    padding: "10px 24px",
    borderTop: `1px solid ${azureShellColors.panelBorder}`,
    backgroundColor: azureShellColors.panel,
    fontSize: "12px",
    color: azureShellColors.mutedText,
    textAlign: "center",
  },
});

export function WorkspaceShell() {
  const styles = useStyles();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { currentProjectId } = useCurrentProject();
  const { settings, loading } = useUserSettings();
  const countdown = useCountdown(settings?.milestoneTargetIso ?? "");
  const meta = usePageMeta("workspace", pathname);
  const projectOpen = Boolean(currentProjectId);
  const isGate = pathname === "/app" || pathname === "/app/";

  const crumbs = [
    { label: t("shell.breadcrumbHome"), to: "/app" },
    ...(pathname !== "/app"
      ? [{ label: meta?.title ?? t("shell.breadcrumbOverview") }]
      : [{ label: t("shell.breadcrumbOverview") }]),
  ];

  return (
    <div className={styles.root}>
      <AzureTopBar
        contextLabel={t("shell.workspaceContext")}
        showWorkspaceLink={false}
      />
      {projectOpen && !isGate && <AzureBreadcrumb items={crumbs} />}
      <div className={styles.body}>
        {projectOpen && !isGate && (
          <AzureSidebar
            items={workspaceNav}
            footer={
              loading
                ? t("shell.countdownLoading")
                : t("shell.countdownLabel", { label: countdown.label })
            }
          />
        )}
        <main className={isGate || !projectOpen ? styles.mainGate : styles.main}>
          {projectOpen && !isGate && meta && (
            <PageHeader title={meta.title} subtitle={meta.subtitle} />
          )}
          <Outlet />
        </main>
      </div>
      {projectOpen && !isGate && (
        <footer className={styles.footer}>
          <Body1>{t("shell.workspaceFooter")}</Body1>
        </footer>
      )}
    </div>
  );
}

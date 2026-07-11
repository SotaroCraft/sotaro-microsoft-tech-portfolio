import { Body1, makeStyles } from "@fluentui/react-components";
import { Outlet, useLocation } from "react-router-dom";
import { workspaceNav, workspaceTitles } from "../../config/navigation";
import { useCountdown } from "../../hooks/useCountdown";
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
  footer: {
    padding: "10px 24px",
    borderTop: `1px solid ${azureShellColors.panelBorder}`,
    backgroundColor: azureShellColors.panel,
    fontSize: "12px",
    color: "#605e5c",
    textAlign: "center",
  },
});

export function WorkspaceShell() {
  const styles = useStyles();
  const { pathname } = useLocation();
  const { settings, loading } = useUserSettings();
  const countdown = useCountdown(settings?.milestoneTargetIso ?? "");
  const meta = workspaceTitles[pathname] ?? workspaceTitles["/app"];

  const crumbs = [
    { label: "Home", to: "/app" },
    ...(pathname !== "/app"
      ? [{ label: meta.title }]
      : [{ label: "Overview" }]),
  ];

  return (
    <div className={styles.root}>
      <AzureTopBar
        contextLabel="Workspace · rg-microbootcan-prod"
        showWorkspaceLink={false}
      />
      <AzureBreadcrumb items={crumbs} />
      <div className={styles.body}>
        <AzureSidebar
          items={workspaceNav}
          footer={
            loading
              ? "Milestone countdown…"
              : `Countdown: ${countdown.label}`
          }
        />
        <main className={styles.main}>
          <PageHeader title={meta.title} subtitle={meta.subtitle} />
          <Outlet />
        </main>
      </div>
      <footer className={styles.footer}>
        <Body1>Authenticated workspace — personal data stays private.</Body1>
      </footer>
    </div>
  );
}

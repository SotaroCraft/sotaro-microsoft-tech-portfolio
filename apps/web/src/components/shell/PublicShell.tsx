import { Body1, makeStyles } from "@fluentui/react-components";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import {
  publicNav,
  publicTitles,
  type BreadcrumbItem,
} from "../../config/navigation";
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
    maxWidth: "1200px",
  },
  footer: {
    padding: "12px 24px",
    borderTop: `1px solid ${azureShellColors.panelBorder}`,
    backgroundColor: azureShellColors.panel,
    textAlign: "center",
    fontSize: "12px",
    color: "#605e5c",
  },
});

type PublicShellProps = {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  hideSidebar?: boolean;
};

export function PublicShell({
  children,
  breadcrumbs,
  hideSidebar = false,
}: PublicShellProps) {
  const styles = useStyles();
  const { pathname } = useLocation();
  const meta = publicTitles[pathname];
  const crumbs: BreadcrumbItem[] = breadcrumbs ?? [
    { label: "Home", to: "/" },
    ...(pathname !== "/"
      ? [{ label: meta?.title ?? "Page" }]
      : []),
  ];

  return (
    <div className={styles.root}>
      <AzureTopBar contextLabel="Public preview" />
      <AzureBreadcrumb items={crumbs} />
      <div className={styles.body}>
        {!hideSidebar && <AzureSidebar items={publicNav} />}
        <main className={styles.main}>
          {meta && <PageHeader title={meta.title} subtitle={meta.subtitle} />}
          {children}
        </main>
      </div>
      <footer className={styles.footer}>
        <Body1>
          Public landing — personal data stays in the Entra ID–protected workspace.
        </Body1>
      </footer>
    </div>
  );
}

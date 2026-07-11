import { Body1, makeStyles } from "@fluentui/react-components";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { publicNav, type BreadcrumbItem } from "../../config/navigation";
import { usePageMeta } from "../../hooks/usePageMeta";
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
    color: azureShellColors.mutedText,
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
  const { t } = useTranslation();
  const meta = usePageMeta("public", pathname);
  const crumbs: BreadcrumbItem[] = breadcrumbs ?? [
    { label: t("shell.breadcrumbHome"), to: "/" },
    ...(pathname !== "/"
      ? [{ label: meta?.title ?? t("shell.breadcrumbPage") }]
      : []),
  ];

  return (
    <div className={styles.root}>
      <AzureTopBar contextLabel={t("shell.publicPreview")} />
      <AzureBreadcrumb items={crumbs} />
      <div className={styles.body}>
        {!hideSidebar && <AzureSidebar items={publicNav} />}
        <main className={styles.main}>
          {meta && <PageHeader title={meta.title} subtitle={meta.subtitle} />}
          {children}
        </main>
      </div>
      <footer className={styles.footer}>
        <Body1>{t("shell.publicFooter")}</Body1>
      </footer>
    </div>
  );
}

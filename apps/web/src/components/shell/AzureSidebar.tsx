import { Body1, makeStyles, mergeClasses } from "@fluentui/react-components";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useLocation } from "react-router-dom";
import type { NavItem } from "../../config/navigation";
import { azureShellColors } from "../../theme/azureTheme";

const useStyles = makeStyles({
  nav: {
    width: "232px",
    flexShrink: 0,
    backgroundColor: azureShellColors.sidebar,
    borderRight: `1px solid ${azureShellColors.panelBorder}`,
    padding: "8px 0",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minHeight: "100%",
  },
  section: {
    margin: "12px 16px 4px",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: azureShellColors.mutedText,
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    margin: "0 8px",
    borderRadius: "2px",
    textDecoration: "none",
    color: azureShellColors.bodyText,
    fontSize: "14px",
    borderLeft: "3px solid transparent",
    transitionProperty: "background-color, border-color",
    transitionDuration: "0.15s",
    transitionTimingFunction: "ease",
    ":hover": {
      backgroundColor: azureShellColors.sidebarSelected,
    },
  },
  active: {
    backgroundColor: azureShellColors.panel,
    borderLeftColor: azureShellColors.sidebarAccent,
    fontWeight: 600,
    boxShadow: `inset 0 -1px 0 ${azureShellColors.panelBorder}, inset 0 1px 0 ${azureShellColors.panelBorder}`,
  },
  footer: {
    marginTop: "auto",
    padding: "12px 16px",
    borderTop: `1px solid ${azureShellColors.panelBorder}`,
    fontSize: "12px",
    color: azureShellColors.mutedText,
  },
});

type AzureSidebarProps = {
  items: NavItem[];
  footer?: string;
};

function isActive(pathname: string, item: NavItem) {
  if (item.end) return pathname === item.to;
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

export function AzureSidebar({ items, footer }: AzureSidebarProps) {
  const styles = useStyles();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  let lastSection: string | undefined;

  return (
    <aside className={styles.nav} aria-label={t("nav.ariaWorkspace")}>
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item);
        const showSection = Boolean(item.sectionKey && item.sectionKey !== lastSection);
        if (item.sectionKey) lastSection = item.sectionKey;

        return (
          <Fragment key={item.to}>
            {showSection && item.sectionKey ? (
              <div className={styles.section}>{t(item.sectionKey)}</div>
            ) : null}
            <RouterLink
              to={item.to}
              className={mergeClasses(styles.item, active && styles.active)}
              title={t(`${item.labelKey}Hint`)}
            >
              <Icon fontSize={18} />
              <span>{t(item.labelKey)}</span>
            </RouterLink>
          </Fragment>
        );
      })}
      {footer && (
        <div className={styles.footer}>
          <Body1>{footer}</Body1>
        </div>
      )}
    </aside>
  );
}

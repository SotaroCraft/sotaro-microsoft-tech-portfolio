import { Body1, makeStyles, mergeClasses } from "@fluentui/react-components";
import { Link as RouterLink, useLocation } from "react-router-dom";
import type { NavItem } from "../../config/navigation";
import { azureShellColors } from "../../theme/azureTheme";

const useStyles = makeStyles({
  nav: {
    width: "220px",
    flexShrink: 0,
    backgroundColor: azureShellColors.sidebar,
    borderRight: `1px solid ${azureShellColors.panelBorder}`,
    padding: "8px 0",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minHeight: "100%",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    margin: "0 8px",
    borderRadius: "2px",
    textDecoration: "none",
    color: "#323130",
    fontSize: "14px",
    borderLeft: "3px solid transparent",
    ":hover": {
      backgroundColor: azureShellColors.sidebarSelected,
    },
  },
  active: {
    backgroundColor: "#ffffff",
    borderLeftColor: azureShellColors.sidebarAccent,
    fontWeight: 600,
    boxShadow: "inset 0 -1px 0 #edebe9, inset 0 1px 0 #edebe9",
  },
  footer: {
    marginTop: "auto",
    padding: "12px 16px",
    borderTop: `1px solid ${azureShellColors.panelBorder}`,
    fontSize: "12px",
    color: "#605e5c",
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

  return (
    <aside className={styles.nav}>
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item);
        return (
          <RouterLink
            key={item.to}
            to={item.to}
            className={mergeClasses(styles.item, active && styles.active)}
          >
            <Icon fontSize={18} />
            <span>{item.label}</span>
          </RouterLink>
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

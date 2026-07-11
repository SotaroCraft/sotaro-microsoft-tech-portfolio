import { Body1, makeStyles } from "@fluentui/react-components";
import { ChevronRightRegular } from "@fluentui/react-icons";
import { Fragment } from "react";
import { Link as RouterLink } from "react-router-dom";
import type { BreadcrumbItem } from "../../config/navigation";
import { azureShellColors } from "../../theme/azureTheme";

const useStyles = makeStyles({
  bar: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "6px",
    minHeight: "36px",
    padding: "0 20px",
    backgroundColor: azureShellColors.panel,
    borderBottom: `1px solid ${azureShellColors.panelBorder}`,
    fontSize: "13px",
  },
  item: {
    color: azureShellColors.link,
    textDecoration: "none",
    ":hover": {
      textDecoration: "underline",
    },
  },
  current: {
    color: azureShellColors.bodyText,
  },
  sep: {
    color: azureShellColors.mutedText,
    display: "flex",
    alignItems: "center",
  },
});

type AzureBreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function AzureBreadcrumb({ items }: AzureBreadcrumbProps) {
  const styles = useStyles();

  return (
    <nav className={styles.bar} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 && (
              <span className={styles.sep} aria-hidden>
                <ChevronRightRegular fontSize={12} />
              </span>
            )}
            {item.to && !isLast ? (
              <RouterLink to={item.to} className={styles.item}>
                {item.label}
              </RouterLink>
            ) : (
              <Body1 className={styles.current}>{item.label}</Body1>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}

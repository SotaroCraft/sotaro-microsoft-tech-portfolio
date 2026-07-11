import { Body1, Title1, makeStyles, tokens } from "@fluentui/react-components";
import type { ReactNode } from "react";

const useStyles = makeStyles({
  root: {
    marginBottom: "16px",
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },
  subtitle: {
    color: tokens.colorNeutralForeground2,
    marginTop: "4px",
  },
  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
});

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  const styles = useStyles();

  return (
    <header className={styles.root}>
      <div className={styles.titleRow}>
        <div>
          <Title1>{title}</Title1>
          {subtitle && <Body1 className={styles.subtitle}>{subtitle}</Body1>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </header>
  );
}

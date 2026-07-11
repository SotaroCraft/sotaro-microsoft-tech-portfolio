import {
  Body1,
  Button,
  makeStyles,
  tokens,
  Title3,
} from "@fluentui/react-components";
import { Link as RouterLink } from "react-router-dom";
import { useCountdown } from "../hooks/useCountdown";
import { useUserSettings } from "../hooks/useUserSettings";

const useStyles = makeStyles({
  bar: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    padding: "10px 16px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: tokens.shadow2,
  },
  nav: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
});

export function StickyCountdown() {
  const styles = useStyles();
  const { settings, loading } = useUserSettings();
  const countdown = useCountdown(settings?.milestoneTargetIso ?? "");

  return (
    <header className={styles.bar}>
      <div>
        <Title3>Milestone countdown</Title3>
        <Body1>
          {loading ? "Loading…" : countdown.label}
        </Body1>
      </div>
      <nav className={styles.nav}>
        <RouterLink to="/app">
          <Button appearance="subtle">Dashboard</Button>
        </RouterLink>
        <RouterLink to="/app/journal">
          <Button appearance="subtle">Journal</Button>
        </RouterLink>
        <RouterLink to="/app/pipeline">
          <Button appearance="subtle">Pipeline</Button>
        </RouterLink>
        <RouterLink to="/app/summary">
          <Button appearance="subtle">Summary</Button>
        </RouterLink>
        <RouterLink to="/app/settings">
          <Button appearance="subtle">Settings</Button>
        </RouterLink>
      </nav>
    </header>
  );
}

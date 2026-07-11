import {
  Body1,
  Button,
  Card,
  CardHeader,
  FluentProvider,
  Title1,
  Title2,
  webLightTheme,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  AI_BUDGET,
  MILESTONE_TARGET_ISO,
  PIPELINE_STAGES,
  demoEpisodes,
} from "@microbootcan/shared";
import { Link as RouterLink } from "react-router-dom";
import { useCountdown } from "../hooks/useCountdown";
import { useHealthCheck } from "../hooks/useHealthCheck";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    backgroundColor: tokens.colorNeutralBackground2,
    padding: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "24px",
    padding: "12px 16px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    borderLeft: `4px solid ${tokens.colorBrandBackground}`,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
});

export function AppHomePage() {
  const styles = useStyles();
  const milestone = useCountdown(MILESTONE_TARGET_ISO);
  const health = useHealthCheck();

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.root}>
        <header className={styles.header}>
          <div>
            <Title1>Workspace</Title1>
            <Body1>Personal dashboard (scaffold)</Body1>
          </div>
          <Body1>Milestone: {milestone.label}</Body1>
        </header>

        <div className={styles.grid}>
          <Card>
            <CardHeader header={<Title2>API status</Title2>} />
            <Body1>
              {health.loading && "Checking /api/health..."}
              {health.error && `Offline: ${health.error}`}
              {health.data && `OK — env: ${health.data.env}`}
            </Body1>
          </Card>

          <Card>
            <CardHeader header={<Title2>Pipeline stages</Title2>} />
            <Body1>{PIPELINE_STAGES.length} stages configured</Body1>
          </Card>

          <Card>
            <CardHeader header={<Title2>Sample journal entry</Title2>} />
            <Body1>{demoEpisodes[0]?.title}</Body1>
          </Card>

          <Card>
            <CardHeader header={<Title2>Azure budget cap</Title2>} />
            <Body1>¥{AI_BUDGET.monthlyLimitJpy} / month</Body1>
          </Card>
        </div>

        <div style={{ marginTop: "24px" }}>
          <RouterLink to="/">
            <Button appearance="subtle">Back to public overview</Button>
          </RouterLink>
        </div>
      </div>
    </FluentProvider>
  );
}

import {
  Body1,
  Button,
  Card,
  CardHeader,
  Title1,
  Title2,
  makeStyles,
} from "@fluentui/react-components";
import { AI_BUDGET, demoEpisodes, PIPELINE_STAGES } from "@microbootcan/shared";
import { Link as RouterLink } from "react-router-dom";
import { useHealthCheck } from "../hooks/useHealthCheck";

const useStyles = makeStyles({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
});

export function AppHomePage() {
  const styles = useStyles();
  const health = useHealthCheck();

  return (
    <section>
      <Title1>Workspace dashboard</Title1>
      <Body1>Must-have modules for milestone tracking and structured records.</Body1>

      <div className={styles.grid} style={{ marginTop: "16px" }}>
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
          <RouterLink to="/app/pipeline">
            <Button appearance="primary">Open pipeline</Button>
          </RouterLink>
        </Card>

        <Card>
          <CardHeader header={<Title2>Sample journal entry</Title2>} />
          <Body1>{demoEpisodes[0]?.title}</Body1>
          <RouterLink to="/app/journal">
            <Button appearance="primary">Open journal</Button>
          </RouterLink>
        </Card>

        <Card>
          <CardHeader header={<Title2>Azure budget cap</Title2>} />
          <Body1>¥{AI_BUDGET.monthlyLimitJpy} / month</Body1>
        </Card>
      </div>
    </section>
  );
}

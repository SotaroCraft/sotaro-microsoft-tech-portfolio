import {
  Body1,
  Button,
  Card,
  CardHeader,
  Title2,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { AI_BUDGET, demoEpisodes, PIPELINE_STAGES } from "@microbootcan/shared";
import { Link as RouterLink } from "react-router-dom";
import { ContentPanel } from "../components/shell/ContentPanel";
import { useHealthCheck } from "../hooks/useHealthCheck";
import { azureShellColors } from "../theme/azureTheme";

const useStyles = makeStyles({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },
  card: {
    backgroundColor: azureShellColors.panel,
    border: `1px solid ${azureShellColors.panelBorder}`,
    borderRadius: "2px",
    boxShadow: "none",
  },
  statusOk: {
    color: tokens.colorPaletteGreenForeground1,
  },
  statusErr: {
    color: tokens.colorPaletteRedForeground1,
  },
});

export function AppHomePage() {
  const styles = useStyles();
  const health = useHealthCheck();

  return (
    <>
      <ContentPanel>
        <Body1>
          Must-have modules for milestone tracking and structured records. Use
          the left menu to open each blade.
        </Body1>
      </ContentPanel>

      <div className={styles.grid} style={{ marginTop: "16px" }}>
        <Card className={styles.card}>
          <CardHeader header={<Title2>API status</Title2>} />
          <Body1>
            {health.loading && "Checking /api/health…"}
            {health.error && (
              <span className={styles.statusErr}>Offline: {health.error}</span>
            )}
            {health.data && (
              <span className={styles.statusOk}>
                OK — env: {health.data.env}
              </span>
            )}
          </Body1>
        </Card>

        <Card className={styles.card}>
          <CardHeader header={<Title2>Pipeline stages</Title2>} />
          <Body1>{PIPELINE_STAGES.length} stages configured</Body1>
          <RouterLink to="/app/pipeline">
            <Button appearance="primary">Open pipeline</Button>
          </RouterLink>
        </Card>

        <Card className={styles.card}>
          <CardHeader header={<Title2>Sample journal entry</Title2>} />
          <Body1>{demoEpisodes[0]?.title}</Body1>
          <RouterLink to="/app/journal">
            <Button appearance="primary">Open journal</Button>
          </RouterLink>
        </Card>

        <Card className={styles.card}>
          <CardHeader header={<Title2>Azure budget cap</Title2>} />
          <Body1>¥{AI_BUDGET.monthlyLimitJpy} / month</Body1>
        </Card>
      </div>
    </>
  );
}

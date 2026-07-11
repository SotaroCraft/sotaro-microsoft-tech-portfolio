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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const health = useHealthCheck();

  return (
    <>
      <ContentPanel>
        <Body1>{t("dashboard.intro")}</Body1>
      </ContentPanel>

      <div className={styles.grid} style={{ marginTop: "16px" }}>
        <Card className={styles.card}>
          <CardHeader header={<Title2>{t("dashboard.apiStatus")}</Title2>} />
          <Body1>
            {health.loading && t("dashboard.apiChecking")}
            {health.error && (
              <span className={styles.statusErr}>
                {t("dashboard.apiOffline", { error: health.error })}
              </span>
            )}
            {health.data && (
              <span className={styles.statusOk}>
                {t("dashboard.apiOk", { env: health.data.env })}
              </span>
            )}
          </Body1>
        </Card>

        <Card className={styles.card}>
          <CardHeader header={<Title2>{t("dashboard.pipelineStages")}</Title2>} />
          <Body1>
            {t("dashboard.stagesConfigured", {
              count: PIPELINE_STAGES.length,
            })}
          </Body1>
          <RouterLink to="/app/pipeline">
            <Button appearance="primary">{t("dashboard.openPipeline")}</Button>
          </RouterLink>
        </Card>

        <Card className={styles.card}>
          <CardHeader header={<Title2>{t("dashboard.sampleJournal")}</Title2>} />
          <Body1>{demoEpisodes[0]?.title}</Body1>
          <RouterLink to="/app/journal">
            <Button appearance="primary">{t("dashboard.openJournal")}</Button>
          </RouterLink>
        </Card>

        <Card className={styles.card}>
          <CardHeader header={<Title2>{t("dashboard.budgetCap")}</Title2>} />
          <Body1>
            {t("dashboard.budgetPerMonth", {
              amount: AI_BUDGET.monthlyLimitJpy,
            })}
          </Body1>
        </Card>
      </div>
    </>
  );
}

import {
  Body1,
  Button,
  Card,
  CardHeader,
  Title2,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import type { Application, Episode } from "@microstar/shared";
import { AI_BUDGET, PIPELINE_STAGES } from "@microstar/shared";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { ContentPanel } from "../components/shell/ContentPanel";
import { OpenProjectDialog } from "../components/OpenProjectDialog";
import { useHealthCheck } from "../hooks/useHealthCheck";
import { apiFetch } from "../lib/api";
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
  list: {
    display: "grid",
    gap: "8px",
    marginTop: "8px",
  },
  muted: {
    color: azureShellColors.mutedText,
  },
});

export function AppHomePage() {
  const [openProject, setOpenProject] = useState(false);
  const styles = useStyles();
  const { t } = useTranslation();
  const health = useHealthCheck();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [episodeRows, applicationRows] = await Promise.all([
          apiFetch<Episode[]>("/episodes"),
          apiFetch<Application[]>("/applications"),
        ]);
        setEpisodes(episodeRows);
        setApplications(applicationRows);
        setLoadError(null);
      } catch (err) {
        setLoadError(
          err instanceof Error ? err.message : t("common.failedToLoad"),
        );
      }
    }
    void load();
  }, [t]);

  const recentEpisodes = useMemo(() => episodes.slice(0, 3), [episodes]);

  const upcomingActions = useMemo(() => {
    return applications
      .filter((row) => row.nextAction)
      .sort((a, b) => {
        const aDate = a.nextActionDate ?? "9999-12-31";
        const bDate = b.nextActionDate ?? "9999-12-31";
        return aDate.localeCompare(bDate);
      })
      .slice(0, 5);
  }, [applications]);

  return (
    <>
      <ContentPanel>
        <Body1>{t("dashboard.intro")}</Body1>
        <div style={{ marginTop: "12px" }}>
          <Button appearance="primary" onClick={() => setOpenProject(true)}>
            {t("project.openDialog")}
          </Button>
        </div>
      </ContentPanel>

      <OpenProjectDialog
        hideTrigger
        open={openProject}
        onOpenChange={setOpenProject}
      />

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
          <CardHeader header={<Title2>{t("dashboard.recentJournal")}</Title2>} />
          {loadError && <Body1 className={styles.muted}>{loadError}</Body1>}
          {!loadError && recentEpisodes.length === 0 && (
            <Body1 className={styles.muted}>{t("dashboard.noRecentJournal")}</Body1>
          )}
          <div className={styles.list}>
            {recentEpisodes.map((episode) => (
              <Body1 key={episode.id}>{episode.title}</Body1>
            ))}
          </div>
          <RouterLink to="/app/journal">
            <Button appearance="primary">{t("dashboard.openJournal")}</Button>
          </RouterLink>
        </Card>

        <Card className={styles.card}>
          <CardHeader header={<Title2>{t("dashboard.upcomingActions")}</Title2>} />
          {!loadError && upcomingActions.length === 0 && (
            <Body1 className={styles.muted}>
              {t("dashboard.noUpcomingActions")}
            </Body1>
          )}
          <div className={styles.list}>
            {upcomingActions.map((row) => (
              <Body1 key={row.id}>
                {row.nextActionDate
                  ? `${row.nextActionDate.slice(0, 10)} · ${row.nextAction}`
                  : row.nextAction}
                {" — "}
                {row.roleTitle}
              </Body1>
            ))}
          </div>
          <RouterLink to="/app/pipeline">
            <Button appearance="secondary">
              {t("dashboard.openPipeline")}
            </Button>
          </RouterLink>
        </Card>

        <Card className={styles.card}>
          <CardHeader header={<Title2>{t("dashboard.contextMatch")}</Title2>} />
          <Body1>{t("dashboard.contextMatchHint")}</Body1>
          <RouterLink to="/app/match">
            <Button appearance="primary">{t("dashboard.openMatch")}</Button>
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

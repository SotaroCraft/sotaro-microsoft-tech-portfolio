import {
  Body1,
  Button,
  Spinner,
  Title2,
  makeStyles,
} from "@fluentui/react-components";
import type { Project } from "@microstar/shared";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ContentPanel } from "../components/shell/ContentPanel";
import { OpenProjectDialog } from "../components/OpenProjectDialog";
import { useCurrentProject } from "../hooks/useCurrentProject";
import { apiFetch } from "../lib/api";
import { azureShellColors } from "../theme/azureTheme";

const useStyles = makeStyles({
  stack: {
    display: "grid",
    gap: "16px",
    maxWidth: "720px",
  },
  muted: {
    color: azureShellColors.mutedText,
  },
  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
});

export function ProjectWorkspacePage() {
  const styles = useStyles();
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { rememberOpened, setCurrentProjectId } = useCurrentProject();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [switchOpen, setSwitchOpen] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const row = await apiFetch<Project>(`/projects/${projectId}`);
        if (cancelled) return;
        setProject(row);
        rememberOpened(row);
      } catch (err) {
        if (cancelled) return;
        setProject(null);
        setError(err instanceof Error ? err.message : t("common.failedToLoad"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [projectId, rememberOpened, t]);

  return (
    <div className={styles.stack}>
      <ContentPanel>
        {loading && <Spinner size="tiny" label={t("common.loading")} />}
        {error && <Body1 className={styles.muted}>{error}</Body1>}
        {!loading && project && (
          <>
            <Title2>{project.title}</Title2>
            {project.summary ? <Body1>{project.summary}</Body1> : null}
            <Body1 className={styles.muted}>{t("project.workspaceHint")}</Body1>
            <div className={styles.actions}>
              <Button appearance="primary" onClick={() => setSwitchOpen(true)}>
                {t("project.switchProject")}
              </Button>
              <Button
                appearance="secondary"
                onClick={() => {
                  setCurrentProjectId(null);
                  navigate("/app");
                }}
              >
                {t("project.backHome")}
              </Button>
            </div>
          </>
        )}
      </ContentPanel>

      <OpenProjectDialog
        hideTrigger
        open={switchOpen}
        onOpenChange={setSwitchOpen}
      />
    </div>
  );
}

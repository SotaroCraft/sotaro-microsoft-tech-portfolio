import {
  Body1,
  Button,
  Input,
  Spinner,
  Title2,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import type { Project } from "@microstar/shared";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCurrentProject } from "../hooks/useCurrentProject";
import { apiFetch } from "../lib/api";
import { azureShellColors } from "../theme/azureTheme";

const RECENT_LIMIT = 8;

const useStyles = makeStyles({
  panel: {
    width: "min(400px, 92vw)",
    display: "grid",
    gap: "12px",
    padding: "20px 22px",
    backgroundColor: azureShellColors.panel,
    border: `1px solid ${azureShellColors.panelBorder}`,
    borderRadius: "2px",
    boxShadow: "0 8px 28px rgba(27, 36, 48, 0.12)",
  },
  content: {
    display: "grid",
    gap: "8px",
    maxHeight: "min(50vh, 360px)",
    overflowY: "auto",
  },
  list: {
    display: "grid",
    gap: "4px",
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  item: {
    display: "grid",
    gap: "1px",
    textAlign: "left",
    padding: "8px 10px",
    border: `1px solid ${azureShellColors.panelBorder}`,
    borderRadius: "2px",
    backgroundColor: azureShellColors.canvas,
    cursor: "pointer",
    width: "100%",
    font: "inherit",
    color: "inherit",
    ":hover": {
      border: `1px solid ${azureShellColors.sidebarAccent}`,
      backgroundColor: azureShellColors.sidebarSelected,
    },
  },
  itemSelected: {
    border: `1px solid ${azureShellColors.sidebarAccent}`,
    boxShadow: `inset 3px 0 0 ${azureShellColors.sidebarAccent}`,
  },
  itemTitle: {
    fontWeight: 600,
    fontSize: "13px",
  },
  itemMeta: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
  },
  muted: {
    color: azureShellColors.mutedText,
    fontSize: "13px",
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: "13px",
  },
  newRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "8px",
    alignItems: "center",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    flexWrap: "wrap",
  },
});

type OpenProjectPanelProps = {
  onOpened?: () => void;
  showClose?: boolean;
  onClose?: () => void;
};

export function OpenProjectPanel({
  onOpened,
  showClose = false,
  onClose,
}: OpenProjectPanelProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { rememberOpened } = useCurrentProject();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => {
        const aKey = a.lastOpenedAt ?? a.updatedAt;
        const bKey = b.lastOpenedAt ?? b.updatedAt;
        return bKey.localeCompare(aKey);
      })
      .slice(0, RECENT_LIMIT);
  }, [projects]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await apiFetch<Project[]>("/projects");
      setProjects(rows);
      const sorted = [...rows].sort((a, b) => {
        const aKey = a.lastOpenedAt ?? a.updatedAt;
        const bKey = b.lastOpenedAt ?? b.updatedAt;
        return bKey.localeCompare(aKey);
      });
      setSelectedId(sorted[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.failedToLoad"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function openProject(id: string) {
    setBusy(true);
    setError(null);
    try {
      const project = await apiFetch<Project>(`/projects/${id}/open`, {
        method: "POST",
        body: "{}",
      });
      rememberOpened(project);
      onOpened?.();
      navigate(`/app/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("project.openFailed"));
    } finally {
      setBusy(false);
    }
  }

  async function createAndOpen() {
    if (!newTitle.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const project = await apiFetch<Project>("/projects", {
        method: "POST",
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      rememberOpened(project);
      onOpened?.();
      navigate(`/app/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("project.createFailed"));
    } finally {
      setBusy(false);
    }
  }

  function formatWhen(iso?: string) {
    if (!iso) return t("project.neverOpened");
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  }

  return (
    <div className={styles.panel}>
      <Title2>{t("project.openTitle")}</Title2>
      <div className={styles.content}>
        {loading && <Spinner size="tiny" label={t("common.loading")} />}
        {error && <Body1 className={styles.error}>{error}</Body1>}

        {!loading && recentProjects.length === 0 && !showNew && (
          <Body1 className={styles.muted}>{t("project.empty")}</Body1>
        )}

        {!loading && recentProjects.length > 0 && (
          <ul className={styles.list}>
            {recentProjects.map((project) => (
              <li key={project.id}>
                <button
                  type="button"
                  className={[
                    styles.item,
                    selectedId === project.id ? styles.itemSelected : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setSelectedId(project.id)}
                  onDoubleClick={() => void openProject(project.id)}
                >
                  <span className={styles.itemTitle}>{project.title}</span>
                  <span className={styles.itemMeta}>
                    {formatWhen(project.lastOpenedAt ?? project.updatedAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {showNew && (
          <div className={styles.newRow}>
            <Input
              value={newTitle}
              onChange={(_e, data) => setNewTitle(data.value)}
              placeholder={t("project.titlePlaceholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter") void createAndOpen();
              }}
            />
            <Button
              appearance="primary"
              disabled={!newTitle.trim() || busy}
              onClick={() => void createAndOpen()}
            >
              {t("project.createAndOpen")}
            </Button>
          </div>
        )}
      </div>
      <div className={styles.actions}>
        {!showNew && (
          <Button appearance="subtle" onClick={() => setShowNew(true)}>
            {t("project.new")}
          </Button>
        )}
        {showClose && (
          <Button appearance="secondary" onClick={onClose}>
            {t("common.close")}
          </Button>
        )}
        <Button
          appearance="primary"
          disabled={!selectedId || busy || loading || showNew}
          onClick={() => selectedId && void openProject(selectedId)}
        >
          {t("project.openSelected")}
        </Button>
      </div>
    </div>
  );
}

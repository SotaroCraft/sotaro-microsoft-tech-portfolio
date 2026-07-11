import {
  Body1,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Spinner,
  Textarea,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { FolderOpenRegular } from "@fluentui/react-icons";
import type { Project } from "@microstar/shared";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCurrentProject } from "../hooks/useCurrentProject";
import { apiFetch } from "../lib/api";
import { azureShellColors } from "../theme/azureTheme";

const useStyles = makeStyles({
  surface: {
    maxWidth: "520px",
    width: "min(520px, 94vw)",
    maxHeight: "85vh",
  },
  content: {
    display: "grid",
    gap: "14px",
    overflowY: "auto",
    maxHeight: "min(62vh, 560px)",
  },
  list: {
    display: "grid",
    gap: "6px",
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  item: {
    display: "grid",
    gap: "2px",
    textAlign: "left",
    padding: "10px 12px",
    border: `1px solid ${azureShellColors.panelBorder}`,
    borderRadius: "2px",
    backgroundColor: azureShellColors.panel,
    cursor: "pointer",
    width: "100%",
    font: "inherit",
    color: "inherit",
    ":hover": {
      borderColor: azureShellColors.sidebarAccent,
      backgroundColor: azureShellColors.sidebarSelected,
    },
  },
  itemSelected: {
    borderColor: azureShellColors.sidebarAccent,
    boxShadow: `inset 3px 0 0 ${azureShellColors.sidebarAccent}`,
  },
  itemTitle: {
    fontWeight: 600,
    fontSize: "14px",
  },
  itemMeta: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground3,
  },
  createBox: {
    display: "grid",
    gap: "10px",
    paddingTop: "4px",
    borderTop: `1px solid ${azureShellColors.panelBorder}`,
  },
  muted: {
    color: azureShellColors.mutedText,
    fontSize: "13px",
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: "13px",
  },
  ghost: {
    color: "#ffffff",
    ":hover": {
      backgroundColor: azureShellColors.topBarHover,
      color: "#ffffff",
    },
  },
});

type OpenProjectDialogProps = {
  triggerClassName?: string;
  /** Open immediately when mounted (e.g. from home CTA). */
  defaultOpen?: boolean;
  hideTrigger?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function OpenProjectDialog({
  triggerClassName,
  defaultOpen = false,
  hideTrigger = false,
  open: openProp,
  onOpenChange,
}: OpenProjectDialogProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { rememberOpened } = useCurrentProject();

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, openProp],
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");

  const activeProjects = useMemo(
    () => projects.filter((p) => p.status === "active"),
    [projects],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await apiFetch<Project[]>("/projects");
      setProjects(rows);
      const firstActive = rows.find((p) => p.status === "active");
      setSelectedId((prev) => prev ?? firstActive?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.failedToLoad"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  async function handleOpenSelected() {
    if (!selectedId) return;
    setOpening(true);
    setError(null);
    try {
      const project = await apiFetch<Project>(`/projects/${selectedId}/open`, {
        method: "POST",
        body: "{}",
      });
      rememberOpened(project);
      setOpen(false);
      navigate(`/app/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("project.openFailed"));
    } finally {
      setOpening(false);
    }
  }

  async function handleCreateAndOpen() {
    if (!newTitle.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const project = await apiFetch<Project>("/projects", {
        method: "POST",
        body: JSON.stringify({
          title: newTitle.trim(),
          summary: newSummary.trim() || undefined,
        }),
      });
      rememberOpened(project);
      setNewTitle("");
      setNewSummary("");
      setOpen(false);
      navigate(`/app/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("project.createFailed"));
    } finally {
      setCreating(false);
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
    <Dialog
      open={open}
      onOpenChange={(_e, data) => setOpen(data.open)}
    >
      {!hideTrigger && (
        <DialogTrigger disableButtonEnhancement>
          <Button
            appearance="subtle"
            className={triggerClassName ?? styles.ghost}
            icon={<FolderOpenRegular />}
          >
            {t("project.openDialog")}
          </Button>
        </DialogTrigger>
      )}
      <DialogSurface className={styles.surface}>
        <DialogBody>
          <DialogTitle>{t("project.openTitle")}</DialogTitle>
          <DialogContent className={styles.content}>
            <Body1 className={styles.muted}>{t("project.openLead")}</Body1>

            {loading && <Spinner size="tiny" label={t("common.loading")} />}
            {error && <Body1 className={styles.error}>{error}</Body1>}

            {!loading && activeProjects.length === 0 && (
              <Body1 className={styles.muted}>{t("project.empty")}</Body1>
            )}

            {!loading && activeProjects.length > 0 && (
              <ul className={styles.list}>
                {activeProjects.map((project) => (
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
                      onDoubleClick={() => {
                        setSelectedId(project.id);
                        void handleOpenSelected();
                      }}
                    >
                      <span className={styles.itemTitle}>{project.title}</span>
                      <span className={styles.itemMeta}>
                        {t("project.lastOpened", {
                          when: formatWhen(
                            project.lastOpenedAt ?? project.updatedAt,
                          ),
                        })}
                      </span>
                      {project.summary ? (
                        <span className={styles.itemMeta}>{project.summary}</span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className={styles.createBox}>
              <Body1 className={styles.itemTitle}>{t("project.createTitle")}</Body1>
              <Field label={t("project.titleLabel")}>
                <Input
                  value={newTitle}
                  onChange={(_e, data) => setNewTitle(data.value)}
                  placeholder={t("project.titlePlaceholder")}
                />
              </Field>
              <Field label={t("project.summaryLabel")}>
                <Textarea
                  value={newSummary}
                  onChange={(_e, data) => setNewSummary(data.value)}
                  placeholder={t("project.summaryPlaceholder")}
                  rows={2}
                />
              </Field>
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">{t("common.close")}</Button>
            </DialogTrigger>
            <Button
              appearance="secondary"
              disabled={!newTitle.trim() || creating}
              onClick={() => void handleCreateAndOpen()}
            >
              {creating ? t("common.loading") : t("project.createAndOpen")}
            </Button>
            <Button
              appearance="primary"
              disabled={!selectedId || opening || loading}
              onClick={() => void handleOpenSelected()}
            >
              {opening ? t("common.loading") : t("project.openSelected")}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

import {
  Body1,
  Button,
  Card,
  CardHeader,
  Field,
  Input,
  Textarea,
  Title3,
  makeStyles,
} from "@fluentui/react-components";
import type { Episode } from "@microstar/shared";
import { STAR_FIELDS } from "@microstar/shared";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { ContentPanel } from "../components/shell/ContentPanel";
import { useAppLocale } from "../hooks/useAppLocale";
import type { GraphImportHandoff } from "../lib/graph";
import { apiFetch } from "../lib/api";
import { azureShellColors } from "../theme/azureTheme";

const useStyles = makeStyles({
  list: {
    display: "grid",
    gap: "12px",
    marginTop: "16px",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  formActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: azureShellColors.panel,
    border: `1px solid ${azureShellColors.panelBorder}`,
    borderRadius: "2px",
    boxShadow: "none",
  },
  cardActions: {
    display: "flex",
    gap: "8px",
    marginTop: "12px",
  },
  starBlock: {
    marginTop: "8px",
    display: "grid",
    gap: "4px",
  },
  empty: {
    marginTop: "16px",
    color: azureShellColors.mutedText,
  },
  tags: {
    marginTop: "8px",
    color: azureShellColors.mutedText,
  },
});

type FormState = {
  title: string;
  bodyText: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  tags: string;
};

const emptyForm = (): FormState => ({
  title: "",
  bodyText: "",
  situation: "",
  task: "",
  action: "",
  result: "",
  tags: "",
});

function buildBodyText(form: FormState): string {
  const note = form.bodyText.trim();
  if (note) return note;

  const parts = [
    form.situation.trim() && `S: ${form.situation.trim()}`,
    form.task.trim() && `T: ${form.task.trim()}`,
    form.action.trim() && `A: ${form.action.trim()}`,
    form.result.trim() && `R: ${form.result.trim()}`,
  ].filter(Boolean);

  return parts.join("\n\n");
}

function parseTags(raw: string): string[] {
  return raw
    .split(/[,、]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function episodeToForm(episode: Episode): FormState {
  return {
    title: episode.title,
    bodyText: episode.bodyText,
    situation: episode.situation ?? "",
    task: episode.task ?? "",
    action: episode.action ?? "",
    result: episode.result ?? "",
    tags: (episode.tags ?? []).join(", "),
  };
}

export function JournalPage() {
  const styles = useStyles();
  const { t } = useTranslation();
  const locale = useAppLocale();
  const location = useLocation();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handoff = (location.state as { graphImport?: GraphImportHandoff } | null)
      ?.graphImport;
    if (!handoff) return;
    const draft = handoff.journalDraft;
    setEditingId(null);
    setForm({
      ...emptyForm(),
      title: draft?.title ?? "",
      situation: draft?.situation ?? "",
      bodyText: draft?.bodyText ?? handoff.plainText,
    });
  }, [location.state]);

  const starLabel = (letter: string) => {
    const field = STAR_FIELDS.find((row) => row.letter === letter);
    if (!field) return letter;
    return locale === "ja" ? field.labelJa : field.labelEn;
  };

  async function loadEpisodes() {
    setLoading(true);
    try {
      const data = await apiFetch<Episode[]>("/episodes");
      setEpisodes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.failedToLoad"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEpisodes();
  }, []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(emptyForm());
    setEditingId(null);
  }

  async function handleSubmit() {
    if (!form.title.trim()) return;
    const bodyText = buildBodyText(form);
    if (!bodyText) return;

    const payload = {
      title: form.title.trim(),
      bodyText,
      situation: form.situation.trim() || undefined,
      task: form.task.trim() || undefined,
      action: form.action.trim() || undefined,
      result: form.result.trim() || undefined,
      tags: parseTags(form.tags),
      locale,
    };

    setSaving(true);
    try {
      if (editingId) {
        await apiFetch<Episode>(`/episodes/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch<Episode>("/episodes", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      resetForm();
      await loadEpisodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.failedToLoad"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t("journal.confirmDelete"))) return;
    try {
      await apiFetch<void>(`/episodes/${id}`, { method: "DELETE" });
      if (editingId === id) resetForm();
      await loadEpisodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.failedToLoad"));
    }
  }

  function startEdit(episode: Episode) {
    setEditingId(episode.id);
    setForm(episodeToForm(episode));
  }

  const canSubmit = form.title.trim().length > 0 && buildBodyText(form).length > 0;

  return (
    <>
      <ContentPanel>
        <div className={styles.form}>
          <Field label={t("journal.titleLabel")}>
            <Input
              value={form.title}
              onChange={(_, data) => updateField("title", data.value)}
            />
          </Field>
          <Field label={starLabel("S")} hint={t("journal.situationHint")}>
            <Textarea
              value={form.situation}
              onChange={(_, data) => updateField("situation", data.value)}
              rows={2}
            />
          </Field>
          <Field label={starLabel("T")} hint={t("journal.taskHint")}>
            <Textarea
              value={form.task}
              onChange={(_, data) => updateField("task", data.value)}
              rows={2}
            />
          </Field>
          <Field label={starLabel("A")} hint={t("journal.actionHint")}>
            <Textarea
              value={form.action}
              onChange={(_, data) => updateField("action", data.value)}
              rows={2}
            />
          </Field>
          <Field label={starLabel("R")} hint={t("journal.resultHint")}>
            <Textarea
              value={form.result}
              onChange={(_, data) => updateField("result", data.value)}
              rows={2}
            />
          </Field>
          <Field label={t("journal.bodyLabel")} hint={t("journal.bodyHint")}>
            <Textarea
              value={form.bodyText}
              onChange={(_, data) => updateField("bodyText", data.value)}
              rows={3}
            />
          </Field>
          <Field label={t("journal.tagsLabel")} hint={t("journal.tagsHint")}>
            <Input
              value={form.tags}
              onChange={(_, data) => updateField("tags", data.value)}
            />
          </Field>
          <div className={styles.formActions}>
            <Button
              appearance="primary"
              disabled={!canSubmit || saving}
              onClick={() => void handleSubmit()}
            >
              {editingId ? t("journal.saveEntry") : t("journal.addEntry")}
            </Button>
            {editingId && (
              <Button appearance="secondary" onClick={resetForm}>
                {t("journal.cancelEdit")}
              </Button>
            )}
            <RouterLink to="/app/inbox">
              <Button appearance="secondary">{t("journal.importFromGraph")}</Button>
            </RouterLink>
          </div>
        </div>
      </ContentPanel>

      {loading && (
        <Body1 style={{ marginTop: 16 }}>{t("journal.loading")}</Body1>
      )}
      {error && <Body1 style={{ marginTop: 16 }}>{error}</Body1>}

      {!loading && !error && episodes.length === 0 && (
        <Body1 className={styles.empty}>{t("journal.empty")}</Body1>
      )}

      <div className={styles.list}>
        {episodes.map((episode) => (
          <Card key={episode.id} className={styles.card}>
            <CardHeader header={<Title3>{episode.title}</Title3>} />
            <Body1>{episode.bodyText}</Body1>
            {(episode.situation ||
              episode.task ||
              episode.action ||
              episode.result) && (
              <div className={styles.starBlock}>
                {episode.situation && (
                  <Body1>
                    <strong>{starLabel("S")}:</strong> {episode.situation}
                  </Body1>
                )}
                {episode.task && (
                  <Body1>
                    <strong>{starLabel("T")}:</strong> {episode.task}
                  </Body1>
                )}
                {episode.action && (
                  <Body1>
                    <strong>{starLabel("A")}:</strong> {episode.action}
                  </Body1>
                )}
                {episode.result && (
                  <Body1>
                    <strong>{starLabel("R")}:</strong> {episode.result}
                  </Body1>
                )}
              </div>
            )}
            {episode.tags.length > 0 && (
              <Body1 className={styles.tags}>
                {t("journal.tagsLabel")}: {episode.tags.join(", ")}
              </Body1>
            )}
            <div className={styles.cardActions}>
              <Button appearance="secondary" onClick={() => startEdit(episode)}>
                {t("journal.edit")}
              </Button>
              <Button
                appearance="secondary"
                onClick={() => void handleDelete(episode.id)}
              >
                {t("journal.delete")}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

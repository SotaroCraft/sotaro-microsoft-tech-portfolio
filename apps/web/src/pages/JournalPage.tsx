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
import type { Episode } from "@microbootcan/shared";
import { useEffect, useState } from "react";
import { ContentPanel } from "../components/shell/ContentPanel";
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
  card: {
    backgroundColor: azureShellColors.panel,
    border: `1px solid ${azureShellColors.panelBorder}`,
    borderRadius: "2px",
    boxShadow: "none",
  },
});

export function JournalPage() {
  const styles = useStyles();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [title, setTitle] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadEpisodes() {
    setLoading(true);
    try {
      const data = await apiFetch<Episode[]>("/episodes");
      setEpisodes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEpisodes();
  }, []);

  async function handleCreate() {
    if (!title.trim() || !bodyText.trim()) return;
    await apiFetch<Episode>("/episodes", {
      method: "POST",
      body: JSON.stringify({ title, bodyText, tags: [], locale: "ja" }),
    });
    setTitle("");
    setBodyText("");
    await loadEpisodes();
  }

  return (
    <>
      <ContentPanel>
        <div className={styles.form}>
          <Field label="Title">
            <Input value={title} onChange={(_, data) => setTitle(data.value)} />
          </Field>
          <Field label="Body">
            <Textarea
              value={bodyText}
              onChange={(_, data) => setBodyText(data.value)}
              rows={4}
            />
          </Field>
          <Button appearance="primary" onClick={() => void handleCreate()}>
            Add entry
          </Button>
        </div>
      </ContentPanel>

      {loading && <Body1 style={{ marginTop: 16 }}>Loading entries…</Body1>}
      {error && <Body1 style={{ marginTop: 16 }}>{error}</Body1>}

      <div className={styles.list}>
        {episodes.map((episode) => (
          <Card key={episode.id} className={styles.card}>
            <CardHeader header={<Title3>{episode.title}</Title3>} />
            <Body1>{episode.bodyText}</Body1>
          </Card>
        ))}
      </div>
    </>
  );
}

import {
  Body1,
  Button,
  Card,
  CardHeader,
  Field,
  Input,
  Textarea,
  Title2,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import type { Episode } from "@microbootcan/shared";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

const useStyles = makeStyles({
  list: {
    display: "grid",
    gap: "12px",
    marginTop: "16px",
  },
  form: {
    display: "grid",
    gap: "12px",
    marginTop: "16px",
    padding: "16px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
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
    <section>
      <Title2>Achievement journal</Title2>
      <Body1>Structured notes for milestones and deliverables (STAR fields optional).</Body1>

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

      {loading && <Body1>Loading entries…</Body1>}
      {error && <Body1>{error}</Body1>}

      <div className={styles.list}>
        {episodes.map((episode) => (
          <Card key={episode.id}>
            <CardHeader header={<Title2>{episode.title}</Title2>} />
            <Body1>{episode.bodyText}</Body1>
          </Card>
        ))}
      </div>
    </section>
  );
}

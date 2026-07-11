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
import type { MatchResponse } from "@microstar/shared";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { ContentPanel } from "../components/shell/ContentPanel";
import type { GraphImportHandoff } from "../lib/graph";
import { apiFetch } from "../lib/api";
import { azureShellColors } from "../theme/azureTheme";

const useStyles = makeStyles({
  form: {
    display: "grid",
    gap: "12px",
  },
  results: {
    display: "grid",
    gap: "12px",
    marginTop: "16px",
  },
  card: {
    backgroundColor: azureShellColors.panel,
    border: `1px solid ${azureShellColors.panelBorder}`,
    borderRadius: "2px",
    boxShadow: "none",
  },
  meta: {
    color: azureShellColors.mutedText,
    marginBottom: "8px",
  },
  draft: {
    marginTop: "16px",
    display: "grid",
    gap: "8px",
  },
  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "8px",
  },
});

export function MatchPage() {
  const styles = useStyles();
  const { t } = useTranslation();
  const location = useLocation();
  const [referenceText, setReferenceText] = useState("");
  const [topK, setTopK] = useState("3");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<MatchResponse | null>(null);

  useEffect(() => {
    const handoff = (location.state as { graphImport?: GraphImportHandoff } | null)
      ?.graphImport;
    if (handoff?.plainText) {
      setReferenceText(handoff.plainText);
    }
  }, [location.state]);

  async function handleMatch() {
    if (!referenceText.trim()) return;
    const parsedTopK = Number.parseInt(topK, 10);
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<MatchResponse>("/match", {
        method: "POST",
        body: JSON.stringify({
          referenceText: referenceText.trim(),
          topK: Number.isFinite(parsedTopK) ? parsedTopK : 3,
        }),
      });
      setResponse(data);
    } catch (err) {
      setResponse(null);
      setError(err instanceof Error ? err.message : t("common.failedToLoad"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ContentPanel>
        <div className={styles.form}>
          <Field label={t("match.referenceLabel")} hint={t("match.referenceHint")}>
            <Textarea
              value={referenceText}
              onChange={(_, data) => setReferenceText(data.value)}
              rows={6}
            />
          </Field>
          <RouterLink to="/app/inbox">
            <Button appearance="secondary">{t("match.importFromGraph")}</Button>
          </RouterLink>
          <Field label={t("match.topKLabel")}>
            <Input
              type="number"
              value={topK}
              onChange={(_, data) => setTopK(data.value)}
              min={1}
              max={10}
            />
          </Field>
          <Button
            appearance="primary"
            disabled={!referenceText.trim() || loading}
            onClick={() => void handleMatch()}
          >
            {loading ? t("match.running") : t("match.run")}
          </Button>
        </div>
      </ContentPanel>

      {error && <Body1 style={{ marginTop: 16 }}>{error}</Body1>}

      {response && (
        <>
          {response.draftSummary && (
            <ContentPanel>
              <div className={styles.draft}>
                <Title3>{t("match.draftSummary")}</Title3>
                <Body1>{response.draftSummary}</Body1>
                <Body1 className={styles.meta}>
                  {t("match.provider", { provider: response.provider })}
                </Body1>
                <div className={styles.actions}>
                  <RouterLink to="/app/pipeline">
                    <Button appearance="secondary">
                      {t("match.openPipeline")}
                    </Button>
                  </RouterLink>
                </div>
              </div>
            </ContentPanel>
          )}

          <div className={styles.results}>
            {response.results.length === 0 && (
              <Body1>{t("match.noResults")}</Body1>
            )}
            {response.results.map((result) => (
              <Card key={result.episodeId} className={styles.card}>
                <CardHeader header={<Title3>{result.title}</Title3>} />
                <Body1 className={styles.meta}>
                  {t("match.score", { score: result.score.toFixed(2) })}
                </Body1>
                <Body1>{result.excerpt}</Body1>
                <div className={styles.actions}>
                  <RouterLink to="/app/journal">
                    <Button appearance="secondary">
                      {t("match.openJournal")}
                    </Button>
                  </RouterLink>
                  <RouterLink to="/app/pipeline">
                    <Button appearance="secondary">
                      {t("match.setNextAction")}
                    </Button>
                  </RouterLink>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
}

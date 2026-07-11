import {
  Body1,
  Button,
  Field,
  Input,
  Textarea,
  Title2,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import type { CareerSummary } from "@microbootcan/shared";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

const useStyles = makeStyles({
  form: {
    display: "grid",
    gap: "12px",
    marginTop: "16px",
    padding: "16px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
  },
});

export function SummaryPage() {
  const styles = useStyles();
  const [summaryJa, setSummaryJa] = useState("");
  const [summaryEn, setSummaryEn] = useState("");
  const [metricsText, setMetricsText] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<CareerSummary | null>("/summary")
      .then((data) => {
        if (data) {
          setSummaryJa(data.summaryJa);
          setSummaryEn(data.summaryEn);
          setMetricsText(
            data.metrics
              .map((metric) => `${metric.label}=${metric.value}`)
              .join("\n"),
          );
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    const metrics = metricsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, value] = line.split("=");
        return {
          category: "other" as const,
          label: label?.trim() ?? line,
          value: value?.trim() ?? "",
        };
      });

    await apiFetch<CareerSummary>("/summary", {
      method: "PUT",
      body: JSON.stringify({ summaryJa, summaryEn, metrics }),
    });
    setMessage("Saved metrics & summary.");
  }

  return (
    <section>
      <Title2>Metrics & summary</Title2>
      <Body1>Bilingual summary lines and KPI metrics for your workspace.</Body1>
      {loading && <Body1>Loading…</Body1>}

      <div className={styles.form}>
        <Field label="Summary (JA)">
          <Textarea
            value={summaryJa}
            onChange={(_, data) => setSummaryJa(data.value)}
            rows={4}
          />
        </Field>
        <Field label="Summary (EN)">
          <Textarea
            value={summaryEn}
            onChange={(_, data) => setSummaryEn(data.value)}
            rows={4}
          />
        </Field>
        <Field label="Metrics (label=value per line)">
          <Input
            value={metricsText}
            onChange={(_, data) => setMetricsText(data.value)}
          />
        </Field>
        <Button appearance="primary" onClick={() => void handleSave()}>
          Save summary
        </Button>
        {message && <Body1>{message}</Body1>}
      </div>
    </section>
  );
}

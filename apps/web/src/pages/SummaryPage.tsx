import {
  Body1,
  Button,
  Field,
  Input,
  Textarea,
  makeStyles,
} from "@fluentui/react-components";
import type { CareerSummary } from "@microstar/shared";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ContentPanel } from "../components/shell/ContentPanel";
import { apiFetch } from "../lib/api";

const useStyles = makeStyles({
  form: {
    display: "grid",
    gap: "12px",
  },
});

export function SummaryPage() {
  const styles = useStyles();
  const { t } = useTranslation();
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
    setMessage(t("summary.saved"));
  }

  return (
    <>
      {loading && <Body1>{t("summary.loading")}</Body1>}

      <ContentPanel>
        <div className={styles.form}>
          <Field label={t("summary.summaryJa")}>
            <Textarea
              value={summaryJa}
              onChange={(_, data) => setSummaryJa(data.value)}
              rows={4}
            />
          </Field>
          <Field label={t("summary.summaryEn")}>
            <Textarea
              value={summaryEn}
              onChange={(_, data) => setSummaryEn(data.value)}
              rows={4}
            />
          </Field>
          <Field label={t("summary.metrics")}>
            <Input
              value={metricsText}
              onChange={(_, data) => setMetricsText(data.value)}
            />
          </Field>
          <Button appearance="primary" onClick={() => void handleSave()}>
            {t("summary.save")}
          </Button>
          {message && <Body1>{message}</Body1>}
        </div>
      </ContentPanel>
    </>
  );
}

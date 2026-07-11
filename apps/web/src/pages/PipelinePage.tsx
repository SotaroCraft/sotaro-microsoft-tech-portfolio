import {
  Body1,
  Button,
  Card,
  CardHeader,
  Dropdown,
  Field,
  Input,
  Option,
  Title3,
  makeStyles,
} from "@fluentui/react-components";
import type { Application, Company } from "@microbootcan/shared";
import { PIPELINE_STAGES } from "@microbootcan/shared";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ContentPanel } from "../components/shell/ContentPanel";
import { useAppLocale } from "../hooks/useAppLocale";
import { apiFetch } from "../lib/api";
import { azureShellColors } from "../theme/azureTheme";

const useStyles = makeStyles({
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginTop: "16px",
  },
  column: {
    backgroundColor: azureShellColors.panel,
    border: `1px solid ${azureShellColors.panelBorder}`,
    borderRadius: "2px",
    padding: "12px",
    minHeight: "240px",
  },
  columnHeader: {
    paddingBottom: "8px",
    borderBottom: `1px solid ${azureShellColors.panelBorder}`,
    marginBottom: "8px",
  },
  card: {
    marginTop: "8px",
    backgroundColor: "#faf9f8",
    border: `1px solid ${azureShellColors.panelBorder}`,
    borderRadius: "2px",
    boxShadow: "none",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
});

export function PipelinePage() {
  const styles = useStyles();
  const { t } = useTranslation();
  const locale = useAppLocale();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const stageLabel = (stageId: string) => {
    const stage = PIPELINE_STAGES.find((row) => row.id === stageId);
    if (!stage) return stageId;
    return locale === "ja" ? stage.labelJa : stage.labelEn;
  };

  async function reload() {
    try {
      const [companyRows, applicationRows] = await Promise.all([
        apiFetch<Company[]>("/companies"),
        apiFetch<Application[]>("/applications"),
      ]);
      setCompanies(companyRows);
      setApplications(applicationRows);
      if (!selectedCompanyId && companyRows[0]) {
        setSelectedCompanyId(companyRows[0].id);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.failedToLoad"));
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  const companyById = useMemo(
    () => new Map(companies.map((company) => [company.id, company])),
    [companies],
  );

  async function addCompany() {
    if (!companyName.trim()) return;
    await apiFetch<Company>("/companies", {
      method: "POST",
      body: JSON.stringify({
        name: companyName,
        priority: 2,
        isPrimaryTarget: false,
      }),
    });
    setCompanyName("");
    await reload();
  }

  async function addApplication() {
    if (!selectedCompanyId || !roleTitle.trim()) return;
    await apiFetch<Application>("/applications", {
      method: "POST",
      body: JSON.stringify({
        companyId: selectedCompanyId,
        roleTitle,
        stage: PIPELINE_STAGES[0]?.id ?? "watchlist",
      }),
    });
    setRoleTitle("");
    await reload();
  }

  async function moveStage(applicationId: string, stage: string) {
    await apiFetch<Application>(`/applications/${applicationId}`, {
      method: "PATCH",
      body: JSON.stringify({ stage }),
    });
    await reload();
  }

  return (
    <>
      {error && <Body1>{error}</Body1>}

      <ContentPanel>
        <div className={styles.form}>
          <Field label={t("pipeline.newOrganization")}>
            <Input
              value={companyName}
              onChange={(_, data) => setCompanyName(data.value)}
            />
          </Field>
          <Button onClick={() => void addCompany()}>
            {t("pipeline.addOrganization")}
          </Button>

          <Field label={t("pipeline.organization")}>
            <Dropdown
              value={
                companyById.get(selectedCompanyId)?.name ??
                t("pipeline.selectOrganization")
              }
              onOptionSelect={(_, data) =>
                setSelectedCompanyId(String(data.optionValue ?? ""))
              }
            >
              {companies.map((company) => (
                <Option key={company.id} value={company.id} text={company.name}>
                  {company.name}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Field label={t("pipeline.opportunityTitle")}>
            <Input
              value={roleTitle}
              onChange={(_, data) => setRoleTitle(data.value)}
            />
          </Field>
          <Button appearance="primary" onClick={() => void addApplication()}>
            {t("pipeline.addOpportunity")}
          </Button>
        </div>
      </ContentPanel>

      <div className={styles.board}>
        {PIPELINE_STAGES.map((stage) => {
          const cards = applications.filter((row) => row.stage === stage.id);
          return (
            <div key={stage.id} className={styles.column}>
              <div className={styles.columnHeader}>
                <Title3>{stageLabel(stage.id)}</Title3>
                <Body1>{t("pipeline.items", { count: cards.length })}</Body1>
              </div>
              {cards.map((application) => (
                <Card key={application.id} className={styles.card}>
                  <CardHeader
                    header={<Title3>{application.roleTitle}</Title3>}
                    description={
                      companyById.get(application.companyId)?.name ??
                      t("pipeline.unknownOrg")
                    }
                  />
                  <Dropdown
                    placeholder={t("pipeline.moveStage")}
                    onOptionSelect={(_, data) =>
                      void moveStage(application.id, String(data.optionValue))
                    }
                  >
                    {PIPELINE_STAGES.map((option) => (
                      <Option
                        key={option.id}
                        value={option.id}
                        text={stageLabel(option.id)}
                      >
                        {stageLabel(option.id)}
                      </Option>
                    ))}
                  </Dropdown>
                </Card>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}

import {
  Body1,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Dropdown,
  Field,
  Input,
  Option,
  Title3,
  makeStyles,
} from "@fluentui/react-components";
import type { Application, Company } from "@microstar/shared";
import { PIPELINE_STAGES } from "@microstar/shared";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ContentPanel } from "../components/shell/ContentPanel";
import { useAppLocale } from "../hooks/useAppLocale";
import { apiFetch } from "../lib/api";
import { azureShellColors } from "../theme/azureTheme";

const useStyles = makeStyles({
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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
    backgroundColor: azureShellColors.sidebar,
    border: `1px solid ${azureShellColors.panelBorder}`,
    borderRadius: "2px",
    boxShadow: "none",
    paddingBottom: "8px",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  cardBody: {
    display: "grid",
    gap: "8px",
    padding: "0 12px 4px",
  },
  nextAction: {
    color: azureShellColors.mutedText,
  },
  primaryBadge: {
    color: azureShellColors.accentText,
    marginBottom: "4px",
  },
});

export function PipelinePage() {
  const styles = useStyles();
  const { t } = useTranslation();
  const locale = useAppLocale();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [isPrimaryTarget, setIsPrimaryTarget] = useState(false);
  const [roleTitle, setRoleTitle] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nextAction, setNextAction] = useState("");
  const [nextActionDate, setNextActionDate] = useState("");
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
        priority: isPrimaryTarget ? 1 : 2,
        isPrimaryTarget,
      }),
    });
    setCompanyName("");
    setIsPrimaryTarget(false);
    await reload();
  }

  async function togglePrimary(company: Company) {
    await apiFetch<Company>(`/companies/${company.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isPrimaryTarget: !company.isPrimaryTarget }),
    });
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

  function startEditNextAction(application: Application) {
    setEditingId(application.id);
    setNextAction(application.nextAction ?? "");
    setNextActionDate(application.nextActionDate?.slice(0, 10) ?? "");
  }

  async function saveNextAction(applicationId: string) {
    await apiFetch<Application>(`/applications/${applicationId}`, {
      method: "PATCH",
      body: JSON.stringify({
        nextAction: nextAction.trim() || "",
        nextActionDate: nextActionDate
          ? new Date(`${nextActionDate}T00:00:00`).toISOString()
          : "",
      }),
    });
    setEditingId(null);
    setNextAction("");
    setNextActionDate("");
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
          <Checkbox
            checked={isPrimaryTarget}
            onChange={(_, data) => setIsPrimaryTarget(Boolean(data.checked))}
            label={t("pipeline.primaryTarget")}
          />
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
                  {company.isPrimaryTarget
                    ? `${company.name} ★`
                    : company.name}
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
              {cards.map((application) => {
                const company = companyById.get(application.companyId);
                const isEditing = editingId === application.id;
                return (
                  <Card key={application.id} className={styles.card}>
                    <CardHeader
                      header={<Title3>{application.roleTitle}</Title3>}
                      description={
                        company?.name ?? t("pipeline.unknownOrg")
                      }
                    />
                    <div className={styles.cardBody}>
                      {company?.isPrimaryTarget && (
                        <Body1 className={styles.primaryBadge}>
                          {t("pipeline.primaryBadge")}
                        </Body1>
                      )}
                      {company && (
                        <Checkbox
                          checked={company.isPrimaryTarget}
                          label={t("pipeline.primaryTarget")}
                          onChange={() => void togglePrimary(company)}
                        />
                      )}
                      <Dropdown
                        placeholder={t("pipeline.moveStage")}
                        onOptionSelect={(_, data) =>
                          void moveStage(
                            application.id,
                            String(data.optionValue),
                          )
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

                      {!isEditing && (
                        <>
                          <Body1 className={styles.nextAction}>
                            {application.nextAction
                              ? t("pipeline.nextActionValue", {
                                  action: application.nextAction,
                                })
                              : t("pipeline.nextActionEmpty")}
                          </Body1>
                          {application.nextActionDate && (
                            <Body1 className={styles.nextAction}>
                              {t("pipeline.nextActionDateValue", {
                                date: application.nextActionDate.slice(0, 10),
                              })}
                            </Body1>
                          )}
                          <Button
                            appearance="secondary"
                            onClick={() => startEditNextAction(application)}
                          >
                            {t("pipeline.editNextAction")}
                          </Button>
                        </>
                      )}

                      {isEditing && (
                        <>
                          <Field label={t("pipeline.nextAction")}>
                            <Input
                              value={nextAction}
                              onChange={(_, data) =>
                                setNextAction(data.value)
                              }
                            />
                          </Field>
                          <Field label={t("pipeline.nextActionDate")}>
                            <Input
                              type="date"
                              value={nextActionDate}
                              onChange={(_, data) =>
                                setNextActionDate(data.value)
                              }
                            />
                          </Field>
                          <Button
                            appearance="primary"
                            onClick={() =>
                              void saveNextAction(application.id)
                            }
                          >
                            {t("pipeline.saveNextAction")}
                          </Button>
                          <Button
                            appearance="secondary"
                            onClick={() => setEditingId(null)}
                          >
                            {t("pipeline.cancelEdit")}
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

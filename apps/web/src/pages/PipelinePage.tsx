import {
  Body1,
  Button,
  Card,
  CardHeader,
  Dropdown,
  Field,
  Input,
  Option,
  Title2,
  Title3,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import type { Application, Company } from "@microbootcan/shared";
import { PIPELINE_STAGES } from "@microbootcan/shared";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

const useStyles = makeStyles({
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginTop: "16px",
  },
  column: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    padding: "12px",
    minHeight: "240px",
  },
  card: {
    marginTop: "8px",
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

export function PipelinePage() {
  const styles = useStyles();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [error, setError] = useState<string | null>(null);

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
      setError(err instanceof Error ? err.message : "Failed to load pipeline");
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
    <section>
      <Title2>Pipeline tracker</Title2>
      <Body1>Kanban scaffold for opportunities across pipeline stages.</Body1>
      {error && <Body1>{error}</Body1>}

      <div className={styles.form}>
        <Field label="New organization">
          <Input
            value={companyName}
            onChange={(_, data) => setCompanyName(data.value)}
          />
        </Field>
        <Button onClick={() => void addCompany()}>Add organization</Button>

        <Field label="Organization">
          <Dropdown
            value={
              companyById.get(selectedCompanyId)?.name ?? "Select organization"
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
        <Field label="Opportunity title">
          <Input value={roleTitle} onChange={(_, data) => setRoleTitle(data.value)} />
        </Field>
        <Button appearance="primary" onClick={() => void addApplication()}>
          Add opportunity
        </Button>
      </div>

      <div className={styles.board}>
        {PIPELINE_STAGES.map((stage) => {
          const cards = applications.filter((row) => row.stage === stage.id);
          return (
            <div key={stage.id} className={styles.column}>
              <Title3>{stage.labelEn}</Title3>
              <Body1>{cards.length} items</Body1>
              {cards.map((application) => (
                <Card key={application.id} className={styles.card}>
                  <CardHeader
                    header={
                      <Title3>
                        {application.roleTitle}
                      </Title3>
                    }
                    description={
                      companyById.get(application.companyId)?.name ?? "Unknown"
                    }
                  />
                  <Dropdown
                    placeholder="Move stage"
                    onOptionSelect={(_, data) =>
                      void moveStage(application.id, String(data.optionValue))
                    }
                  >
                    {PIPELINE_STAGES.map((option) => (
                      <Option key={option.id} value={option.id} text={option.labelEn}>
                        {option.labelEn}
                      </Option>
                    ))}
                  </Dropdown>
                </Card>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

import {
  Body1,
  Button,
  Card,
  CardHeader,
  Link,
  Title2,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { OpenRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { ArchitectureDiagram } from "../components/ArchitectureDiagram";
import { ContentPanel } from "../components/shell/ContentPanel";
import { azureShellColors } from "../theme/azureTheme";

const useStyles = makeStyles({
  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  architecturePanel: {
    gridColumn: "1 / -1",
    padding: 0,
    overflow: "hidden",
  },
  architectureInner: {
    padding: "16px 20px",
  },
  card: {
    backgroundColor: azureShellColors.panel,
    border: `1px solid ${azureShellColors.panelBorder}`,
    borderRadius: "2px",
    boxShadow: "none",
  },
  footerLink: {
    marginTop: "24px",
    textAlign: "center",
  },
  meta: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

const STACK = [
  "Azure Static Web Apps",
  "Azure Functions",
  "Cosmos DB",
  "Entra ID",
  "Azure OpenAI",
  "Bicep",
  "Fluent UI React",
];

export function LandingPage() {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.actions}>
        <RouterLink to="/app">
          <Button appearance="primary" icon={<OpenRegular />}>
            {t("landing.openWorkspace")}
          </Button>
        </RouterLink>
        <RouterLink to="/charter">
          <Button appearance="secondary">{t("landing.viewCharter")}</Button>
        </RouterLink>
      </div>

      <div className={styles.grid}>
        <ContentPanel className={styles.architecturePanel}>
          <div className={styles.architectureInner}>
            <Title2>{t("landing.architecture")}</Title2>
            <Body1 className={styles.meta}>{t("landing.architectureHint")}</Body1>
          </div>
          <ArchitectureDiagram />
        </ContentPanel>

        <Card className={styles.card}>
          <CardHeader header={<Title2>{t("landing.stack")}</Title2>} />
          <Body1>{STACK.join(" · ")}</Body1>
        </Card>

        <Card className={styles.card}>
          <CardHeader header={<Title2>{t("landing.privacy")}</Title2>} />
          <Body1>{t("landing.privacyBody")}</Body1>
        </Card>
      </div>

      <div className={styles.footerLink}>
        <Link
          href="https://github.com/SotaroCraft/sotaro-microsoft-tech-portfolio"
          target="_blank"
          rel="noreferrer"
        >
          {t("landing.viewSource")}
        </Link>
      </div>
    </>
  );
}

import {
  Body1,
  Button,
  Card,
  CardHeader,
  FluentProvider,
  Link,
  Title1,
  Title2,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { Link as RouterLink } from "react-router-dom";
import { ArchitectureDiagram } from "../components/ArchitectureDiagram";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    backgroundColor: tokens.colorNeutralBackground2,
    padding: "32px 24px",
  },
  hero: {
    maxWidth: "960px",
    margin: "0 auto 32px",
    padding: "32px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    borderLeft: `4px solid ${tokens.colorBrandBackground}`,
  },
  grid: {
    maxWidth: "960px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },
  architectureCard: {
    gridColumn: "1 / -1",
  },
  footer: {
    maxWidth: "960px",
    margin: "32px auto 0",
    textAlign: "center",
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

  return (
    <FluentProvider>
      <div className={styles.root}>
        <section className={styles.hero}>
          <Title1>MicroBootCan</Title1>
          <Body1>
            Azure-native personal productivity PWA — milestone tracking,
            structured achievement journal, and opportunity pipeline management.
          </Body1>
          <div style={{ marginTop: "16px" }}>
            <RouterLink to="/app">
              <Button appearance="primary">Open workspace</Button>
            </RouterLink>
          </div>
        </section>

        <div className={styles.grid}>
          <Card className={styles.architectureCard}>
            <CardHeader header={<Title2>Architecture</Title2>} />
            <ArchitectureDiagram />
          </Card>

          <Card>
            <CardHeader header={<Title2>Stack</Title2>} />
            <Body1>{STACK.join(" · ")}</Body1>
          </Card>

          <Card>
            <CardHeader header={<Title2>Privacy</Title2>} />
            <Body1>
              Public landing shows architecture only. Personal data lives in an
              Entra ID–protected workspace.
            </Body1>
          </Card>
        </div>

        <div className={styles.footer}>
          <Link
            href="https://github.com/SotaroCraft/sotaro-microsoft-tech-portfolio"
            target="_blank"
            rel="noreferrer"
          >
            View source on GitHub
          </Link>
        </div>
      </div>
    </FluentProvider>
  );
}

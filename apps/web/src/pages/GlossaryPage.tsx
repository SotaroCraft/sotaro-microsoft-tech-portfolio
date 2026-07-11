import {
  Body1,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Title2,
  Title3,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  GLOSSARY_TERMS,
  PRODUCT_LAYERS,
  STAR_FIELDS,
} from "@microbootcan/shared";
import { Link as RouterLink } from "react-router-dom";
import { ContentPanel } from "../components/shell/ContentPanel";
import { azureShellColors } from "../theme/azureTheme";

const useStyles = makeStyles({
  stack: {
    display: "grid",
    gap: "16px",
  },
  layerList: {
    display: "grid",
    gap: "12px",
    marginTop: "12px",
  },
  layerItem: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "12px",
    alignItems: "start",
  },
  layerOrder: {
    minWidth: "28px",
    height: "28px",
    borderRadius: "2px",
    backgroundColor: azureShellColors.accentLight,
    color: azureShellColors.accentText,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: tokens.fontWeightSemibold,
    fontSize: "13px",
  },
  termGrid: {
    display: "grid",
    gap: "12px",
  },
  termMeta: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    marginTop: "8px",
  },
  card: {
    backgroundColor: azureShellColors.panel,
    border: `1px solid ${azureShellColors.panelBorder}`,
    borderRadius: "2px",
    boxShadow: "none",
  },
});

export function GlossaryPage() {
  const styles = useStyles();

  return (
    <div className={styles.stack}>
      <ContentPanel>
        <Body1>
          Neutral labels used on the public site and in the private workspace.
          STAR is a framework; the web app is the first step to persist and reuse
          structured records.
        </Body1>
      </ContentPanel>

      <Card className={styles.card}>
        <CardHeader
          header={<Title2>How the product layers fit</Title2>}
          description="Framework → Web app → Modules"
        />
        <div className={styles.layerList}>
          {PRODUCT_LAYERS.map((layer) => (
            <div key={layer.order} className={styles.layerItem}>
              <span className={styles.layerOrder}>{layer.order}</span>
              <div>
                <Title3>
                  {layer.labelEn} / {layer.labelJa}
                </Title3>
                <Body1>{layer.descriptionEn}</Body1>
                <Body1 className={styles.termMeta}>{layer.descriptionJa}</Body1>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className={styles.card}>
        <CardHeader
          header={<Title2>STAR fields</Title2>}
          description="Achievement journal — optional per entry"
        />
        <Table aria-label="STAR field definitions">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Field</TableHeaderCell>
              <TableHeaderCell>English</TableHeaderCell>
              <TableHeaderCell>日本語</TableHeaderCell>
              <TableHeaderCell>Prompt</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {STAR_FIELDS.map((field) => (
              <TableRow key={field.letter}>
                <TableCell>
                  <strong>{field.letter}</strong>
                </TableCell>
                <TableCell>{field.labelEn}</TableCell>
                <TableCell>{field.labelJa}</TableCell>
                <TableCell>
                  {field.promptEn}
                  <br />
                  <span className={styles.termMeta}>{field.promptJa}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <section className={styles.termGrid}>
        <Title2>App terms</Title2>
        {GLOSSARY_TERMS.map((term) => (
          <Card key={term.id} className={styles.card} id={term.id}>
            <CardHeader
              header={
                <Title3>
                  {term.labelEn} / {term.labelJa}
                </Title3>
              }
            />
            <Body1>{term.summaryEn}</Body1>
            <Body1 className={styles.termMeta}>{term.summaryJa}</Body1>
            <Body1 className={styles.termMeta}>
              {term.moduleEn} · {term.moduleJa}
              {term.appRoute && (
                <>
                  {" · "}
                  <RouterLink to={term.appRoute}>Open in workspace</RouterLink>
                </>
              )}
            </Body1>
          </Card>
        ))}
      </section>
    </div>
  );
}

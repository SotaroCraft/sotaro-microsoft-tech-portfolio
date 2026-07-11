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
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { ContentPanel } from "../components/shell/ContentPanel";
import { useAppLocale } from "../hooks/useAppLocale";
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
  starTable: {
    marginTop: "8px",
  },
});

export function GlossaryPage() {
  const styles = useStyles();
  const { t } = useTranslation();
  const locale = useAppLocale();
  const isJa = locale === "ja";

  return (
    <div className={styles.stack}>
      <ContentPanel>
        <Body1>{t("glossary.intro")}</Body1>
      </ContentPanel>

      <Card className={styles.card}>
        <CardHeader
          header={<Title2>{t("glossary.layersTitle")}</Title2>}
          description={t("glossary.layersDesc")}
        />
        <div className={styles.layerList}>
          {PRODUCT_LAYERS.map((layer) => (
            <div key={layer.order} className={styles.layerItem}>
              <span className={styles.layerOrder}>{layer.order}</span>
              <div>
                <Title3>
                  {isJa ? layer.labelJa : layer.labelEn}
                  {!isJa && ` / ${layer.labelJa}`}
                  {isJa && ` / ${layer.labelEn}`}
                </Title3>
                <Body1>
                  {isJa ? layer.descriptionJa : layer.descriptionEn}
                </Body1>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className={styles.card}>
        <CardHeader
          header={<Title2>{t("glossary.starTitle")}</Title2>}
          description={t("glossary.starDesc")}
        />
        <Table className={styles.starTable} aria-label={t("glossary.starTitle")}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>{t("glossary.starColField")}</TableHeaderCell>
              <TableHeaderCell>{t("glossary.starColEn")}</TableHeaderCell>
              <TableHeaderCell>{t("glossary.starColJa")}</TableHeaderCell>
              <TableHeaderCell>{t("glossary.starColPrompt")}</TableHeaderCell>
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
                  {isJa ? field.promptJa : field.promptEn}
                  {!isJa && (
                    <>
                      <br />
                      <span className={styles.termMeta}>{field.promptJa}</span>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <section className={styles.termGrid}>
        <Title2>{t("glossary.termsTitle")}</Title2>
        {GLOSSARY_TERMS.map((term) => (
          <Card key={term.id} className={styles.card} id={term.id}>
            <CardHeader
              header={
                <Title3>
                  {isJa ? term.labelJa : term.labelEn}
                  {" / "}
                  {isJa ? term.labelEn : term.labelJa}
                </Title3>
              }
            />
            <Body1>{isJa ? term.summaryJa : term.summaryEn}</Body1>
            <Body1 className={styles.termMeta}>
              {isJa ? term.moduleJa : term.moduleEn}
              {term.appRoute && (
                <>
                  {" · "}
                  <RouterLink to={term.appRoute}>
                    {t("glossary.openInWorkspace")}
                  </RouterLink>
                </>
              )}
            </Body1>
          </Card>
        ))}
      </section>
    </div>
  );
}

import {
  Body1,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Title3,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { QuestionCircleRegular } from "@fluentui/react-icons";
import {
  GLOSSARY_TERMS,
  PRODUCT_LAYERS,
  STAR_FIELDS,
} from "@microstar/shared";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { useAppLocale } from "../hooks/useAppLocale";
import { azureShellColors } from "../theme/azureTheme";

const useStyles = makeStyles({
  trigger: {
    color: "#ffffff",
    ":hover": {
      backgroundColor: azureShellColors.topBarHover,
      color: "#ffffff",
    },
  },
  surface: {
    maxWidth: "720px",
    width: "min(720px, 94vw)",
    maxHeight: "85vh",
  },
  content: {
    display: "grid",
    gap: "16px",
    overflowY: "auto",
    maxHeight: "min(70vh, 640px)",
    paddingBottom: "8px",
  },
  layerList: {
    display: "grid",
    gap: "10px",
    marginTop: "8px",
  },
  layerItem: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "10px",
    alignItems: "start",
  },
  layerOrder: {
    minWidth: "24px",
    height: "24px",
    borderRadius: "2px",
    backgroundColor: azureShellColors.accentLight,
    color: azureShellColors.accentText,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: tokens.fontWeightSemibold,
    fontSize: "12px",
  },
  card: {
    backgroundColor: azureShellColors.panel,
    border: `1px solid ${azureShellColors.panelBorder}`,
    borderRadius: "2px",
    boxShadow: "none",
  },
  termMeta: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    marginTop: "6px",
  },
  termGrid: {
    display: "grid",
    gap: "10px",
  },
});

type GlossaryHelpDialogProps = {
  triggerClassName?: string;
};

export function GlossaryHelpDialog({
  triggerClassName,
}: GlossaryHelpDialogProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const locale = useAppLocale();
  const isJa = locale === "ja";

  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button
          appearance="subtle"
          className={triggerClassName ?? styles.trigger}
          icon={<QuestionCircleRegular />}
          aria-label={t("shell.helpAria")}
          title={t("shell.help")}
        />
      </DialogTrigger>
      <DialogSurface className={styles.surface}>
        <DialogBody>
          <DialogTitle>{t("shell.helpTitle")}</DialogTitle>
          <DialogContent className={styles.content}>
            <Body1>{t("glossary.intro")}</Body1>

            <Card className={styles.card}>
              <CardHeader
                header={<Title3>{t("glossary.layersTitle")}</Title3>}
                description={t("glossary.layersDesc")}
              />
              <div className={styles.layerList}>
                {PRODUCT_LAYERS.map((layer) => (
                  <div key={layer.order} className={styles.layerItem}>
                    <span className={styles.layerOrder}>{layer.order}</span>
                    <div>
                      <Body1>
                        <strong>
                          {isJa ? layer.labelJa : layer.labelEn}
                          {" / "}
                          {isJa ? layer.labelEn : layer.labelJa}
                        </strong>
                      </Body1>
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
                header={<Title3>{t("glossary.starTitle")}</Title3>}
                description={t("glossary.starDesc")}
              />
              <Table aria-label={t("glossary.starTitle")}>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>
                      {t("glossary.starColField")}
                    </TableHeaderCell>
                    <TableHeaderCell>{t("glossary.starColEn")}</TableHeaderCell>
                    <TableHeaderCell>{t("glossary.starColJa")}</TableHeaderCell>
                    <TableHeaderCell>
                      {t("glossary.starColPrompt")}
                    </TableHeaderCell>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <div className={styles.termGrid}>
              <Title3>{t("glossary.termsTitle")}</Title3>
              {GLOSSARY_TERMS.map((term) => (
                <Card key={term.id} className={styles.card}>
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
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary">{t("common.close")}</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { QuestionCircleRegular } from "@fluentui/react-icons";
import { GLOSSARY_TERMS, STAR_FIELDS } from "@microstar/shared";
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
    maxWidth: "480px",
    width: "min(480px, 94vw)",
    maxHeight: "80vh",
  },
  content: {
    display: "grid",
    gap: "14px",
    overflowY: "auto",
    maxHeight: "min(60vh, 520px)",
    paddingBottom: "4px",
  },
  intro: {
    fontSize: "13px",
    color: tokens.colorNeutralForeground3,
    lineHeight: "1.45",
    margin: 0,
  },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: azureShellColors.mutedText,
    margin: "0 0 6px",
  },
  dl: {
    margin: 0,
    display: "grid",
    gap: "8px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "72px 1fr",
    gap: "8px 10px",
    alignItems: "start",
    paddingBottom: "8px",
    borderBottom: `1px solid ${azureShellColors.panelBorder}`,
  },
  termRow: {
    display: "grid",
    gap: "2px",
    paddingBottom: "8px",
    borderBottom: `1px solid ${azureShellColors.panelBorder}`,
  },
  dt: {
    margin: 0,
    fontSize: "13px",
    fontWeight: 600,
    color: azureShellColors.bodyText,
  },
  dd: {
    margin: 0,
    fontSize: "13px",
    lineHeight: "1.45",
    color: azureShellColors.bodyText,
  },
  meta: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground3,
  },
  link: {
    fontSize: "12px",
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
            <p className={styles.intro}>{t("glossary.intro")}</p>

            <section>
              <div className={styles.sectionTitle}>{t("glossary.starTitle")}</div>
              <dl className={styles.dl}>
                {STAR_FIELDS.map((field) => (
                  <div key={field.letter} className={styles.row}>
                    <dt className={styles.dt}>
                      {field.letter} · {isJa ? field.labelJa : field.labelEn}
                    </dt>
                    <dd className={styles.dd}>
                      {isJa ? field.promptJa : field.promptEn}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <div className={styles.sectionTitle}>
                {t("glossary.termsTitle")}
              </div>
              <dl className={styles.dl}>
                {GLOSSARY_TERMS.map((term) => (
                  <div key={term.id} className={styles.termRow}>
                    <dt className={styles.dt}>
                      {isJa ? term.labelJa : term.labelEn}
                      <span className={styles.meta}>
                        {" · "}
                        {isJa ? term.labelEn : term.labelJa}
                      </span>
                    </dt>
                    <dd className={styles.dd}>
                      {isJa ? term.summaryJa : term.summaryEn}
                      {term.appRoute ? (
                        <>
                          {" "}
                          <RouterLink
                            className={styles.link}
                            to={term.appRoute}
                          >
                            {t("glossary.openInWorkspace")}
                          </RouterLink>
                        </>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary" size="small">
                {t("common.close")}
              </Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

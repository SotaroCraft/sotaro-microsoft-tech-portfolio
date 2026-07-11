import { Body1, Title2, Title3, makeStyles } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { ContentPanel } from "../components/shell/ContentPanel";
import { azureShellColors } from "../theme/azureTheme";

const useStyles = makeStyles({
  stack: {
    display: "grid",
    gap: "20px",
    maxWidth: "720px",
  },
  section: {
    display: "grid",
    gap: "10px",
  },
  list: {
    display: "grid",
    gap: "12px",
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  listItem: {
    display: "grid",
    gap: "4px",
    padding: "12px 14px",
    backgroundColor: azureShellColors.panel,
    border: `1px solid ${azureShellColors.panelBorder}`,
    borderRadius: "2px",
  },
  itemTitle: {
    fontWeight: 600,
    fontSize: "14px",
    color: azureShellColors.bodyText,
  },
  itemBody: {
    fontSize: "14px",
    color: azureShellColors.bodyText,
    lineHeight: "1.5",
  },
});

const CAPABILITY_KEYS = [
  "launch",
  "plan",
  "consult",
  "single",
  "multi",
  "commit",
] as const;

export function CharterPage() {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <div className={styles.stack}>
      <ContentPanel>
        <div className={styles.section}>
          <Title2>{t("charter.purposeTitle")}</Title2>
          <Body1>{t("charter.purposeBody")}</Body1>
        </div>
      </ContentPanel>

      <ContentPanel>
        <div className={styles.section}>
          <Title2>{t("charter.capabilitiesTitle")}</Title2>
          <Body1>{t("charter.capabilitiesLead")}</Body1>
          <ul className={styles.list}>
            {CAPABILITY_KEYS.map((key) => (
              <li key={key} className={styles.listItem}>
                <Title3 className={styles.itemTitle}>
                  {t(`charter.capabilities.${key}.title`)}
                </Title3>
                <Body1 className={styles.itemBody}>
                  {t(`charter.capabilities.${key}.body`)}
                </Body1>
              </li>
            ))}
          </ul>
        </div>
      </ContentPanel>

      <ContentPanel>
        <div className={styles.section}>
          <Title2>{t("charter.outcomeTitle")}</Title2>
          <Body1>{t("charter.outcomeBody")}</Body1>
        </div>
      </ContentPanel>
    </div>
  );
}

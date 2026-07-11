import {
  Body1,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Title2,
  Title3,
  makeStyles,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { ContentPanel } from "../components/shell/ContentPanel";
import { azureShellColors } from "../theme/azureTheme";

const useStyles = makeStyles({
  stack: {
    display: "grid",
    gap: "20px",
    maxWidth: "800px",
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
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    minWidth: "560px",
  },
  colCursor: {
    width: "42%",
  },
  colHere: {
    width: "58%",
  },
});

const STEP_KEYS = [
  "launch",
  "plan",
  "consult",
  "single",
  "multi",
  "commit",
] as const;

const COMPARE_KEYS = [
  "repo",
  "project",
  "plan",
  "ask",
  "agent",
  "multitask",
  "push",
] as const;

export function CharterPage() {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <div className={styles.stack}>
      <ContentPanel>
        <div className={styles.section}>
          <Body1 className={styles.itemBody}>{t("charter.memoNote")}</Body1>
        </div>
      </ContentPanel>

      <ContentPanel>
        <div className={styles.section}>
          <Title2>{t("charter.purposeTitle")}</Title2>
          <Body1>{t("charter.purposeBody")}</Body1>
        </div>
      </ContentPanel>

      <ContentPanel>
        <div className={styles.section}>
          <Title2>{t("charter.compareTitle")}</Title2>
          <Body1>{t("charter.compareLead")}</Body1>
          <div className={styles.tableWrap}>
            <Table
              className={styles.table}
              aria-label={t("charter.compareTitle")}
            >
              <TableHeader>
                <TableRow>
                  <TableHeaderCell className={styles.colCursor}>
                    {t("charter.compareColCursor")}
                  </TableHeaderCell>
                  <TableHeaderCell className={styles.colHere}>
                    {t("charter.compareColHere")}
                  </TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPARE_KEYS.map((key) => (
                  <TableRow key={key}>
                    <TableCell>{t(`charter.compare.${key}.cursor`)}</TableCell>
                    <TableCell>{t(`charter.compare.${key}.here`)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </ContentPanel>

      <ContentPanel>
        <div className={styles.section}>
          <Title2>{t("charter.planTitle")}</Title2>
          <Body1>{t("charter.planLead")}</Body1>
          <ul className={styles.list}>
            {STEP_KEYS.map((key) => (
              <li key={key} className={styles.listItem}>
                <Title3 className={styles.itemTitle}>
                  {t(`charter.steps.${key}.title`)}
                </Title3>
                <Body1 className={styles.itemBody}>
                  {t(`charter.steps.${key}.body`)}
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

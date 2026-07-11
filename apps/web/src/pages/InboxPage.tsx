import {
  Body1,
  Button,
  Card,
  CardHeader,
  Tab,
  TabList,
  Title3,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ContentPanel } from "../components/shell/ContentPanel";
import {
  type GraphListItem,
  type GraphSource,
  listCalendarEvents,
  listMailMessages,
  useGraphMock,
} from "../lib/graph";
import { azureShellColors } from "../theme/azureTheme";

const useStyles = makeStyles({
  intro: {
    marginBottom: "12px",
    color: "#605e5c",
  },
  toolbar: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "12px",
  },
  list: {
    display: "grid",
    gap: "12px",
    marginTop: "12px",
  },
  card: {
    backgroundColor: azureShellColors.panel,
    border: `1px solid ${azureShellColors.panelBorder}`,
    borderRadius: "2px",
    boxShadow: "none",
  },
  meta: {
    color: "#605e5c",
    marginBottom: "8px",
  },
  preview: {
    whiteSpace: "pre-wrap",
  },
  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "12px",
  },
  badge: {
    fontSize: tokens.fontSizeBase200,
    color: "#605e5c",
  },
});

export function InboxPage() {
  const styles = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mock = useGraphMock();
  const [tab, setTab] = useState<GraphSource>("calendar");
  const [items, setItems] = useState<GraphListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedOnce, setLoadedOnce] = useState(false);

  const load = useCallback(async (source: GraphSource) => {
    setLoading(true);
    setError(null);
    try {
      const data =
        source === "calendar"
          ? await listCalendarEvents()
          : await listMailMessages();
      setItems(data);
      setLoadedOnce(true);
    } catch (err) {
      setItems([]);
      setError(err instanceof Error ? err.message : t("common.failedToLoad"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    // Do not auto-fetch on mount — user must click Load (explicit initiation).
    setItems([]);
    setLoadedOnce(false);
    setError(null);
  }, [tab]);

  function sendToMatch(item: GraphListItem) {
    navigate("/app/match", {
      state: {
        graphImport: {
          plainText: item.plainText,
          source: item.source,
          itemId: item.id,
          journalDraft: item.journalDraft,
        },
      },
    });
  }

  function sendToJournal(item: GraphListItem) {
    navigate("/app/journal", {
      state: {
        graphImport: {
          plainText: item.plainText,
          source: item.source,
          itemId: item.id,
          journalDraft: item.journalDraft,
        },
      },
    });
  }

  return (
    <>
      <ContentPanel>
        <Body1 className={styles.intro}>{t("inbox.intro")}</Body1>
        <Body1 className={styles.badge}>
          {mock ? t("inbox.mockMode") : t("inbox.liveMode")}
        </Body1>
        <div className={styles.toolbar}>
          <TabList
            selectedValue={tab}
            onTabSelect={(_, data) =>
              setTab((data.value as GraphSource) ?? "calendar")
            }
          >
            <Tab value="calendar">{t("inbox.tabCalendar")}</Tab>
            <Tab value="mail">{t("inbox.tabMail")}</Tab>
          </TabList>
          <Button
            appearance="primary"
            disabled={loading}
            onClick={() => void load(tab)}
          >
            {loading
              ? t("inbox.loading")
              : tab === "calendar"
                ? t("inbox.loadCalendar")
                : t("inbox.loadMail")}
          </Button>
        </div>
        <Body1 className={styles.intro}>{t("inbox.consentHint")}</Body1>
      </ContentPanel>

      {error && <Body1 style={{ marginTop: 16 }}>{error}</Body1>}

      {!loading && loadedOnce && items.length === 0 && !error && (
        <Body1 style={{ marginTop: 16 }}>{t("inbox.empty")}</Body1>
      )}

      <div className={styles.list}>
        {items.map((item) => (
          <Card key={item.id} className={styles.card}>
            <CardHeader header={<Title3>{item.title}</Title3>} />
            {item.whenLabel && (
              <Body1 className={styles.meta}>{item.whenLabel}</Body1>
            )}
            <Body1 className={styles.preview}>{item.preview}</Body1>
            <div className={styles.actions}>
              <Button
                appearance="primary"
                onClick={() => sendToMatch(item)}
              >
                {t("inbox.useInMatch")}
              </Button>
              <Button
                appearance="secondary"
                onClick={() => sendToJournal(item)}
              >
                {t("inbox.useInJournal")}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

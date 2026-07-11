export type GraphSource = "calendar" | "mail";

export type GraphListItem = {
  id: string;
  source: GraphSource;
  title: string;
  preview: string;
  whenLabel: string;
  /** Plain text suitable for Match referenceText / Journal draft. */
  plainText: string;
  /** Optional journal prefill. */
  journalDraft?: {
    title: string;
    situation?: string;
    bodyText?: string;
  };
};

export type GraphImportHandoff = {
  plainText: string;
  journalDraft?: GraphListItem["journalDraft"];
  source: GraphSource;
  itemId: string;
};

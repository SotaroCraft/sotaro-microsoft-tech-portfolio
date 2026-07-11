import type { GraphListItem } from "./types";

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function formatWhen(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

type GraphEvent = {
  id?: string;
  subject?: string | null;
  bodyPreview?: string | null;
  body?: { contentType?: string; content?: string } | null;
  start?: { dateTime?: string; timeZone?: string } | null;
  end?: { dateTime?: string; timeZone?: string } | null;
  location?: { displayName?: string | null } | null;
  organizer?: { emailAddress?: { name?: string; address?: string } } | null;
};

type GraphMessage = {
  id?: string;
  subject?: string | null;
  bodyPreview?: string | null;
  body?: { contentType?: string; content?: string } | null;
  receivedDateTime?: string | null;
  from?: { emailAddress?: { name?: string; address?: string } } | null;
  toRecipients?: Array<{ emailAddress?: { name?: string; address?: string } }>;
};

function eventBodyText(event: GraphEvent): string {
  const content = event.body?.content ?? "";
  if (!content) return (event.bodyPreview ?? "").trim();
  if ((event.body?.contentType ?? "").toLowerCase() === "html") {
    return stripHtml(content);
  }
  return content.trim();
}

function messageBodyText(message: GraphMessage): string {
  const content = message.body?.content ?? "";
  if (!content) return (message.bodyPreview ?? "").trim();
  if ((message.body?.contentType ?? "").toLowerCase() === "html") {
    return stripHtml(content);
  }
  return content.trim();
}

export function mapCalendarEvent(event: GraphEvent): GraphListItem {
  const title = (event.subject ?? "(no subject)").trim() || "(no subject)";
  const start = event.start?.dateTime ?? null;
  const end = event.end?.dateTime ?? null;
  const whenLabel = [formatWhen(start), formatWhen(end)]
    .filter(Boolean)
    .join(" – ");
  const location = event.location?.displayName?.trim() ?? "";
  const organizer =
    event.organizer?.emailAddress?.name ||
    event.organizer?.emailAddress?.address ||
    "";
  const body = eventBodyText(event);
  const preview = (event.bodyPreview ?? body).slice(0, 160);

  const lines = [
    `Calendar: ${title}`,
    whenLabel && `When: ${whenLabel}`,
    location && `Location: ${location}`,
    organizer && `Organizer: ${organizer}`,
    body && "",
    body,
  ].filter((line) => line !== undefined && line !== null) as string[];

  const plainText = lines.filter((l, i) => !(l === "" && i === lines.length - 1)).join("\n").trim();

  return {
    id: event.id ?? `cal-${title}-${start ?? "unknown"}`,
    source: "calendar",
    title,
    preview,
    whenLabel,
    plainText,
    journalDraft: {
      title,
      situation: [whenLabel && `When: ${whenLabel}`, location && `Location: ${location}`]
        .filter(Boolean)
        .join("\n"),
      bodyText: body || preview,
    },
  };
}

export function mapMailMessage(message: GraphMessage): GraphListItem {
  const title = (message.subject ?? "(no subject)").trim() || "(no subject)";
  const whenLabel = formatWhen(message.receivedDateTime);
  const from =
    message.from?.emailAddress?.name ||
    message.from?.emailAddress?.address ||
    "";
  const body = messageBodyText(message);
  const preview = (message.bodyPreview ?? body).slice(0, 160);

  const lines = [
    `Mail: ${title}`,
    whenLabel && `Received: ${whenLabel}`,
    from && `From: ${from}`,
    body && "",
    body,
  ].filter((line) => line !== undefined && line !== null) as string[];

  const plainText = lines.join("\n").trim();

  return {
    id: message.id ?? `mail-${title}-${message.receivedDateTime ?? "unknown"}`,
    source: "mail",
    title,
    preview,
    whenLabel,
    plainText,
    journalDraft: {
      title,
      situation: [from && `From: ${from}`, whenLabel && `Received: ${whenLabel}`]
        .filter(Boolean)
        .join("\n"),
      bodyText: body || preview,
    },
  };
}

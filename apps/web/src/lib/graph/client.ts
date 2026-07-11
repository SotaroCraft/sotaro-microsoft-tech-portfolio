import { acquireGraphAccessToken } from "./token";
import { mapCalendarEvent, mapMailMessage } from "./format";
import { listMockCalendarEvents, listMockMailMessages } from "./mock";
import type { GraphListItem } from "./types";
import { useGraphMock } from "../msalConfig";

const GRAPH = "https://graph.microsoft.com/v1.0";

async function graphGet<T>(path: string, accessToken: string): Promise<T> {
  const res = await fetch(`${GRAPH}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Graph ${res.status}: ${body.slice(0, 200) || res.statusText}`);
  }
  return (await res.json()) as T;
}

type GraphCollection<T> = { value?: T[] };

export async function listCalendarEvents(
  top = 15,
): Promise<GraphListItem[]> {
  if (useGraphMock()) return listMockCalendarEvents();

  const token = await acquireGraphAccessToken();
  const start = new Date();
  start.setDate(start.getDate() - 14);
  const end = new Date();
  end.setDate(end.getDate() + 14);

  const params = new URLSearchParams({
    startDateTime: start.toISOString(),
    endDateTime: end.toISOString(),
    $top: String(top),
    $orderby: "start/dateTime",
    $select:
      "id,subject,bodyPreview,body,start,end,location,organizer",
  });

  const data = await graphGet<GraphCollection<Parameters<typeof mapCalendarEvent>[0]>>(
    `/me/calendarView?${params.toString()}`,
    token,
  );

  return (data.value ?? []).map(mapCalendarEvent);
}

export async function listMailMessages(top = 15): Promise<GraphListItem[]> {
  if (useGraphMock()) return listMockMailMessages();

  const token = await acquireGraphAccessToken();
  const params = new URLSearchParams({
    $top: String(top),
    $orderby: "receivedDateTime desc",
    $select: "id,subject,bodyPreview,body,receivedDateTime,from,toRecipients",
  });

  const data = await graphGet<GraphCollection<Parameters<typeof mapMailMessage>[0]>>(
    `/me/messages?${params.toString()}`,
    token,
  );

  return (data.value ?? []).map(mapMailMessage);
}

export type { GraphListItem, GraphImportHandoff, GraphSource } from "./types";

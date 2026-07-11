import type { GraphListItem } from "./types";
import { mapCalendarEvent, mapMailMessage } from "./format";

const MOCK_EVENTS = [
  {
    id: "mock-cal-1",
    subject: "DMTA checkpoint — Capture review",
    bodyPreview: "Review recent Capture notes and align Match reference text.",
    body: {
      contentType: "Text",
      content:
        "Agenda:\n1. Review Capture notes from this week\n2. Align Match reference text\n3. Confirm next Decide action",
    },
    start: { dateTime: "2026-07-10T10:00:00", timeZone: "Asia/Tokyo" },
    end: { dateTime: "2026-07-10T10:30:00", timeZone: "Asia/Tokyo" },
    location: { displayName: "Teams" },
    organizer: { emailAddress: { name: "You", address: "you@example.com" } },
  },
  {
    id: "mock-cal-2",
    subject: "Architecture sync — MicroStarPlatform",
    bodyPreview: "Walk through Azure stack topology and Graph import UX.",
    body: {
      contentType: "Text",
      content:
        "Discuss SWA + Entra gatekeeping vs MSAL Graph tokens.\nConfirm mock path for local Track A.",
    },
    start: { dateTime: "2026-07-09T15:00:00", timeZone: "Asia/Tokyo" },
    end: { dateTime: "2026-07-09T15:45:00", timeZone: "Asia/Tokyo" },
    location: { displayName: "Conference room A" },
    organizer: {
      emailAddress: { name: "Platform", address: "platform@example.com" },
    },
  },
];

const MOCK_MESSAGES = [
  {
    id: "mock-mail-1",
    subject: "Opportunity notes — context for Match",
    bodyPreview: "Key requirements and milestones for the next Match run.",
    body: {
      contentType: "Text",
      content:
        "Key requirements:\n- Structured achievement journal (STAR optional)\n- Context matching against reference text\n- Pipeline tracker with next actions\n\nPlease paste into Match when ready.",
    },
    receivedDateTime: "2026-07-10T08:12:00Z",
    from: {
      emailAddress: { name: "Partner", address: "partner@example.com" },
    },
  },
  {
    id: "mock-mail-2",
    subject: "Follow-up: Graph import consent checklist",
    bodyPreview: "Delegated scopes User.Read, Calendars.Read, Mail.Read.",
    body: {
      contentType: "Html",
      content:
        "<p>Checklist:</p><ul><li>User.Read</li><li>Calendars.Read</li><li>Mail.Read</li></ul><p>SPA redirect URIs for MSAL.</p>",
    },
    receivedDateTime: "2026-07-09T22:40:00Z",
    from: {
      emailAddress: { name: "Admin", address: "admin@example.com" },
    },
  },
];

export function listMockCalendarEvents(): GraphListItem[] {
  return MOCK_EVENTS.map(mapCalendarEvent);
}

export function listMockMailMessages(): GraphListItem[] {
  return MOCK_MESSAGES.map(mapMailMessage);
}

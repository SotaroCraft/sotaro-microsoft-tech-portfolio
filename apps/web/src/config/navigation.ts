import type { ComponentType } from "react";
import {
  BookInformationRegular,
  BookRegular,
  DataBarVerticalRegular,
  HomeRegular,
  MailInboxRegular,
  SearchRegular,
  SettingsRegular,
  TableRegular,
} from "@fluentui/react-icons";

export type NavItem = {
  to: string;
  labelKey: string;
  icon: ComponentType<{ className?: string; fontSize?: number }>;
  end?: boolean;
  /** Optional sidebar section header i18n key */
  sectionKey?: string;
};

export const workspaceNav: NavItem[] = [
  {
    to: "/app",
    labelKey: "nav.overview",
    icon: HomeRegular,
    end: true,
    sectionKey: "nav.section.today",
  },
  {
    to: "/app/journal",
    labelKey: "nav.journal",
    icon: BookRegular,
    sectionKey: "nav.section.flow",
  },
  {
    to: "/app/inbox",
    labelKey: "nav.inbox",
    icon: MailInboxRegular,
    sectionKey: "nav.section.flow",
  },
  {
    to: "/app/match",
    labelKey: "nav.match",
    icon: SearchRegular,
    sectionKey: "nav.section.flow",
  },
  {
    to: "/app/pipeline",
    labelKey: "nav.pipeline",
    icon: TableRegular,
    sectionKey: "nav.section.flow",
  },
  {
    to: "/app/summary",
    labelKey: "nav.summary",
    icon: DataBarVerticalRegular,
    sectionKey: "nav.section.reflect",
  },
  {
    to: "/app/charter",
    labelKey: "nav.charter",
    icon: BookInformationRegular,
    sectionKey: "nav.section.more",
  },
  {
    to: "/app/settings",
    labelKey: "nav.settings",
    icon: SettingsRegular,
    sectionKey: "nav.section.more",
  },
];

/** Kept for PublicShell compatibility; public entry is auth-gated to /app. */
export const publicNav: NavItem[] = [
  { to: "/app", labelKey: "nav.overview", icon: HomeRegular, end: true },
];

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

const workspacePageKeys: Record<string, string> = {
  "/app": "pages.overview",
  "/app/journal": "pages.journal",
  "/app/match": "pages.match",
  "/app/inbox": "pages.inbox",
  "/app/pipeline": "pages.pipeline",
  "/app/summary": "pages.summary",
  "/app/charter": "pages.charter",
  "/app/settings": "pages.settings",
};

export function getPublicPageKey(_pathname: string): string | undefined {
  return undefined;
}

export function getWorkspacePageKey(pathname: string): string | undefined {
  if (pathname.startsWith("/app/projects/")) {
    return "pages.projectWorkspace";
  }
  return workspacePageKeys[pathname] ?? workspacePageKeys["/app"];
}

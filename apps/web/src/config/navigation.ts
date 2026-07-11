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
  { to: "/app", labelKey: "nav.overview", icon: HomeRegular, end: true, sectionKey: "nav.section.today" },
  { to: "/app/journal", labelKey: "nav.journal", icon: BookRegular, sectionKey: "nav.section.flow" },
  { to: "/app/inbox", labelKey: "nav.inbox", icon: MailInboxRegular, sectionKey: "nav.section.flow" },
  { to: "/app/match", labelKey: "nav.match", icon: SearchRegular, sectionKey: "nav.section.flow" },
  { to: "/app/pipeline", labelKey: "nav.pipeline", icon: TableRegular, sectionKey: "nav.section.flow" },
  { to: "/app/summary", labelKey: "nav.summary", icon: DataBarVerticalRegular, sectionKey: "nav.section.reflect" },
  { to: "/app/settings", labelKey: "nav.settings", icon: SettingsRegular, sectionKey: "nav.section.more" },
];

export const publicNav: NavItem[] = [
  { to: "/", labelKey: "nav.home", icon: HomeRegular, end: true },
  { to: "/glossary", labelKey: "nav.terminology", icon: BookInformationRegular },
];

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

const publicPageKeys: Record<string, string> = {
  "/": "pages.home",
  "/glossary": "pages.glossary",
};

const workspacePageKeys: Record<string, string> = {
  "/app": "pages.overview",
  "/app/journal": "pages.journal",
  "/app/match": "pages.match",
  "/app/inbox": "pages.inbox",
  "/app/pipeline": "pages.pipeline",
  "/app/summary": "pages.summary",
  "/app/settings": "pages.settings",
};

export function getPublicPageKey(pathname: string): string | undefined {
  return publicPageKeys[pathname];
}

export function getWorkspacePageKey(pathname: string): string | undefined {
  return workspacePageKeys[pathname] ?? workspacePageKeys["/app"];
}

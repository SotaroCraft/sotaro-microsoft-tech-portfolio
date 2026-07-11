import type { ComponentType } from "react";
import {
  BookInformationRegular,
  BookRegular,
  DataBarVerticalRegular,
  HomeRegular,
  SearchRegular,
  SettingsRegular,
  TableRegular,
} from "@fluentui/react-icons";

export type NavItem = {
  to: string;
  labelKey: string;
  icon: ComponentType<{ className?: string; fontSize?: number }>;
  end?: boolean;
};

export const workspaceNav: NavItem[] = [
  { to: "/app", labelKey: "nav.overview", icon: HomeRegular, end: true },
  { to: "/app/journal", labelKey: "nav.journal", icon: BookRegular },
  { to: "/app/match", labelKey: "nav.match", icon: SearchRegular },
  { to: "/app/pipeline", labelKey: "nav.pipeline", icon: TableRegular },
  { to: "/app/summary", labelKey: "nav.summary", icon: DataBarVerticalRegular },
  { to: "/app/settings", labelKey: "nav.settings", icon: SettingsRegular },
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

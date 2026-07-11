import type { ComponentType } from "react";
import {
  BookInformationRegular,
  BookRegular,
  DataBarVerticalRegular,
  HomeRegular,
  SettingsRegular,
  TableRegular,
} from "@fluentui/react-icons";

export type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string; fontSize?: number }>;
  end?: boolean;
};

export const workspaceNav: NavItem[] = [
  { to: "/app", label: "Overview", icon: HomeRegular, end: true },
  { to: "/app/journal", label: "Journal", icon: BookRegular },
  { to: "/app/pipeline", label: "Pipeline", icon: TableRegular },
  { to: "/app/summary", label: "Summary", icon: DataBarVerticalRegular },
  { to: "/app/settings", label: "Settings", icon: SettingsRegular },
];

export const publicNav: NavItem[] = [
  { to: "/", label: "Home", icon: HomeRegular, end: true },
  { to: "/glossary", label: "Terminology", icon: BookInformationRegular },
];

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

export const workspaceTitles: Record<string, { title: string; subtitle: string }> =
  {
    "/app": {
      title: "Overview",
      subtitle: "Workspace dashboard and service health",
    },
    "/app/journal": {
      title: "Achievement journal",
      subtitle: "Structured notes with optional STAR fields",
    },
    "/app/pipeline": {
      title: "Pipeline tracker",
      subtitle: "Kanban view across pipeline stages",
    },
    "/app/summary": {
      title: "Metrics & summary",
      subtitle: "Bilingual summary and KPI metrics",
    },
    "/app/settings": {
      title: "Settings",
      subtitle: "Milestone target and workspace preferences",
    },
  };

export const publicTitles: Record<string, { title: string; subtitle: string }> =
  {
    "/": {
      title: "MicroBootCan",
      subtitle: "Azure-native personal productivity PWA",
    },
    "/glossary": {
      title: "Terminology",
      subtitle: "Framework and app vocabulary (EN / JA)",
    },
  };

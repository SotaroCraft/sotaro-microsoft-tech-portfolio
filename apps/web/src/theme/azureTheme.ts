import { createLightTheme, type Theme } from "@fluentui/react-components";

/** Lime green brand ramp (primary #65a30d) — distinct from Azure Portal blue. */
const limeBrand = {
  10: "#1a2e05",
  20: "#253a0a",
  30: "#365314",
  40: "#3f6212",
  50: "#4d7c0f",
  60: "#65a30d",
  70: "#84cc16",
  80: "#65a30d",
  90: "#84cc16",
  100: "#a3e635",
  110: "#bef264",
  120: "#d9f99d",
  130: "#ecfccb",
  140: "#f0fdf4",
  150: "#f7fee7",
  160: "#fafdf4",
};

export const azureTheme: Theme = {
  ...createLightTheme(limeBrand),
};

export const azureShellColors = {
  topBar: "#65a30d",
  topBarHover: "#4d7c0f",
  topBarText: "#ffffff",
  link: "#4d7c0f",
  accentLight: "#ecfccb",
  accentText: "#3f6212",
  canvas: "#f3f2f1",
  panel: "#ffffff",
  panelBorder: "#edebe9",
  sidebar: "#faf9f8",
  sidebarSelected: "#e1dfdd",
  sidebarAccent: "#65a30d",
} as const;

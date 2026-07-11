import { createLightTheme, type BrandVariants, type Theme } from "@fluentui/react-components";

/**
 * MicroStar yellow / gold brand ramp.
 * Primary surface gold #E8B923; darker steps for text-on-brand contrast helpers.
 */
const microStarGold: BrandVariants = {
  10: "#1A1400",
  20: "#2B2100",
  30: "#4A3800",
  40: "#6B5200",
  50: "#8A6A00",
  60: "#A67F00",
  70: "#C4980A",
  80: "#E8B923",
  90: "#F0C93A",
  100: "#F5D76E",
  110: "#F9E49A",
  120: "#FCEFC0",
  130: "#FEF6DC",
  140: "#FFF9EB",
  150: "#FFFCF5",
  160: "#FFFEFA",
};

/** Charcoal navy for shell chrome — pairs with gold for star / energy contrast. */
const navy = {
  base: "#1B2430",
  hover: "#2A3544",
  deep: "#121820",
} as const;

export const azureTheme: Theme = {
  ...createLightTheme(microStarGold),
  // Gold buttons need dark foreground for readable contrast (WCAG-ish).
  colorNeutralForegroundOnBrand: navy.base,
};

/**
 * Shell chrome tokens (CSS-variable mirrors live in `styles/global.css`).
 * Yellow-forward MicroStar look: navy top bar + gold accents on warm light surfaces.
 */
export const azureShellColors = {
  topBar: navy.base,
  topBarHover: navy.hover,
  topBarText: "#ffffff",
  topBarAccent: "#F0C014",
  link: "#8A6A00",
  accentLight: "#FEF6DC",
  accentText: "#6B5200",
  canvas: "#F2F0EA",
  panel: "#ffffff",
  panelBorder: "#E8E4DA",
  sidebar: "#FAF8F3",
  sidebarSelected: "#FEF6DC",
  sidebarAccent: "#E8B923",
  mutedText: "#5C574C",
  bodyText: "#2A261C",
} as const;

import { useTranslation } from "react-i18next";
import type { AppLocale } from "../i18n";

export function useAppLocale(): AppLocale {
  const { i18n } = useTranslation();
  return i18n.language.startsWith("ja") ? "ja" : "en";
}

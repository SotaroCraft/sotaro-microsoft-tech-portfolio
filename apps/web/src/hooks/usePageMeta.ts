import { useTranslation } from "react-i18next";
import {
  getPublicPageKey,
  getWorkspacePageKey,
} from "../config/navigation";

export function usePageMeta(scope: "public" | "workspace", pathname: string) {
  const { t } = useTranslation();
  const key =
    scope === "public"
      ? getPublicPageKey(pathname)
      : getWorkspacePageKey(pathname);

  if (!key) return null;

  return {
    title: t(`${key}.title`),
    subtitle: t(`${key}.subtitle`),
  };
}

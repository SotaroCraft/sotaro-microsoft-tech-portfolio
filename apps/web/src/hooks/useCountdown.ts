import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function formatRemaining(ms: number, locale: string, reachedLabel: string): string {
  if (ms <= 0) return reachedLabel;

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (locale.startsWith("ja")) {
    return `${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
  }

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export function useCountdown(targetIso: string) {
  const { t, i18n } = useTranslation();
  const target = new Date(targetIso).getTime();
  const reachedLabel = t("countdown.reached");

  const [label, setLabel] = useState(() =>
    formatRemaining(target - Date.now(), i18n.language, reachedLabel),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setLabel(
        formatRemaining(target - Date.now(), i18n.language, reachedLabel),
      );
    }, 1000);
    return () => clearInterval(id);
  }, [target, i18n.language, reachedLabel]);

  return { label };
}

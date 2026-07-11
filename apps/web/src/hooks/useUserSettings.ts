import { useEffect, useState } from "react";
import type { UserSettings } from "@microbootcan/shared";
import { MILESTONE_TARGET_ISO } from "@microbootcan/shared";
import { apiFetch } from "../lib/api";

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    apiFetch<UserSettings>("/settings")
      .then((data) => {
        if (!cancelled) setSettings(data);
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setSettings({
            id: "fallback",
            userId: "fallback",
            milestoneTargetIso: MILESTONE_TARGET_ISO,
            updatedAt: new Date().toISOString(),
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, loading, error, setSettings };
}

import { useEffect, useState } from "react";

function formatRemaining(ms: number): string {
  if (ms <= 0) return "Target reached";

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export function useCountdown(targetIso: string) {
  const target = new Date(targetIso).getTime();
  const [label, setLabel] = useState(() =>
    formatRemaining(target - Date.now()),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setLabel(formatRemaining(target - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  return { label };
}

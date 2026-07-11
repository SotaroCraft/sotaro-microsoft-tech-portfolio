import { useCallback, useEffect, useState } from "react";

export type SwaClientPrincipal = {
  identityProvider?: string;
  userId?: string;
  userDetails?: string;
  userRoles?: string[];
};

type AuthMeResponse = {
  clientPrincipal?: SwaClientPrincipal | null;
};

export function loginUrl(postLogin = "/app"): string {
  return `/.auth/login/aad?post_login_redirect_uri=${encodeURIComponent(postLogin)}`;
}

export function logoutUrl(postLogout = "/app"): string {
  return `/.auth/logout?post_logout_redirect_uri=${encodeURIComponent(postLogout)}`;
}

export function useAuth() {
  const [principal, setPrincipal] = useState<SwaClientPrincipal | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/.auth/me");
      if (!res.ok) {
        setPrincipal(null);
        return;
      }
      const data = (await res.json()) as AuthMeResponse;
      setPrincipal(data.clientPrincipal ?? null);
    } catch {
      setPrincipal(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    loading,
    principal,
    isAuthenticated: Boolean(principal?.userId),
    email: principal?.userDetails,
    refresh,
  };
}

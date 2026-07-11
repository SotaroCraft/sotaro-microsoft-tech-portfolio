import type { Configuration, RedirectRequest } from "@azure/msal-browser";

/** Graph delegated scopes for Outlook Calendar + Mail (first slice). */
export const GRAPH_SCOPES = [
  "User.Read",
  "Calendars.Read",
  "Mail.Read",
] as const;

export function getEntraClientId(): string {
  return (import.meta.env.VITE_ENTRA_CLIENT_ID ?? "").trim();
}

export function getEntraTenantId(): string {
  return (import.meta.env.VITE_ENTRA_TENANT_ID ?? "common").trim() || "common";
}

/** Use mock Graph when explicitly set, or when client ID is missing. */
export function useGraphMock(): boolean {
  const flag = (import.meta.env.VITE_GRAPH_USE_MOCK ?? "").trim().toLowerCase();
  if (flag === "true" || flag === "1") return true;
  if (flag === "false" || flag === "0") return false;
  return !getEntraClientId();
}

export function buildMsalConfig(): Configuration | null {
  const clientId = getEntraClientId();
  if (!clientId) return null;

  const tenantId = getEntraTenantId();
  return {
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri: window.location.origin,
      postLogoutRedirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: "sessionStorage",
    },
  };
}

export const graphTokenRequest: RedirectRequest = {
  scopes: [...GRAPH_SCOPES],
};

import type { HttpRequest } from "@azure/functions";

interface ClientPrincipal {
  userId?: string;
  userDetails?: string;
  identityProvider?: string;
  userRoles?: string[];
}

export interface AuthContext {
  userId: string;
  email?: string;
}

function decodeClientPrincipal(
  request: HttpRequest,
): ClientPrincipal | undefined {
  const header = request.headers.get("x-ms-client-principal");
  if (!header) {
    return undefined;
  }

  try {
    const json = Buffer.from(header, "base64").toString("utf8");
    return JSON.parse(json) as ClientPrincipal;
  } catch {
    return undefined;
  }
}

export function getAuthContext(request: HttpRequest): AuthContext | null {
  if (process.env.DEV_AUTH_BYPASS === "true") {
    return {
      userId: process.env.DEV_USER_ID ?? "dev-user-local",
      email: process.env.ALLOWED_USER_EMAIL ?? "dev@localhost",
    };
  }

  const principal = decodeClientPrincipal(request);
  if (!principal?.userId) {
    return null;
  }

  const allowedEmail = process.env.ALLOWED_USER_EMAIL?.trim().toLowerCase();
  const email = principal.userDetails?.trim().toLowerCase();

  if (allowedEmail && email && email !== allowedEmail) {
    return null;
  }

  return {
    userId: principal.userId,
    email: principal.userDetails,
  };
}

export function requireAuth(request: HttpRequest): AuthContext {
  const auth = getAuthContext(request);
  if (!auth) {
    throw new AuthRequiredError();
  }
  return auth;
}

export class AuthRequiredError extends Error {
  readonly status = 401;

  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthRequiredError";
  }
}

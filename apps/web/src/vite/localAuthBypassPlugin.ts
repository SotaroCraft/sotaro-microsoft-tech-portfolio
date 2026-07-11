import type { Plugin } from "vite";

/**
 * Mimic SWA Built-in Auth on Vite (:5173) so local UX matches production.
 * Disabled when VITE_LOCAL_AUTH_BYPASS=false (use SWA CLI :4280 for real Entra).
 */
export function localAuthBypassPlugin(): Plugin {
  const enabled = () => {
    const flag = (process.env.VITE_LOCAL_AUTH_BYPASS ?? "true")
      .trim()
      .toLowerCase();
    return flag !== "false" && flag !== "0";
  };

  const principal = () => ({
    identityProvider: "aad",
    userId: process.env.VITE_DEV_USER_ID?.trim() || "dev-user-local",
    userDetails:
      process.env.VITE_DEV_USER_EMAIL?.trim() || "dev@localhost",
    userRoles: ["anonymous", "authenticated"],
  });

  return {
    name: "local-auth-bypass",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!enabled()) {
          next();
          return;
        }

        const raw = req.url ?? "/";
        const pathOnly = raw.split("?")[0] ?? "/";

        if (pathOnly === "/.auth/me") {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ clientPrincipal: principal() }));
          return;
        }

        if (pathOnly === "/.auth/login/aad") {
          const url = new URL(raw, "http://localhost");
          const redirect =
            url.searchParams.get("post_login_redirect_uri") || "/app";
          res.statusCode = 302;
          res.setHeader("Location", redirect);
          res.end();
          return;
        }

        if (pathOnly === "/.auth/logout") {
          const url = new URL(raw, "http://localhost");
          const redirect =
            url.searchParams.get("post_logout_redirect_uri") || "/app";
          res.statusCode = 302;
          res.setHeader("Location", redirect);
          res.end();
          return;
        }

        next();
      });
    },
  };
}

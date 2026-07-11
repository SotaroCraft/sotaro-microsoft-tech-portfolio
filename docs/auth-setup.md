# MicroStarPlatform — Entra ID Authentication

Azure Static Web Apps built-in authentication protects `/app/*` and authenticated API routes.

## Route policy

Configured in [`apps/web/staticwebapp.config.json`](../apps/web/staticwebapp.config.json):

| Route | Access |
|-------|--------|
| `/` | Public |
| `/api/architecture` | Public (sanitized metadata scaffold) |
| `/api/health` | Public |
| `/api/*` (other) | Authenticated |
| `/app/*` | Authenticated |

Unauthenticated requests to protected routes receive `401` → redirect to `/.auth/login/aad`.

## Entra App Registration

### Automated (recommended)

```powershell
# From repo root — requires az login
.\scripts\setup-entra-app.ps1
```

Creates a single-tenant App Registration, sets redirect URIs for production SWA and local SWA CLI (`4280`), and applies `AZURE_CLIENT_ID` / `AZURE_CLIENT_SECRET` to the Static Web App app settings.

Then set the single-user allowlist on SWA (Functions inherit linked API settings):

```powershell
az staticwebapp appsettings set `
  --name stapp-microbootcan-z6mnnh4iqiisc `
  --resource-group rg-microbootcan-prod `
  --setting-names ALLOWED_USER_EMAIL=you@example.com
```

After the script, link the provider in **Azure Portal → Static Web App → Authentication → Add identity provider → Microsoft** (same client ID and secret). Route protection is in `staticwebapp.config.json`; Entra credentials stay in app settings only (not in the config file — that pattern blocked SWA deploy).

### Manual (Azure portal)

1. **App registrations** → New registration
   - Name: `MicroBootCan SWA` (Azure display name; product brand is MicroStarPlatform)
   - Supported account types: **Single tenant**
   - Redirect URI (SPA): `https://<your-swa-hostname>/.auth/login/aad/callback`
2. Note **Application (client) ID** and **Directory (tenant) ID**
3. **Certificates & secrets** → New client secret (store in GitHub / SWA settings only)
4. **Authentication** → Add platform **Single-page application** if needed for local SWA CLI

## Static Web Apps configuration

After SWA is deployed (Phase A — requires approval):

1. Azure Portal → Static Web App → **Authentication**
2. Add **Microsoft** identity provider
3. Enter App Registration **client ID** and **client secret**
4. Set app settings (or use Bicep `static-web-app.bicep` placeholders):
   - `AZURE_CLIENT_ID`
   - `AZURE_CLIENT_SECRET`

Update `staticwebapp.config.json` tenant segment if you recreate the App Registration in another tenant:

```json
"openIdIssuer": "https://login.microsoftonline.com/<TENANT_ID>/v2.0"
```

## Single-user allowlist (API)

Functions read the SWA `x-ms-client-principal` header. Optional app setting:

```
ALLOWED_USER_EMAIL=you@example.com
```

When set, only that email may access authenticated APIs.

## Local development

| Setting | Purpose |
|---------|---------|
| `DEV_AUTH_BYPASS=true` | Skip Entra; use `DEV_USER_ID` |
| `DEV_USER_ID=dev-user-local` | Partition key for Cosmos in local mode |

**Never enable `DEV_AUTH_BYPASS` in production app settings.**

## SWA CLI (local auth testing)

```powershell
swa start http://localhost:5173 --api-location api
```

Use `/.auth/login/aad` on the SWA CLI port (`4280`) to test the login flow against your App Registration (add `http://localhost:4280/.auth/login/aad/callback` as redirect URI).

## Microsoft Graph delegated import

SWA `/.auth` authenticates the workspace but does **not** issue Graph tokens for `Calendars.Read` / `Mail.Read`. The Inbox page (`/app/inbox`) uses **MSAL.js** in the browser for user-initiated Graph reads.

### Scopes (first slice — both locked)

| Delegated scope | Purpose |
|-----------------|--------|
| `User.Read` | Profile baseline |
| `Calendars.Read` | Recent Outlook calendar events |
| `Mail.Read` | Recent Outlook mail messages |

### Automated permission update

```powershell
# From repo root — requires az login with rights to update the app registration
.\scripts\setup-graph-permissions.ps1
# Optional admin consent (tenant-wide):
.\scripts\setup-graph-permissions.ps1 -GrantAdminConsent
```

Expected cost: **¥0** (Entra directory config only; no new Azure resources).

### Manual Portal steps (if `az` unavailable)

1. **Azure Portal** → **Microsoft Entra ID** → **App registrations** → `MicroBootCan SWA` (or your SWA app).
2. **API permissions** → **Add a permission** → **Microsoft Graph** → **Delegated**:
   - `User.Read`
   - `Calendars.Read`
   - `Mail.Read`
3. **Grant admin consent** (recommended for single-user tenant) — or rely on per-user consent on first MSAL popup.
4. **Authentication** → **Add a platform** → **Single-page application** if missing. Redirect URIs:
   - `https://ambitious-desert-0763df000.7.azurestaticapps.net`
   - `http://localhost:5173`
   - `http://localhost:4280`
   Keep existing SWA callbacks under Web / `/.auth/login/aad/callback` unchanged.
5. Note **Application (client) ID** and **Directory (tenant) ID**.

### Web env (Vite)

```env
VITE_ENTRA_CLIENT_ID=<same client ID as SWA Entra app>
VITE_ENTRA_TENANT_ID=<your tenant GUID>
VITE_GRAPH_USE_MOCK=false
```

When `VITE_ENTRA_CLIENT_ID` is unset (or `VITE_GRAPH_USE_MOCK=true`), Inbox uses **mock** calendar/mail items so Match / Journal prefill works without consent.

Design detail: [graph-import-design.md](graph-import-design.md).

## Related docs

- [azure-setup.md](azure-setup.md) — SWA deploy + GitHub secrets
- [local-dev.md](local-dev.md) — hybrid local stack
- [graph-import-design.md](graph-import-design.md) — Graph import (Calendar + Mail)
- [CHARTER.md](../CHARTER.md) — privacy and public copy rules

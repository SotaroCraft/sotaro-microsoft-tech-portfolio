/**
 * SWA linked-API entry — Track A parity with local `index.ts`.
 *
 * Deploy path: `scripts/prepare-swa-api.mjs` esbuild-bundles this file into
 * `swa-api/` (stock Node v4 layout). Oryx only npm-installs `@azure/functions`
 * + `@azure/cosmos`. Shared/zod/mock AI are inlined.
 *
 * Match uses whatever `AI_PROVIDER` is set on SWA (production is `mock`).
 */
import "./functions/health";
import "./functions/architecture";
import "./functions/episodes";
import "./functions/pipeline";
import "./functions/summary";
import "./functions/settings";
import "./functions/match";
import "./functions/projects";

/** SWA deploy entry — public endpoints only (keeps bundle small for linked API).
 *
 * Phase 0 Step B1 (not yet shipped): add Cosmos-backed workspace CRUD
 * (episodes / companies / applications / summary / settings) without match/AI.
 * Blockers: linked Functions size + Oryx must stay free of monorepo/ncc failures.
 * Approach: keep this slim public surface until prepare-swa-api can emit a
 * separately validated Cosmos CRUD bundle (see scripts/prepare-swa-api.mjs).
 */
import "./functions/health";
import "./functions/architecture";

#!/usr/bin/env node
/**
 * Emit a stock SWA managed-Functions API (Node v4 layout from MS docs).
 * No ncc / monorepo deps — Oryx only needs `npm install` for @azure/functions.
 *
 * Current ship surface: health + architecture only (stable CI).
 *
 * Phase 0 Step B1 (deferred — do not half-land here):
 * - Add Cosmos CRUD for episodes / companies / applications / summary / settings
 * - Exclude match + AI providers (deps, TPM, cost approval)
 * - Likely needs @azure/cosmos + auth helpers; validate in a side folder
 *   (swa-api-*) before replacing this slim emitter
 * - Step B2: prefer copying a `pnpm build` api artifact + minimal deps
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const swaApi = join(root, "swa-api");
const apiRoot = join(root, "api");
const mockPath = join(root, "apps/web/public/architecture.mock.json");

if (existsSync(swaApi)) rmSync(swaApi, { recursive: true, force: true });
mkdirSync(join(swaApi, "src/functions"), { recursive: true });

const apiPkg = JSON.parse(readFileSync(join(apiRoot, "package.json"), "utf8"));
const architectureMock = JSON.parse(readFileSync(mockPath, "utf8"));

cpSync(join(apiRoot, "host.json"), join(swaApi, "host.json"));

writeFileSync(
  join(swaApi, "package.json"),
  `${JSON.stringify(
    {
      name: "microbootcan-swa-api",
      version: "0.1.0",
      private: true,
      main: "src/index.js",
      dependencies: {
        "@azure/functions": apiPkg.dependencies["@azure/functions"],
      },
      engines: { node: "20" },
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  join(swaApi, "src/index.js"),
  `require("./functions/health");
require("./functions/architecture");
`,
);

writeFileSync(
  join(swaApi, "src/functions/health.js"),
  `const { app } = require("@azure/functions");

app.http("health", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "health",
  handler: async () => ({
    status: 200,
    jsonBody: {
      status: "ok",
      app: "microbootcan-api",
      env: process.env.APP_ENV ?? "prod",
      timestamp: new Date().toISOString(),
    },
  }),
});
`,
);

writeFileSync(
  join(swaApi, "src/functions/architecture.js"),
  `const { app } = require("@azure/functions");

const MOCK = ${JSON.stringify(architectureMock, null, 2)};

app.http("architecture", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "architecture",
  handler: async () => ({
    status: 200,
    jsonBody: {
      ...MOCK,
      fetchedAt: new Date().toISOString(),
    },
  }),
});
`,
);

writeFileSync(
  join(swaApi, ".funcignore"),
  ["*.ts", "*.map", "local.settings.json"].join("\n"),
);

function countFiles(dir) {
  let count = 0;
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) count += countFiles(path);
    else count += 1;
  }
  return count;
}

console.log(
  `swa-api ready (${countFiles(swaApi)} files, MS Node v4 layout, Oryx npm install)`,
);

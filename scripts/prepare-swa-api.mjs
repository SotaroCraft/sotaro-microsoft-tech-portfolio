#!/usr/bin/env node
/**
 * Emit a stock SWA managed-Functions API (Node v4 layout).
 *
 * Strategy (Phase 0 B1 + match parity):
 * - esbuild-bundle `api/src/index.swa.ts` → single CJS entry
 * - Externalize `@azure/functions` + `@azure/cosmos` for Oryx `npm install`
 * - Inline `@microstar/shared` / zod / mock AI (no workspace:* on Linux)
 * - Do NOT ship node_modules or ncc full-azure bundles (prior CI failures)
 *
 * Surface: health, architecture, episodes, companies, applications,
 * summary, settings, match (AI_PROVIDER from app settings; prod = mock).
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
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const swaApi = join(root, "swa-api");
const apiRoot = join(root, "api");
const sharedDist = join(root, "packages/shared/dist/index.js");
const entry = join(apiRoot, "src/index.swa.ts");

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!existsSync(entry)) {
  fail(`Missing SWA entry: ${entry}`);
}

if (!existsSync(sharedDist)) {
  console.log("Building @microstar/shared (required for SWA bundle)…");
  const built = spawnSync(
    "pnpm",
    ["--filter", "@microstar/shared", "build"],
    { cwd: root, stdio: "inherit", shell: true },
  );
  if (built.status !== 0) {
    fail("Failed to build @microstar/shared");
  }
}

const require = createRequire(import.meta.url);
let esbuild;
try {
  esbuild = require("esbuild");
} catch {
  fail(
    "esbuild is required. Run `pnpm install` at the repo root (devDependency).",
  );
}

if (existsSync(swaApi)) rmSync(swaApi, { recursive: true, force: true });
mkdirSync(join(swaApi, "src"), { recursive: true });

const apiPkg = JSON.parse(readFileSync(join(apiRoot, "package.json"), "utf8"));
const cosmosVersion = apiPkg.dependencies["@azure/cosmos"];
const functionsVersion = apiPkg.dependencies["@azure/functions"];
if (!cosmosVersion || !functionsVersion) {
  fail("api/package.json must declare @azure/cosmos and @azure/functions");
}

cpSync(join(apiRoot, "host.json"), join(swaApi, "host.json"));

writeFileSync(
  join(swaApi, "package.json"),
  `${JSON.stringify(
    {
      name: "microstar-swa-api",
      version: "0.1.0",
      private: true,
      main: "src/index.js",
      dependencies: {
        "@azure/cosmos": cosmosVersion,
        "@azure/functions": functionsVersion,
      },
      engines: { node: "20" },
    },
    null,
    2,
  )}\n`,
);

const result = esbuild.buildSync({
  entryPoints: [entry],
  outfile: join(swaApi, "src/index.js"),
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  sourcemap: false,
  legalComments: "none",
  // Keep Azure SDKs out of the bundle — Oryx installs them on Linux.
  external: ["@azure/functions", "@azure/cosmos"],
  // Prefer mock when unset (prod SWA already sets AI_PROVIDER=mock).
  banner: {
    js: 'if (!process.env.AI_PROVIDER) process.env.AI_PROVIDER = "mock";',
  },
  logLevel: "warning",
});

if (result.errors?.length) {
  fail(`esbuild failed: ${JSON.stringify(result.errors)}`);
}

writeFileSync(
  join(swaApi, ".funcignore"),
  ["*.ts", "*.map", "local.settings.json", ".esbuild"].join("\n"),
);

function countFiles(dir) {
  let count = 0;
  for (const entryName of readdirSync(dir)) {
    const path = join(dir, entryName);
    if (statSync(path).isDirectory()) count += countFiles(path);
    else count += 1;
  }
  return count;
}

const indexJs = join(swaApi, "src/index.js");
const indexBytes = statSync(indexJs).size;
console.log(
  `swa-api ready (${countFiles(swaApi)} files, index ${(indexBytes / 1024).toFixed(1)} KiB, Oryx npm: @azure/functions + @azure/cosmos)`,
);
console.log(
  "routes: health, architecture, episodes, companies, applications, summary, settings, match",
);

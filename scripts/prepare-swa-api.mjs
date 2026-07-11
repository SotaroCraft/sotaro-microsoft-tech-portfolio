#!/usr/bin/env node
/**
 * Minimal Azure Functions bundle for SWA linked API (skip Oryx rebuild).
 */
import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const swaApi = join(root, "swa-api");
const apiRoot = join(root, "api");
const sharedRoot = join(root, "packages/shared");

if (existsSync(swaApi)) rmSync(swaApi, { recursive: true, force: true });
mkdirSync(swaApi, { recursive: true });

const pnpm = process.platform === "win32" ? "npx pnpm" : "pnpm";
execSync(`${pnpm} --filter @microbootcan/shared build && ${pnpm} --filter @microbootcan/api build`, {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

const apiPkg = JSON.parse(readFileSync(join(apiRoot, "package.json"), "utf8"));
const sharedPkg = JSON.parse(readFileSync(join(sharedRoot, "package.json"), "utf8"));

cpSync(join(apiRoot, "host.json"), join(swaApi, "host.json"));
cpSync(join(apiRoot, "dist"), join(swaApi, "dist"), { recursive: true });

const vendorShared = join(swaApi, "vendor/shared");
mkdirSync(join(vendorShared, "dist"), { recursive: true });
cpSync(join(sharedRoot, "dist"), join(vendorShared, "dist"), { recursive: true });
writeFileSync(
  join(vendorShared, "package.json"),
  `${JSON.stringify(
    {
      name: "@microbootcan/shared",
      version: sharedPkg.version,
      main: "dist/index.js",
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  join(swaApi, "package.json"),
  `${JSON.stringify(
    {
      name: "microbootcan-swa-api",
      version: "0.1.0",
      private: true,
      main: "dist/src/index.js",
      dependencies: {
        "@azure/cosmos": apiPkg.dependencies["@azure/cosmos"],
        "@azure/functions": apiPkg.dependencies["@azure/functions"],
        "@microbootcan/shared": "file:./vendor/shared",
        zod: sharedPkg.dependencies.zod,
      },
      engines: { node: ">=20" },
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  join(swaApi, ".funcignore"),
  ["**/*.map", "**/*.ts", "src/", "local.settings.json", "vendor/shared/dist/**/*.d.ts"].join(
    "\n",
  ),
);

// Validate install locally, then drop node_modules so SWA upload stays small (~100 files).
execSync("npm install --omit=dev --no-audit --no-fund", {
  cwd: swaApi,
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (!existsSync(join(swaApi, "dist/src/index.js"))) {
  throw new Error("swa-api bundle missing dist/src/index.js");
}

console.log("swa-api bundle ready");

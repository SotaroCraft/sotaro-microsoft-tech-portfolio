#!/usr/bin/env node
/**
 * Slim Azure Functions bundle for SWA linked API.
 * Bundles app + shared + @azure/cosmos via ncc; keeps @azure/functions external.
 */
import { execSync } from "node:child_process";
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

if (existsSync(swaApi)) rmSync(swaApi, { recursive: true, force: true });
mkdirSync(swaApi, { recursive: true });

const pnpm = process.platform === "win32" ? "npx pnpm" : "pnpm";
execSync(`${pnpm} --filter @microbootcan/shared build && ${pnpm} --filter @microbootcan/api build`, {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

const apiPkg = JSON.parse(readFileSync(join(apiRoot, "package.json"), "utf8"));
const entry = join(apiRoot, "dist/src/index.js");
if (!existsSync(entry)) {
  throw new Error(`Missing API build output: ${entry}`);
}

execSync(
  `npx --yes @vercel/ncc build "${entry}" -o "${swaApi}" -e @azure/functions`,
  {
    cwd: root,
    stdio: "inherit",
    shell: true,
  },
);

cpSync(join(apiRoot, "host.json"), join(swaApi, "host.json"));

writeFileSync(
  join(swaApi, "package.json"),
  `${JSON.stringify(
    {
      name: "microbootcan-swa-api",
      version: "0.1.0",
      private: true,
      main: "index.js",
      type: "commonjs",
      dependencies: {
        "@azure/functions": apiPkg.dependencies["@azure/functions"],
      },
      engines: { node: ">=20" },
    },
    null,
    2,
  )}\n`,
);

writeFileSync(join(swaApi, ".funcignore"), ["**/*.map", "**/*.ts", "src/"].join("\n"));

execSync("npm install --omit=dev --no-audit --no-fund", {
  cwd: swaApi,
  stdio: "inherit",
  shell: true,
});

if (!existsSync(join(swaApi, "index.js"))) {
  throw new Error("swa-api bundle missing index.js");
}

function countFiles(dir) {
  let count = 0;
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) count += countFiles(path);
    else count += 1;
  }
  return count;
}

console.log(`swa-api bundle ready (${countFiles(swaApi)} files)`);

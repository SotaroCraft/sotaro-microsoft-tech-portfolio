#!/usr/bin/env node
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const swaApi = join(root, "swa-api");

if (existsSync(swaApi)) rmSync(swaApi, { recursive: true, force: true });

execSync("pnpm --filter @microbootcan/api --prod deploy swa-api", {
  cwd: root,
  stdio: "inherit",
});

const pkgPath = join(swaApi, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.dependencies["@microbootcan/shared"] = "file:./node_modules/@microbootcan/shared";
delete pkg.devDependencies;
pkg.engines = { node: ">=20" };
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

writeFileSync(
  join(swaApi, ".funcignore"),
  ["**/*.map", "**/*.ts", "src/", "local.settings.json"].join("\n"),
);

if (!existsSync(join(swaApi, "dist/src/index.js"))) {
  throw new Error("swa-api bundle missing dist/src/index.js — run pnpm build first");
}

console.log("swa-api bundle ready");

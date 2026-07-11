#!/usr/bin/env node
/**
 * Copy registry-referenced SVGs from resources/Icons/ → apps/web/public/architecture-icons/
 * Run: pnpm sync:icons
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const registryPath = join(
  root,
  "packages/shared/src/architecture/icon-registry.ts",
);
const resourcesRoot = join(root, "resources/Icons");
const deployDir = join(root, "apps/web/public/architecture-icons");

const SOURCE_PATH_RE = /sourcePath:\s*"([a-z]+\/[^"]+\.svg)"/g;

function loadSourcePaths() {
  const source = readFileSync(registryPath, "utf8");
  const paths = new Set();

  for (const match of source.matchAll(SOURCE_PATH_RE)) {
    paths.add(match[1]);
  }

  if (paths.size === 0) {
    throw new Error(`No sourcePath entries found in ${registryPath}`);
  }

  return [...paths];
}

function main() {
  if (!existsSync(resourcesRoot)) {
    console.warn(
      "resources/Icons/ not found — skip sync (deploy bundle may already exist).",
    );
    process.exit(0);
  }

  const sourcePaths = loadSourcePaths();
  mkdirSync(deployDir, { recursive: true });

  let copied = 0;
  let missing = 0;
  const deployed = new Set();

  for (const relativePath of sourcePaths) {
    const src = join(resourcesRoot, relativePath);
    const iconId = basename(relativePath);
    const dest = join(deployDir, iconId);

    if (!existsSync(src)) {
      console.error(`Missing: ${relativePath}`);
      missing++;
      continue;
    }

    copyFileSync(src, dest);
    deployed.add(iconId);
    copied++;
    console.log(iconId);
  }

  for (const file of readdirSync(deployDir)) {
    if (!deployed.has(file)) {
      rmSync(join(deployDir, file));
      console.log(`removed stale ${file}`);
    }
  }

  console.log(`\nDone: ${copied} copied, ${missing} missing → ${deployDir}`);
  if (missing > 0) process.exit(1);
}

main();

#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { buildMockArchitectureResponse } = require("../packages/shared/dist/index.js");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "apps/web/public/architecture.mock.json");
const payload = buildMockArchitectureResponse();

writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Wrote ${outPath}`);

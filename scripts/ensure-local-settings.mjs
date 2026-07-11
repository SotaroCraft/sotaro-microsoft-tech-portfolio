/**
 * Ensure api/local.settings.json exists (gitignored) from the example template.
 * Optionally bring up Docker deps (Cosmos Emulator + Azurite).
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const settingsPath = path.join(root, "api", "local.settings.json");
const examplePath = path.join(root, "api", "local.settings.json.example");

const EMULATOR_KEY =
  "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";

if (!existsSync(examplePath)) {
  console.error("Missing api/local.settings.json.example");
  process.exit(1);
}

if (!existsSync(settingsPath)) {
  copyFileSync(examplePath, settingsPath);
  console.log("Created api/local.settings.json from example");
} else {
  try {
    const parsed = JSON.parse(readFileSync(settingsPath, "utf8"));
    const values = parsed.Values ?? {};
    let changed = false;
    if (!values.COSMOS_KEY) {
      values.COSMOS_KEY = EMULATOR_KEY;
      changed = true;
    }
    if (values.NODE_TLS_REJECT_UNAUTHORIZED === undefined) {
      values.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      changed = true;
    }
    if (values.DEV_AUTH_BYPASS === undefined) {
      values.DEV_AUTH_BYPASS = "true";
      changed = true;
    }
    if (values.AI_PROVIDER === undefined) {
      values.AI_PROVIDER = "mock";
      changed = true;
    }
    if (changed) {
      parsed.Values = values;
      writeFileSync(settingsPath, `${JSON.stringify(parsed, null, 2)}\n`);
      console.log("Updated api/local.settings.json (filled local defaults)");
    } else {
      console.log("api/local.settings.json already present");
    }
  } catch {
    console.log("api/local.settings.json already present");
  }
}

const skipDocker = process.argv.includes("--skip-docker");
if (!skipDocker) {
  const result = spawnSync("docker", ["compose", "up", "-d"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    console.warn(
      "\n[warn] docker compose up failed. Start Cosmos Emulator (+ Azurite) manually for API data.\n",
    );
  }
}

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

/** Resolve docker CLI when Desktop is installed but PATH is not refreshed yet. */
function resolveDockerCommand() {
  if (process.env.DOCKER_BIN?.trim()) {
    return process.env.DOCKER_BIN.trim();
  }
  const candidates = [
    "docker",
    process.platform === "win32"
      ? "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe"
      : null,
  ].filter(Boolean);
  for (const cmd of candidates) {
    const probe = spawnSync(cmd, ["--version"], { encoding: "utf8" });
    if (probe.status === 0) return cmd;
  }
  return "docker";
}

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

const skipDocker =
  process.argv.includes("--skip-docker") ||
  ["1", "true", "yes"].includes(
    (process.env.SKIP_DOCKER ?? "").trim().toLowerCase(),
  );

if (!skipDocker) {
  const docker = resolveDockerCommand();
  const dockerEnv = { ...process.env };
  if (process.platform === "win32") {
    const dockerBin =
      "C:\\Program Files\\Docker\\Docker\\resources\\bin";
    const dockerCli = "C:\\Program Files\\Docker\\cli-plugins";
    dockerEnv.Path = `${dockerBin};${dockerCli};${dockerEnv.Path ?? ""}`;
  }
  const result = spawnSync(docker, ["compose", "up", "-d"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: dockerEnv,
  });
  if (result.status !== 0) {
    console.warn(
      `\n[warn] docker compose up failed (${docker}). Start Cosmos Emulator (+ Azurite) manually for API data.\n`,
    );
  } else {
    console.log("Docker deps started (Cosmos Emulator + Azurite)");
  }
}

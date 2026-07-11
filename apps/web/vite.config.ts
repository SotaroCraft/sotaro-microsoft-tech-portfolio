import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { localAuthBypassPlugin } from "./src/vite/localAuthBypassPlugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  return {
    plugins: [react(), localAuthBypassPlugin()],
    resolve: {
      alias: {
        "@microstar/shared": path.resolve(
          __dirname,
          "../../packages/shared/src/index.ts",
        ),
      },
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:7071",
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: "dist",
    },
  };
});

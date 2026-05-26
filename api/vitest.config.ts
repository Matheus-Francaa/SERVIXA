import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    environment: "node",
    env: {
      BASE_URL: "http://localhost:3456",
      SERVIXA_DB_PATH: "./servixa.test.db",
    },
  },
});

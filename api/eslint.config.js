import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["src/**/*.ts", "tests/**/*.ts"],
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
      "prefer-const": "warn",
      "no-var": "error",
    },
  },
  {
    ignores: ["node_modules/*", "dist/*", "drizzle/*"],
  },
]);

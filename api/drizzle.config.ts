import { defineConfig } from "drizzle-kit";

const dbUrl = process.env.SERVIXA_DB_PATH || "./servixa.db";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: dbUrl,
  },
});

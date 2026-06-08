import { unlinkSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const TEST_DB = "./servixa.test.db";

if (existsSync(TEST_DB)) {
  unlinkSync(TEST_DB);
  console.log("Removed existing test database");
}

execSync("pnpm exec drizzle-kit push", {
  env: { ...process.env, SERVIXA_DB_PATH: TEST_DB },
  stdio: "inherit",
});

// Seed test DB with categories and services
execSync(
  `node --import tsx -e "
    import Database from 'better-sqlite3';
    import { drizzle } from 'drizzle-orm/better-sqlite3';
    import * as schema from './src/schema.js';
    import { seedDatabase } from './src/db/seed.js';
    const sqlite = new Database('${TEST_DB}');
    const db = drizzle(sqlite, { schema });
    seedDatabase(db).then(() => console.log('Test DB seeded!')).catch(console.error);
  "`,
  { stdio: "inherit" },
);

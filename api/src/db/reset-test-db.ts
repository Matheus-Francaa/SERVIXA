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

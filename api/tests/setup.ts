import { beforeAll } from "vitest";

const TEST_DB_PATH = "./servixa.test.db";

beforeAll(() => {
  process.env.SERVIXA_DB_PATH = TEST_DB_PATH;
  process.env.BASE_URL = "http://localhost:3456";
});

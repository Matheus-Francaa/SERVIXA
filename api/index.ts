require("./db/patch");

const express = require("express");
const cors = require("cors");
const { betterAuth } = require("better-auth");
const { toNodeHandler } = require("better-auth/node");
const { drizzleAdapter } = require("@better-auth/drizzle-adapter");
const { drizzle } = require("drizzle-orm/better-sqlite3");
const Database = require("better-sqlite3");

const schema = require("./db/schema");

const sqlite = new Database("./servixa.db");
const db = drizzle(sqlite, { schema });

const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  baseURL: process.env.BASE_URL || "http://localhost:3000",
  usePlural: false,
  emailAndPassword: {
    enabled: true,
  },
});

const app = express();

app.use(cors());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

require("./routes/services")(app, db, auth);
require("./routes/categories")(app, db);
require("./routes/orders")(app, db, auth);
require("./routes/conversations")(app, db, auth);
require("./routes/favorites")(app, db, auth);
require("./routes/users")(app, db, auth);

const port = 3000;
app.listen(port, () => {
  console.log(`Servixa API running on http://localhost:${port}`);
});

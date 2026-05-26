import express, { type Express } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import type { DB } from "./types.js";
import { db } from "./db.js";
import { auth, getAuthInstance } from "./auth.js";
import { config } from "./config.js";
import { errorHandler } from "./middleware/error.js";
import { createServicesRouter } from "./routes/services.js";
import { createCategoriesRouter } from "./routes/categories.js";
import { createOrdersRouter } from "./routes/orders.js";
import { createConversationsRouter } from "./routes/conversations.js";
import { createFavoritesRouter } from "./routes/favorites.js";
import { createUsersRouter } from "./routes/users.js";

type Deps = {
  db?: DB;
};

export function createApp(deps?: Deps): Express {
  const database = deps?.db ?? db;
  const app = express();

  app.use(cors({ origin: config.trustedOrigins }));

  app.use("/api/auth", toNodeHandler(getAuthInstance()));

  app.use(express.json());

  app.use("/api/services", createServicesRouter(database, auth));
  app.use("/api", createCategoriesRouter(database));
  app.use("/api", createOrdersRouter(database, auth));
  app.use("/api", createConversationsRouter(database, auth));
  app.use("/api/favorites", createFavoritesRouter(database, auth));
  app.use("/api", createUsersRouter(database, auth));

  app.use(errorHandler);

  return app;
}

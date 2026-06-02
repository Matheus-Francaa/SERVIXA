import { Router } from "express";
import type { DB } from "../types.js";
import { categories } from "../schema.js";

export function createCategoriesRouter(db: DB): Router {
  const router = Router();

  router.get("/categories", async (_req, res) => {
    const result = await db.select().from(categories);
    res.json(result);
  });

  return router;
}

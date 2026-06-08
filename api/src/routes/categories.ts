import { Router } from "express";
import type { DB } from "../types.js";
import { createCategoriesService } from "../services/categories.service.js";

export function createCategoriesRouter(db: DB): Router {
  const router = Router();
  const categoriesService = createCategoriesService(db);

  router.get("/categories", async (_req, res) => {
    const result = await categoriesService.list();
    res.json(result);
  });

  return router;
}

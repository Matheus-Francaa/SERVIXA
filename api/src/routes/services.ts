import { Router } from "express";
import type { DB } from "../types.js";
import type { AuthInstance } from "../auth.js";
import { createServicesService } from "../services/services.service.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createServiceSchema } from "../validators/service.js";

export function createServicesRouter(db: DB, auth: AuthInstance): Router {
  const router = Router();
  const servicesService = createServicesService(db);

  router.get("/", async (req, res) => {
    const categoryId = req.query.category as string | undefined;
    const result = await servicesService.list(categoryId);
    res.json(result);
  });

  router.get("/:id", async (req, res) => {
    const result = await servicesService.findById(req.params.id as string);
    res.json(result);
  });

  router.post("/", requireAuth(auth), validate(createServiceSchema), async (req, res) => {
    const result = await servicesService.create(req.body, {
      id: req.user!.id,
      name: req.user!.name,
    });
    res.status(201).json(result);
  });

  router.post("/:id/favorite", requireAuth(auth), async (req, res) => {
    const result = await servicesService.toggleFavorite(
      req.params.id as string,
      req.user!.id,
    );
    res.json(result);
  });

  router.get("/:id/favorite", requireAuth(auth), async (req, res) => {
    const result = await servicesService.getFavoriteStatus(
      req.params.id as string,
      req.user!.id,
    );
    res.json(result);
  });

  return router;
}

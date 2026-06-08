import { Router } from "express";
import type { DB } from "../types.js";
import type { AuthInstance } from "../auth.js";
import { createServicesService } from "../services/services.service.js";
import { requireAuth } from "../middleware/auth.js";

export function createFavoritesRouter(db: DB, auth: AuthInstance): Router {
  const router = Router();
  const servicesService = createServicesService(db);

  router.get("/", requireAuth(auth), async (req, res) => {
    const result = await servicesService.listFavorites(req.user!.id);
    res.json(result);
  });

  return router;
}

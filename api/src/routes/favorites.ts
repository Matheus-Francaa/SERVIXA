import { Router } from "express";
import { eq, inArray } from "drizzle-orm";
import type { DB } from "../types.js";
import type { AuthInstance } from "../auth.js";
import { favorites, services } from "../schema.js";
import { requireAuth } from "../middleware/auth.js";

export function createFavoritesRouter(db: DB, auth: AuthInstance): Router {
  const router = Router();

  router.get("/", requireAuth(auth), async (req, res) => {
    const result = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, req.user!.id))
      .orderBy(favorites.createdAt);

    const serviceIds = result.map((f) => f.serviceId);
    if (serviceIds.length === 0) {
      res.json([]);
      return;
    }

    const svcs = await db
      .select()
      .from(services)
      .where(inArray(services.id, serviceIds));

    res.json(svcs);
  });

  return router;
}

import { Router } from "express";
import type { DB } from "../types.js";
import type { AuthInstance } from "../auth.js";
import { createUsersService } from "../services/users.service.js";
import { requireAuth } from "../middleware/auth.js";

export function createUsersRouter(db: DB, auth: AuthInstance): Router {
  const router = Router();
  const usersService = createUsersService(db);

  router.get("/users/me", requireAuth(auth), async (req, res) => {
    const user = await usersService.findById(req.user!.id);
    res.json(user);
  });

  router.get("/prestadores/:id", async (req, res) => {
    const profile = await usersService.getPublicProfile(req.params.id as string);
    res.json(profile);
  });

  return router;
}

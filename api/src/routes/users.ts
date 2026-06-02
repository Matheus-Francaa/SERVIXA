import { Router } from "express";
import { eq } from "drizzle-orm";
import type { DB } from "../types.js";
import type { AuthInstance } from "../auth.js";
import { users } from "../schema.js";
import { NotFoundError } from "../lib/errors.js";
import { requireAuth } from "../middleware/auth.js";

export function createUsersRouter(db: DB, auth: AuthInstance): Router {
  const router = Router();

  router.get("/users/me", requireAuth(auth), async (req, res) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user!.id))
      .limit(1);

    if (!user) throw new NotFoundError("Usuário não encontrado");
    res.json(user);
  });

  router.get("/prestadores/:id", async (req, res) => {
    const id = req.params.id as string;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) throw new NotFoundError("Prestador não encontrado");
    res.json({ id: user.id, name: user.name, image: user.image, email: user.email });
  });

  return router;
}

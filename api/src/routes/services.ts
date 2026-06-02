import { Router } from "express";
import crypto from "node:crypto";
import { eq, desc, sql } from "drizzle-orm";
import type { DB } from "../types.js";
import type { AuthInstance } from "../auth.js";
import { services, favorites } from "../schema.js";
import { NotFoundError } from "../lib/errors.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createServiceSchema } from "../validators/service.js";

export function createServicesRouter(db: DB, auth: AuthInstance): Router {
  const router = Router();

  router.get("/", async (req, res) => {
    const categoryId = req.query.category;
    const where = categoryId ? eq(services.categoryId, Number(categoryId)) : undefined;

    const result = await db
      .select()
      .from(services)
      .where(where)
      .orderBy(desc(services.createdAt));

    res.json(result);
  });

  router.get("/:id", async (req, res) => {
    const id = req.params.id as string;

    const [result] = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    if (!result) throw new NotFoundError("Serviço não encontrado");

    res.json(result);
  });

  router.post("/", requireAuth(auth), validate(createServiceSchema), async (req, res) => {
    const { title, description, price, location, imageUrl, categoryId } = req.body;

    const newService = {
      id: crypto.randomUUID(),
      title,
      description,
      price,
      location,
      imageUrl,
      categoryId,
      userId: req.user!.id,
      prestador: req.user!.name,
      avaliacao: "5.0",
      avaliacoes: "0",
      data: new Date().toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      createdAt: new Date().toISOString(),
    };

    await db.insert(services).values(newService);
    res.status(201).json(newService);
  });

  router.post("/:id/favorite", requireAuth(auth), async (req, res) => {
    const serviceId = req.params.id as string;
    const userId = req.user!.id;

    const [existing] = await db
      .select()
      .from(favorites)
      .where(
        sql`${favorites.userId} = ${userId} AND ${favorites.serviceId} = ${serviceId}`,
      )
      .limit(1);

    if (existing) {
      await db
        .delete(favorites)
        .where(
          sql`${favorites.userId} = ${userId} AND ${favorites.serviceId} = ${serviceId}`,
        );
      res.json({ favorited: false });
    } else {
      await db.insert(favorites).values({
        userId,
        serviceId,
        createdAt: new Date().toISOString(),
      });
      res.json({ favorited: true });
    }
  });

  router.get("/:id/favorite", requireAuth(auth), async (req, res) => {
    const serviceId = req.params.id as string;
    const userId = req.user!.id;

    const [existing] = await db
      .select()
      .from(favorites)
      .where(
        sql`${favorites.userId} = ${userId} AND ${favorites.serviceId} = ${serviceId}`,
      )
      .limit(1);

    res.json({ favorited: !!existing });
  });

  return router;
}

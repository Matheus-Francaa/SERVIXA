import { Router } from "express";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import type { DB } from "../types.js";
import type { AuthInstance } from "../auth.js";
import { orders, services } from "../schema.js";
import { NotFoundError } from "../lib/errors.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { checkoutSchema } from "../validators/order.js";

export function createOrdersRouter(db: DB, auth: AuthInstance): Router {
  const router = Router();

  router.post("/checkout", requireAuth(auth), validate(checkoutSchema), async (req, res) => {
    const { serviceId, paymentMethod, amount, serviceFee, total } = req.body;

    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, serviceId))
      .limit(1);

    if (!service) throw new NotFoundError("Serviço não encontrado");

    const order = {
      id: crypto.randomUUID(),
      serviceId,
      userId: req.user!.id,
      paymentMethod,
      amount,
      serviceFee,
      total,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    await db.insert(orders).values(order);
    res.status(201).json(order);
  });

  router.get("/orders", requireAuth(auth), async (req, res) => {
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, req.user!.id))
      .orderBy(orders.createdAt);

    res.json(result);
  });

  router.get("/orders/:id", requireAuth(auth), async (req, res) => {
    const id = req.params.id as string;

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (!order) throw new NotFoundError("Pedido não encontrado");
    res.json(order);
  });

  return router;
}

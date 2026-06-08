import { Router } from "express";
import type { DB } from "../types.js";
import type { AuthInstance } from "../auth.js";
import { createOrdersService } from "../services/orders.service.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { checkoutSchema } from "../validators/order.js";

export function createOrdersRouter(db: DB, auth: AuthInstance): Router {
  const router = Router();
  const ordersService = createOrdersService(db);

  router.post("/checkout", requireAuth(auth), validate(checkoutSchema), async (req, res) => {
    const order = await ordersService.checkout(req.body, req.user!.id);
    res.status(201).json(order);
  });

  router.get("/orders", requireAuth(auth), async (req, res) => {
    const result = await ordersService.listByUser(req.user!.id);
    res.json(result);
  });

  router.get("/orders/:id", requireAuth(auth), async (req, res) => {
    const order = await ordersService.findById(req.params.id as string);
    res.json(order);
  });

  return router;
}

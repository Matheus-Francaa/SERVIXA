import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import type { DB } from "../types.js";
import { orders, services } from "../schema.js";
import { NotFoundError } from "../lib/errors.js";

export type CheckoutInput = {
  serviceId: string;
  paymentMethod: string;
  amount: number;
  serviceFee?: number;
  total: number;
};

export function createOrdersService(db: DB) {
  return {
    async checkout(input: CheckoutInput, userId: string) {
      const [service] = await db
        .select()
        .from(services)
        .where(eq(services.id, input.serviceId))
        .limit(1);

      if (!service) throw new NotFoundError("Serviço não encontrado");

      const order = {
        id: crypto.randomUUID(),
        serviceId: input.serviceId,
        userId,
        paymentMethod: input.paymentMethod,
        amount: input.amount,
        serviceFee: input.serviceFee ?? 0,
        total: input.total,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      await db.insert(orders).values(order);
      return order;
    },

    async listByUser(userId: string) {
      return db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(orders.createdAt);
    },

    async findById(id: string) {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, id))
        .limit(1);

      if (!order) throw new NotFoundError("Pedido não encontrado");
      return order;
    },
  };
}

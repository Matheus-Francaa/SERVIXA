const crypto = require("crypto");
const { orders, services } = require("../db/schema");
const { eq } = require("drizzle-orm");
const { requireAuth } = require("../middleware/auth");

module.exports = function (app, db, auth) {
  app.post("/api/checkout", requireAuth(auth), async (req, res) => {
    try {
      const { serviceId, paymentMethod, amount, serviceFee, total } = req.body;
      if (!serviceId || !paymentMethod || !amount || !total) {
        return res.status(400).json({ error: "Campos obrigatórios: serviceId, paymentMethod, amount, total" });
      }
      const [service] = await db
        .select()
        .from(services)
        .where(eq(services.id, serviceId))
        .limit(1);
      if (!service) return res.status(404).json({ error: "Serviço não encontrado" });

      const order = {
        id: crypto.randomUUID(),
        serviceId,
        userId: req.user.id,
        paymentMethod,
        amount: parseFloat(amount),
        serviceFee: parseFloat(serviceFee || 0),
        total: parseFloat(total),
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };
      await db.insert(orders).values(order);
      res.status(201).json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/orders", requireAuth(auth), async (req, res) => {
    try {
      const result = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, req.user.id))
        .orderBy(orders.createdAt);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/orders/:id", requireAuth(auth), async (req, res) => {
    try {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, req.params.id))
        .limit(1);
      if (!order) return res.status(404).json({ error: "Pedido não encontrado" });
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

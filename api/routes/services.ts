const crypto = require("crypto");
const { services, favorites } = require("../db/schema");
const { eq, sql } = require("drizzle-orm");
const { requireAuth, optionalAuth } = require("../middleware/auth");

module.exports = function (app, db, auth) {
  app.get("/api/services", async (req, res) => {
    try {
      const categoryId = req.query.category;
      const where = categoryId ? eq(services.categoryId, parseInt(categoryId)) : undefined;
      const result = await db
        .select()
        .from(services)
        .where(where)
        .orderBy(sql`random()`);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const [result] = await db
        .select()
        .from(services)
        .where(eq(services.id, req.params.id))
        .limit(1);
      if (!result) return res.status(404).json({ error: "Serviço não encontrado" });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/services", requireAuth(auth), async (req, res) => {
    try {
      const { title, description, price, location, imageUrl, categoryId } = req.body;
      if (!title || !price || !location || !categoryId) {
        return res.status(400).json({ error: "Campos obrigatórios: title, price, location, categoryId" });
      }
      const newService = {
        id: crypto.randomUUID(),
        title,
        description: description || "",
        price,
        location,
        imageUrl: imageUrl || "https://picsum.photos/seed/service/400/300",
        categoryId: parseInt(categoryId),
        userId: req.user.id,
        prestador: req.user.name,
        avaliacao: "5.0",
        avaliacoes: "0",
        data: new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" }),
        createdAt: new Date().toISOString(),
      };
      await db.insert(services).values(newService);
      res.status(201).json(newService);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/services/:id/favorite", requireAuth(auth), async (req, res) => {
    try {
      const serviceId = req.params.id;
      const userId = req.user.id;
      const [existing] = await db
        .select()
        .from(favorites)
        .where(sql`${favorites.userId} = ${userId} AND ${favorites.serviceId} = ${serviceId}`)
        .limit(1);
      if (existing) {
        await db.delete(favorites)
          .where(sql`${favorites.userId} = ${userId} AND ${favorites.serviceId} = ${serviceId}`);
        res.json({ favorited: false });
      } else {
        await db.insert(favorites).values({
          userId,
          serviceId,
          createdAt: new Date().toISOString(),
        });
        res.json({ favorited: true });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/services/:id/favorite", requireAuth(auth), async (req, res) => {
    try {
      const [existing] = await db
        .select()
        .from(favorites)
        .where(sql`${favorites.userId} = ${req.user.id} AND ${favorites.serviceId} = ${req.params.id}`)
        .limit(1);
      res.json({ favorited: !!existing });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

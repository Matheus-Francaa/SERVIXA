const { favorites, services } = require("../db/schema");
const { eq, inArray } = require("drizzle-orm");
const { requireAuth } = require("../middleware/auth");

module.exports = function (app, db, auth) {
  app.get("/api/favorites", requireAuth(auth), async (req, res) => {
    try {
      const result = await db
        .select()
        .from(favorites)
        .where(eq(favorites.userId, req.user.id))
        .orderBy(favorites.createdAt);
      const serviceIds = result.map((f) => f.serviceId);
      if (serviceIds.length === 0) return res.json([]);
      const svcs = await db
        .select()
        .from(services)
        .where(inArray(services.id, serviceIds));
      res.json(svcs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

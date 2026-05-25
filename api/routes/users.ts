const { users, services } = require("../db/schema");
const { eq } = require("drizzle-orm");
const { requireAuth } = require("../middleware/auth");

module.exports = function (app, db, auth) {
  app.get("/api/users/me", requireAuth(auth), async (req, res) => {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, req.user.id))
        .limit(1);
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/prestadores/:id", async (req, res) => {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, req.params.id))
        .limit(1);
      if (!user) return res.status(404).json({ error: "Prestador não encontrado" });
      res.json({ id: user.id, name: user.name, image: user.image, email: user.email });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

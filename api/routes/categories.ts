const { categories } = require("../db/schema");

module.exports = function (app, db) {
  app.get("/api/categories", async (req, res) => {
    try {
      const result = await db.select().from(categories);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

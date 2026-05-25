const crypto = require("crypto");
const { conversations, messages, users } = require("../db/schema");
const { eq, and, or, desc } = require("drizzle-orm");
const { requireAuth } = require("../middleware/auth");

module.exports = function (app, db, auth) {
  app.get("/api/conversations", requireAuth(auth), async (req, res) => {
    try {
      const result = await db
        .select()
        .from(conversations)
        .where(
          or(
            eq(conversations.userId, req.user.id),
            eq(conversations.prestadorId, req.user.id)
          )
        )
        .orderBy(desc(conversations.lastMessageAt));
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/conversations", requireAuth(auth), async (req, res) => {
    try {
      const { prestadorId } = req.body;
      if (!prestadorId) {
        return res.status(400).json({ error: "prestadorId é obrigatório" });
      }
      const [existing] = await db
        .select()
        .from(conversations)
        .where(
          and(
            eq(conversations.userId, req.user.id),
            eq(conversations.prestadorId, prestadorId)
          )
        )
        .limit(1);
      if (existing) return res.json(existing);

      const conv = {
        id: crypto.randomUUID(),
        userId: req.user.id,
        prestadorId,
        createdAt: new Date().toISOString(),
      };
      await db.insert(conversations).values(conv);
      res.status(201).json(conv);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/conversations/:id/messages", requireAuth(auth), async (req, res) => {
    try {
      const result = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, req.params.id))
        .orderBy(messages.timestamp);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/conversations/:id/messages", requireAuth(auth), async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: "text é obrigatório" });

      const msg = {
        id: crypto.randomUUID(),
        conversationId: req.params.id,
        senderId: req.user.id,
        text,
        timestamp: new Date().toISOString(),
      };
      await db.insert(messages).values(msg);
      await db
        .update(conversations)
        .set({ lastMessage: text, lastMessageAt: new Date().toISOString() })
        .where(eq(conversations.id, req.params.id));
      res.status(201).json(msg);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

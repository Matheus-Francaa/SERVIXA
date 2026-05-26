import { Router } from "express";
import crypto from "node:crypto";
import { eq, and, or, desc } from "drizzle-orm";
import type { DB } from "../types.js";
import type { AuthInstance } from "../auth.js";
import { conversations, messages } from "../schema.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createConversationSchema, sendMessageSchema } from "../validators/conversation.js";

export function createConversationsRouter(db: DB, auth: AuthInstance): Router {
  const router = Router();

  router.get("/conversations", requireAuth(auth), async (req, res) => {
    const result = await db
      .select()
      .from(conversations)
      .where(
        or(
          eq(conversations.userId, req.user!.id),
          eq(conversations.prestadorId, req.user!.id),
        ),
      )
      .orderBy(desc(conversations.lastMessageAt));

    res.json(result);
  });

  router.post("/conversations", requireAuth(auth), validate(createConversationSchema), async (req, res) => {
    const { prestadorId } = req.body;

    const [existing] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.userId, req.user!.id),
          eq(conversations.prestadorId, prestadorId),
        ),
      )
      .limit(1);

    if (existing) {
      res.json(existing);
      return;
    }

    const conv = {
      id: crypto.randomUUID(),
      userId: req.user!.id,
      prestadorId,
      createdAt: new Date().toISOString(),
    };

    await db.insert(conversations).values(conv);
    res.status(201).json(conv);
  });

  router.get("/conversations/:id/messages", requireAuth(auth), async (req, res) => {
    const conversationId = req.params.id as string;

    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.timestamp);

    res.json(result);
  });

  router.post("/conversations/:id/messages", requireAuth(auth), validate(sendMessageSchema), async (req, res) => {
    const conversationId = req.params.id as string;
    const { text } = req.body;

    const msg = {
      id: crypto.randomUUID(),
      conversationId,
      senderId: req.user!.id,
      text,
      timestamp: new Date().toISOString(),
    };

    await db.insert(messages).values(msg);
    await db
      .update(conversations)
      .set({ lastMessage: text, lastMessageAt: new Date().toISOString() })
      .where(eq(conversations.id, conversationId));

    res.status(201).json(msg);
  });

  return router;
}

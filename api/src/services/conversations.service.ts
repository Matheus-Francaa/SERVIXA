import crypto from "node:crypto";
import { eq, and, or, desc } from "drizzle-orm";
import type { DB } from "../types.js";
import { conversations, messages } from "../schema.js";

export function createConversationsService(db: DB) {
  return {
    async listByUser(userId: string) {
      return db
        .select()
        .from(conversations)
        .where(
          or(
            eq(conversations.userId, userId),
            eq(conversations.prestadorId, userId),
          ),
        )
        .orderBy(desc(conversations.lastMessageAt));
    },

    async findOrCreate(userId: string, prestadorId: string) {
      const [existing] = await db
        .select()
        .from(conversations)
        .where(
          and(
            eq(conversations.userId, userId),
            eq(conversations.prestadorId, prestadorId),
          ),
        )
        .limit(1);

      if (existing) return { conversation: existing, created: false };

      const conv = {
        id: crypto.randomUUID(),
        userId,
        prestadorId,
        createdAt: new Date().toISOString(),
      };

      await db.insert(conversations).values(conv);
      return { conversation: conv, created: true };
    },

    async listMessages(conversationId: string) {
      return db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conversationId))
        .orderBy(messages.timestamp);
    },

    async sendMessage(conversationId: string, senderId: string, text: string) {
      const msg = {
        id: crypto.randomUUID(),
        conversationId,
        senderId,
        text,
        timestamp: new Date().toISOString(),
      };

      await db.insert(messages).values(msg);
      await db
        .update(conversations)
        .set({ lastMessage: text, lastMessageAt: new Date().toISOString() })
        .where(eq(conversations.id, conversationId));

      return msg;
    },
  };
}

import { Router } from "express";
import type { DB } from "../types.js";
import type { AuthInstance } from "../auth.js";
import { createConversationsService } from "../services/conversations.service.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createConversationSchema, sendMessageSchema } from "../validators/conversation.js";

export function createConversationsRouter(db: DB, auth: AuthInstance): Router {
  const router = Router();
  const conversationsService = createConversationsService(db);

  router.get("/conversations", requireAuth(auth), async (req, res) => {
    const result = await conversationsService.listByUser(req.user!.id);
    res.json(result);
  });

  router.post("/conversations", requireAuth(auth), validate(createConversationSchema), async (req, res) => {
    const { conversation, created } = await conversationsService.findOrCreate(
      req.user!.id,
      req.body.prestadorId,
    );
    res.status(created ? 201 : 200).json(conversation);
  });

  router.get("/conversations/:id/messages", requireAuth(auth), async (req, res) => {
    const result = await conversationsService.listMessages(req.params.id as string);
    res.json(result);
  });

  router.post("/conversations/:id/messages", requireAuth(auth), validate(sendMessageSchema), async (req, res) => {
    const msg = await conversationsService.sendMessage(
      req.params.id as string,
      req.user!.id,
      req.body.text,
    );
    res.status(201).json(msg);
  });

  return router;
}

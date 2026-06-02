import { z } from "zod";

export const createConversationSchema = z.object({
  prestadorId: z.string().min(1, "prestadorId é obrigatório"),
});

export const sendMessageSchema = z.object({
  text: z.string().min(1, "text é obrigatório"),
});

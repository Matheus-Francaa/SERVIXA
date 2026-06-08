import { z } from "zod";

export const createServiceSchema = z.object({
  title: z.string().min(1, "title é obrigatório"),
  description: z.string().optional().default(""),
  price: z.coerce.number().positive("price é obrigatório"),
  location: z.string().min(1, "location é obrigatório"),
  imageUrl: z.string().optional().default("https://picsum.photos/seed/service/400/300"),
  categoryId: z.coerce.number().int().positive("categoryId é obrigatório"),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

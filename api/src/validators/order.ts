import { z } from "zod";

export const checkoutSchema = z.object({
  serviceId: z.string().min(1, "serviceId é obrigatório"),
  paymentMethod: z.string().min(1, "paymentMethod é obrigatório"),
  amount: z.coerce.number().positive("amount é obrigatório"),
  serviceFee: z.coerce.number().optional().default(0),
  total: z.coerce.number().positive("total é obrigatório"),
});

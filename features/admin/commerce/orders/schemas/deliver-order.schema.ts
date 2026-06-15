import { z } from "zod";

export const deliverOrderSchema = z.object({
  orderId: z.string().trim().min(1, "Commande introuvable."),
});

export type DeliverOrderInput = z.infer<typeof deliverOrderSchema>;

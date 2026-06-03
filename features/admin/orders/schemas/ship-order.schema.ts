import { z } from "zod";

export const shipOrderSchema = z.object({
  orderId: z.string().trim().min(1, "Commande introuvable."),
  trackingReference: z.string().trim().max(120, "Référence de suivi trop longue.").nullable(),
});

export type ShipOrderInput = z.infer<typeof shipOrderSchema>;

import { z } from "zod";

const ADMIN_ORDER_STATUSES = ["pending", "paid", "preparing", "shipped", "cancelled"] as const;

export const updateOrderStatusSchema = z.object({
  orderId: z.string().trim().min(1, "Commande introuvable."),
  nextStatus: z.enum(ADMIN_ORDER_STATUSES),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

import { z } from "zod";

export const adminPaymentActionSchema = z.object({
  paymentId: z.string().trim().min(1, "Paiement introuvable."),
});

export type AdminPaymentActionInput = z.infer<typeof adminPaymentActionSchema>;

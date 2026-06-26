import { z } from "zod";

export const createWebhookEndpointSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(100, "Le nom ne peut pas dépasser 100 caractères."),
  targetUrl: z.string().url("L'URL cible doit être une URL valide (http ou https)."),
  eventType: z
    .string()
    .trim()
    .min(1, "Le type d'événement est requis.")
    .max(100, "Le type d'événement ne peut pas dépasser 100 caractères."),
});

export type CreateWebhookEndpointInput = z.infer<typeof createWebhookEndpointSchema>;

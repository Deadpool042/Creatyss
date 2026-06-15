import { z } from "zod";

/**
 * Niveau `basic` (cf.
 * `docs/lots/2026-06-13-engagement-newsletter-automations-cadrage.md`,
 * décision B1) : ajout manuel d'un abonné référentiel. Aucune campagne,
 * aucun envoi d'email.
 */
export const createNewsletterSubscriberSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "L'email est requis.")
    .max(255, "L'email est trop long (255 caractères maximum).")
    .email("Email invalide."),
  firstName: z
    .string()
    .trim()
    .max(120, "Le prénom est trop long (120 caractères maximum).")
    .nullable(),
  lastName: z
    .string()
    .trim()
    .max(120, "Le nom est trop long (120 caractères maximum).")
    .nullable(),
});

export type CreateNewsletterSubscriberInput = z.infer<typeof createNewsletterSubscriberSchema>;

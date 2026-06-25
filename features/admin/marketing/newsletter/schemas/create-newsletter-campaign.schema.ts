import { z } from "zod";

/**
 * Schéma de création d'une `NewsletterCampaign` en statut DRAFT.
 * Niveau `basic` — cf. `docs/lots/2026-06-13-engagement-newsletter-automations-cadrage.md`.
 */
export const createNewsletterCampaignSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom est requis (minimum 2 caractères).")
    .max(200, "Le nom est trop long (200 caractères maximum)."),
  subjectLine: z
    .string()
    .trim()
    .min(2, "L'objet est requis (minimum 2 caractères).")
    .max(200, "L'objet est trop long (200 caractères maximum)."),
  previewText: z
    .string()
    .trim()
    .max(300, "Le texte de prévisualisation est trop long (300 caractères maximum).")
    .optional(),
  bodyHtml: z
    .string()
    .trim()
    .min(10, "Le corps HTML est requis (minimum 10 caractères).")
    .max(500_000, "Le corps HTML est trop long."),
  bodyText: z.string().trim().max(500_000, "Le corps texte est trop long.").optional(),
});

export type CreateNewsletterCampaignInput = z.infer<typeof createNewsletterCampaignSchema>;

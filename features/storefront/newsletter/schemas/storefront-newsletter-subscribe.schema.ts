import { z } from "zod";

/**
 * Souscription publique newsletter depuis la homepage.
 * Lot borné : email seul, sans double opt-in ni campagne.
 */
export const storefrontNewsletterSubscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "L'email est requis.")
    .max(255, "L'email est trop long (255 caractères maximum).")
    .email("Email invalide."),
});

export type StorefrontNewsletterSubscribeInput = z.infer<
  typeof storefrontNewsletterSubscribeSchema
>;

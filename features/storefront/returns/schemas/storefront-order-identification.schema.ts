import { z } from "zod";

/**
 * Identification d'une commande storefront par référence + email, sans
 * motif ni lignes — utilisé pour la liste des lignes de commande affichées
 * avant sélection (étape 2 du parcours de retour). Miroir volontaire de la
 * partie identification de `storefrontReturnEligibilitySchema`.
 */
export const storefrontOrderIdentificationSchema = z.object({
  reference: z.string().trim().min(1, "La référence de commande est requise."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "L'email est requis.")
    .max(255, "L'email est trop long (255 caractères maximum).")
    .email("Email invalide."),
});

export type StorefrontOrderIdentificationInput = z.infer<
  typeof storefrontOrderIdentificationSchema
>;

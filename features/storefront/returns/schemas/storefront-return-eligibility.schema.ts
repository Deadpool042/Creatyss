import { z } from "zod";

import { RETURN_REASON_CATEGORY_VALUES } from "@/features/commerce/returns/domain/return-eligibility.types";

/**
 * Vérification d'éligibilité au retour storefront à partir d'une référence
 * de commande et d'un email. `reason` est déjà une catégorie tranchée
 * (`ReturnReasonCategory`) — le mapping depuis un texte libre saisi par la
 * cliente relève d'un lot ultérieur (action serveur / UI), pas de ce schéma.
 *
 * `requestedLines` est optionnel : absent, la vérification porte sur la
 * commande entière (« au moins une ligne potentiellement retournable » —
 * cf. `determineAnyLineReturnEligibility`) ; présent, elle qualifie une
 * demande précise (`determineReturnEligibility`). Un tableau vide reste
 * invalide dans les deux cas — ce n'est jamais une absence silencieuse.
 */
export const storefrontReturnEligibilitySchema = z.object({
  reference: z.string().trim().min(1, "La référence de commande est requise."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "L'email est requis.")
    .max(255, "L'email est trop long (255 caractères maximum).")
    .email("Email invalide."),
  reason: z.enum(RETURN_REASON_CATEGORY_VALUES),
  requestedLines: z
    .array(
      z.object({
        orderLineId: z.string().trim().min(1, "L'identifiant de ligne est requis."),
        quantity: z.number().int().positive("La quantité doit être un entier strictement positif."),
      })
    )
    .min(1, "Au moins une ligne de retour est requise.")
    .optional(),
});

export type StorefrontReturnEligibilityInput = z.infer<typeof storefrontReturnEligibilitySchema>;

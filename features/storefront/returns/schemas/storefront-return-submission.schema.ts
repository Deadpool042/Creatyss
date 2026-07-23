import { z } from "zod";

import { RETURN_REASON_CATEGORY_VALUES } from "@/features/commerce/returns/domain/return-eligibility.types";

/**
 * Soumission d'une demande de retour storefront (étape 2 du parcours) : la
 * commande est ré-identifiée côté serveur à partir de `reference`/`email` —
 * jamais d'`orderId` transmis par le client. `lines` porte la sélection
 * réelle de la cliente (jamais un résultat d'éligibilité client).
 */
export const storefrontReturnSubmissionSchema = z.object({
  reference: z.string().trim().min(1, "La référence de commande est requise."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "L'email est requis.")
    .max(255, "L'email est trop long (255 caractères maximum).")
    .email("Email invalide."),
  reason: z.enum(RETURN_REASON_CATEGORY_VALUES),
  lines: z
    .array(
      z.object({
        orderLineId: z.string().trim().min(1, "L'identifiant de ligne est requis."),
        quantity: z.number().int().positive("La quantité doit être un entier strictement positif."),
      })
    )
    .min(1, "Au moins une ligne de retour est requise."),
});

export type StorefrontReturnSubmissionInput = z.infer<typeof storefrontReturnSubmissionSchema>;

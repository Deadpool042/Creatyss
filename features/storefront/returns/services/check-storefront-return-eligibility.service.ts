import "server-only";

import { determineReturnEligibility } from "@/features/commerce/returns/domain/determine-return-eligibility";
import type { ReturnEligibilityResult } from "@/features/commerce/returns/domain/return-eligibility.types";
import { identifyOrderForReturn } from "@/features/commerce/returns/queries/identify-order-for-return.query";
import {
  storefrontReturnEligibilitySchema,
  type StorefrontReturnEligibilityInput,
} from "@/features/storefront/returns/schemas/storefront-return-eligibility.schema";

export type CheckStorefrontReturnEligibilityResult =
  | Readonly<{ ok: false }>
  | Readonly<{ ok: true; eligibility: ReturnEligibilityResult }>;

const NOT_OK: CheckStorefrontReturnEligibilityResult = { ok: false };

/**
 * Vérifie l'éligibilité au retour storefront : identifie la commande puis
 * qualifie la demande, sans jamais créer de `ReturnRequest`.
 *
 * Contrat de sécurité : en cas d'entrée invalide ou de commande non
 * identifiée (référence inconnue, email erroné ou commande introuvable),
 * retourne systématiquement `{ ok: false }` — jamais de détail permettant de
 * distinguer ces causes, jamais de modèle Prisma brut.
 */
export async function checkStorefrontReturnEligibility(
  input: StorefrontReturnEligibilityInput
): Promise<CheckStorefrontReturnEligibilityResult> {
  const parsed = storefrontReturnEligibilitySchema.safeParse(input);
  if (!parsed.success) {
    return NOT_OK;
  }

  const identified = await identifyOrderForReturn({
    reference: parsed.data.reference,
    email: parsed.data.email,
  });

  if (identified.outcome === "NOT_IDENTIFIED") {
    return NOT_OK;
  }

  const eligibility = determineReturnEligibility({
    order: { status: identified.order.status, lines: identified.order.lines },
    shipment: identified.order.shipment,
    existingReturnRequests: identified.order.existingReturnRequests,
    reason: parsed.data.reason,
    requestedLines: parsed.data.requestedLines,
  });

  return { ok: true, eligibility };
}

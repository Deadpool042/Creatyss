"use server";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import type { ReturnEligibilityOutcome } from "@/features/commerce/returns/domain/return-eligibility.types";
import { storefrontReturnEligibilitySchema } from "@/features/storefront/returns/schemas/storefront-return-eligibility.schema";
import { checkStorefrontReturnEligibility } from "@/features/storefront/returns/services/check-storefront-return-eligibility.service";

export type CheckStorefrontReturnEligibilityActionResult =
  | Readonly<{ available: false }>
  | Readonly<{
      available: true;
      eligibility: Readonly<{ outcome: ReturnEligibilityOutcome }>;
    }>;

const UNAVAILABLE: CheckStorefrontReturnEligibilityActionResult = { available: false };

/**
 * Contrat de sécurité : que la cause soit une feature inactive, une entrée
 * invalide ou une commande non identifiée, la réponse publique est
 * systématiquement `{ available: false }` — jamais de détail permettant de
 * distinguer ces causes ni d'énumérer une commande.
 */
export async function checkStorefrontReturnEligibilityAction(
  input: unknown
): Promise<CheckStorefrontReturnEligibilityActionResult> {
  const featureActive = await meetsFeatureLevel("commerce.returns", "manual");
  if (!featureActive) {
    return UNAVAILABLE;
  }

  const parsed = storefrontReturnEligibilitySchema.safeParse(input);
  if (!parsed.success) {
    return UNAVAILABLE;
  }

  const result = await checkStorefrontReturnEligibility(parsed.data);
  if (!result.ok) {
    return UNAVAILABLE;
  }

  return {
    available: true,
    eligibility: { outcome: result.eligibility.outcome },
  };
}

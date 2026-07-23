"use server";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { storefrontReturnSubmissionSchema } from "@/features/storefront/returns/schemas/storefront-return-submission.schema";
import { submitStorefrontReturnRequest } from "@/features/storefront/returns/services/submit-storefront-return-request.service";

export type SubmitStorefrontReturnRequestActionResult =
  | Readonly<{ available: false }>
  | Readonly<{ available: true; status: "SUBMITTED" }>;

const UNAVAILABLE: SubmitStorefrontReturnRequestActionResult = { available: false };

/**
 * Contrat de sécurité : que la cause soit une feature inactive, une entrée
 * invalide, une commande non identifiée, une issue `INELIGIBLE` ou un échec
 * technique, la réponse publique est systématiquement `{ available: false }`
 * — jamais de détail, jamais de `returnNumber`.
 */
export async function submitStorefrontReturnRequestAction(
  input: unknown
): Promise<SubmitStorefrontReturnRequestActionResult> {
  const featureActive = await meetsFeatureLevel("commerce.returns", "manual");
  if (!featureActive) {
    return UNAVAILABLE;
  }

  const parsed = storefrontReturnSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return UNAVAILABLE;
  }

  const result = await submitStorefrontReturnRequest(parsed.data);
  if (!result.ok) {
    return UNAVAILABLE;
  }

  return { available: true, status: "SUBMITTED" };
}

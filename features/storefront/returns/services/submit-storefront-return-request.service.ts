import "server-only";

import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  CreateReturnRequestError,
  createReturnRequest,
} from "@/features/admin/commerce/returns/services/create-return-request.service";
import { determineReturnEligibility } from "@/features/commerce/returns/domain/determine-return-eligibility";
import { identifyOrderForReturn } from "@/features/commerce/returns/queries/identify-order-for-return.query";
import {
  storefrontReturnSubmissionSchema,
  type StorefrontReturnSubmissionInput,
} from "@/features/storefront/returns/schemas/storefront-return-submission.schema";

export type SubmitStorefrontReturnRequestResult = Readonly<{ ok: boolean }>;

const NOT_OK: SubmitStorefrontReturnRequestResult = { ok: false };
const OK: SubmitStorefrontReturnRequestResult = { ok: true };

/**
 * Soumet une demande de retour storefront (étape 2 du parcours). Ne fait
 * jamais confiance à un `orderId` ni à un résultat d'éligibilité transmis
 * par le client :
 *
 * 1. ré-identifie la commande (référence + email) ;
 * 2. ré-évalue l'éligibilité avec les lignes réellement choisies par la
 *    cliente ;
 * 3. route selon l'issue — `ELIGIBLE` et `MANUAL_REVIEW` créent tous deux la
 *    demande (statut `REQUESTED`, traitée ensuite par l'admin), seul
 *    `INELIGIBLE` bloque.
 *
 * Contrat de sécurité : en cas d'entrée invalide, de commande non
 * identifiée, d'issue `INELIGIBLE` ou d'échec de création (ex. demande déjà
 * active, détectée en base au moment de l'écriture), retourne
 * systématiquement `{ ok: false }` — jamais de détail permettant de
 * distinguer ces causes.
 */
export async function submitStorefrontReturnRequest(
  input: StorefrontReturnSubmissionInput
): Promise<SubmitStorefrontReturnRequestResult> {
  const parsed = storefrontReturnSubmissionSchema.safeParse(input);
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
    requestedLines: parsed.data.lines,
  });

  if (eligibility.outcome === "INELIGIBLE") {
    return NOT_OK;
  }

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return NOT_OK;
  }

  try {
    await createReturnRequest({
      orderId: identified.order.orderId,
      storeId,
      lines: parsed.data.lines,
      reasonCode: parsed.data.reason,
    });
  } catch (error) {
    if (error instanceof CreateReturnRequestError) {
      return NOT_OK;
    }
    throw error;
  }

  return OK;
}

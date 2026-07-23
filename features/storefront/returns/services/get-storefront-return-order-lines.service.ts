import "server-only";

import { calculateReturnableQuantities } from "@/features/commerce/returns/domain/calculate-return-quantities";
import { getOrderLineLabelsForReturn } from "@/features/commerce/returns/queries/get-order-line-labels-for-return.query";
import { identifyOrderForReturn } from "@/features/commerce/returns/queries/identify-order-for-return.query";
import {
  storefrontOrderIdentificationSchema,
  type StorefrontOrderIdentificationInput,
} from "@/features/storefront/returns/schemas/storefront-order-identification.schema";

export type StorefrontReturnOrderLine = {
  orderLineId: string;
  productName: string;
  variantName: string | null;
  /** Quantité encore disponible pour un retour sur cette ligne. */
  remainingQuantity: number;
};

export type GetStorefrontReturnOrderLinesResult =
  | Readonly<{ ok: false }>
  | Readonly<{ ok: true; lines: ReadonlyArray<StorefrontReturnOrderLine> }>;

const NOT_OK: GetStorefrontReturnOrderLinesResult = { ok: false };

/**
 * Ré-identifie la commande (référence + email, jamais un `orderId` transmis
 * par le client) et renvoie les lignes encore disponibles pour un retour,
 * avec leurs libellés produit — pour l'affichage du formulaire de sélection
 * (étape 2 du parcours de retour storefront). Ne crée jamais de
 * `ReturnRequest` et ne qualifie aucune éligibilité : cette étape sert
 * uniquement à peupler le formulaire, la décision réelle est reprise en
 * intégralité à la soumission.
 *
 * Contrat de sécurité : en cas d'entrée invalide, de commande non identifiée
 * ou d'absence de ligne encore disponible, retourne systématiquement
 * `{ ok: false }`.
 */
export async function getStorefrontReturnOrderLines(
  input: StorefrontOrderIdentificationInput
): Promise<GetStorefrontReturnOrderLinesResult> {
  const parsed = storefrontOrderIdentificationSchema.safeParse(input);
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

  const quantities = calculateReturnableQuantities(
    identified.order.lines,
    identified.order.existingReturnRequests
  );
  const labels = await getOrderLineLabelsForReturn(identified.order.orderId);
  const labelByLineId = new Map(labels.map((label) => [label.orderLineId, label]));

  const lines: StorefrontReturnOrderLine[] = [];
  for (const line of identified.order.lines) {
    const remainingQuantity = quantities.remainingByLineId.get(line.orderLineId) ?? 0;
    if (remainingQuantity <= 0) {
      continue;
    }
    const label = labelByLineId.get(line.orderLineId);
    if (label === undefined) {
      continue;
    }
    lines.push({
      orderLineId: line.orderLineId,
      productName: label.productName,
      variantName: label.variantName,
      remainingQuantity,
    });
  }

  if (lines.length === 0) {
    return NOT_OK;
  }

  return { ok: true, lines };
}

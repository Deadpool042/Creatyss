import { calculateReturnableQuantities } from "@/features/commerce/returns/domain/calculate-return-quantities";
import { isActiveReturnRequestStatus } from "@/features/commerce/returns/domain/return-active-statuses";
import {
  WITHDRAWAL_PERIOD_DAYS,
  type ReturnEligibilityInput,
  type ReturnEligibilityResult,
} from "@/features/commerce/returns/domain/return-eligibility.types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function result(
  outcome: ReturnEligibilityResult["outcome"],
  code: ReturnEligibilityResult["code"],
  message: string,
  daysSinceDelivery: number | null = null
): ReturnEligibilityResult {
  return {
    outcome,
    code,
    message,
    details: { daysSinceDelivery, withdrawalPeriodDays: WITHDRAWAL_PERIOD_DAYS },
  };
}

/**
 * Détermine si une demande de retour storefront serait autorisée.
 *
 * Fonction pure : aucun accès base de données, aucun appel service, aucune
 * dépendance UI. Toutes les entrées sont des objets de domaine construits
 * par l'appelant (cf. `identifyOrderForReturn` pour leur assemblage réel).
 *
 * Ne crée jamais de `ReturnRequest` — se contente de qualifier la demande.
 */
export function determineReturnEligibility(input: ReturnEligibilityInput): ReturnEligibilityResult {
  const now = input.now ?? new Date();

  if (input.order.status === "CANCELLED") {
    return result("INELIGIBLE", "ORDER_CANCELLED", "La commande associée est annulée.");
  }

  if (input.order.status === "ARCHIVED") {
    return result("INELIGIBLE", "ORDER_ARCHIVED", "La commande associée est archivée.");
  }

  const hasActiveRequest = input.existingReturnRequests.some((request) =>
    isActiveReturnRequestStatus(request.status)
  );
  if (hasActiveRequest) {
    return result(
      "INELIGIBLE",
      "ACTIVE_REQUEST_EXISTS",
      "Une demande de retour est déjà active pour cette commande."
    );
  }

  if (input.requestedLines.length === 0) {
    return result("INELIGIBLE", "INVALID_QUANTITY", "Aucune ligne de retour demandée.");
  }

  const quantities = calculateReturnableQuantities(input.order.lines, input.existingReturnRequests);

  const requestedQuantityByLineId = new Map<string, number>();
  for (const requestedLine of input.requestedLines) {
    if (!Number.isInteger(requestedLine.quantity) || requestedLine.quantity <= 0) {
      return result(
        "INELIGIBLE",
        "INVALID_QUANTITY",
        `Quantité invalide pour la ligne ${requestedLine.orderLineId}.`
      );
    }
    requestedQuantityByLineId.set(
      requestedLine.orderLineId,
      (requestedQuantityByLineId.get(requestedLine.orderLineId) ?? 0) + requestedLine.quantity
    );
  }

  if (
    quantities.status === "UNCERTAIN" &&
    [...requestedQuantityByLineId.keys()].some((lineId) => quantities.uncertainLineIds.has(lineId))
  ) {
    return result(
      "MANUAL_REVIEW",
      "QUANTITY_UNCERTAIN",
      "La quantité déjà consommée par des retours existants ne peut pas être attribuée de façon fiable à une ligne."
    );
  }

  for (const [orderLineId, requestedQuantity] of requestedQuantityByLineId) {
    const remaining = quantities.remainingByLineId.get(orderLineId);
    if (remaining === undefined) {
      return result(
        "INELIGIBLE",
        "INVALID_QUANTITY",
        `Ligne de commande introuvable : ${orderLineId}.`
      );
    }

    if (requestedQuantity > remaining) {
      return result(
        "INELIGIBLE",
        "INVALID_QUANTITY",
        `Quantité demandée supérieure à la quantité disponible pour la ligne ${orderLineId}.`
      );
    }
  }

  if (input.reason !== "WITHDRAWAL") {
    return result(
      "MANUAL_REVIEW",
      "MANUAL_REVIEW_REQUIRED",
      "Ce motif nécessite systématiquement une revue manuelle."
    );
  }

  if (input.shipment === null) {
    return result(
      "MANUAL_REVIEW",
      "NO_SHIPMENT_RECORDED",
      "Aucune expédition connue pour cette commande."
    );
  }

  if (input.shipment.deliveredAt === null) {
    return result(
      "MANUAL_REVIEW",
      "DELIVERY_UNKNOWN",
      "Aucune date de livraison fiable connue pour cette commande."
    );
  }

  const daysSinceDelivery = Math.floor(
    (now.getTime() - input.shipment.deliveredAt.getTime()) / MS_PER_DAY
  );

  if (daysSinceDelivery <= WITHDRAWAL_PERIOD_DAYS) {
    return result(
      "ELIGIBLE",
      "WITHDRAWAL_PERIOD_VALID",
      "Délai de rétractation respecté.",
      daysSinceDelivery
    );
  }

  return result(
    "INELIGIBLE",
    "WITHDRAWAL_PERIOD_EXPIRED",
    "Délai de rétractation de 14 jours dépassé.",
    daysSinceDelivery
  );
}

import { describe, expect, it } from "vitest";

import { determineReturnEligibility } from "@/features/commerce/returns/domain/determine-return-eligibility";
import type { ReturnEligibilityInput } from "@/features/commerce/returns/domain/return-eligibility.types";

const NOW = new Date("2026-07-18T00:00:00.000Z");

function baseInput(overrides: Partial<ReturnEligibilityInput> = {}): ReturnEligibilityInput {
  return {
    order: { status: "COMPLETED", lines: [{ orderLineId: "line-1", quantity: 2 }] },
    shipment: { deliveredAt: new Date("2026-07-10T00:00:00.000Z") }, // 8 jours avant NOW
    existingReturnRequests: [],
    reason: "WITHDRAWAL",
    requestedLines: [{ orderLineId: "line-1", quantity: 1 }],
    now: NOW,
    ...overrides,
  };
}

describe("determineReturnEligibility", () => {
  it("est ELIGIBLE dans le délai de rétractation de 14 jours", () => {
    const outcome = determineReturnEligibility(baseInput());

    expect(outcome.outcome).toBe("ELIGIBLE");
    expect(outcome.code).toBe("WITHDRAWAL_PERIOD_VALID");
    expect(outcome.details.daysSinceDelivery).toBe(8);
  });

  it("est INELIGIBLE au-delà du délai de rétractation de 14 jours", () => {
    const outcome = determineReturnEligibility(
      baseInput({ shipment: { deliveredAt: new Date("2026-06-01T00:00:00.000Z") } })
    );

    expect(outcome.outcome).toBe("INELIGIBLE");
    expect(outcome.code).toBe("WITHDRAWAL_PERIOD_EXPIRED");
  });

  it("est INELIGIBLE si la commande est annulée, avant toute autre règle", () => {
    const outcome = determineReturnEligibility(
      baseInput({
        order: { status: "CANCELLED", lines: [{ orderLineId: "line-1", quantity: 2 }] },
      })
    );

    expect(outcome.outcome).toBe("INELIGIBLE");
    expect(outcome.code).toBe("ORDER_CANCELLED");
  });

  it("est INELIGIBLE si la commande est archivée, même avec une livraison connue, un délai valide et des quantités valides", () => {
    const outcome = determineReturnEligibility(
      baseInput({
        order: { status: "ARCHIVED", lines: [{ orderLineId: "line-1", quantity: 2 }] },
        shipment: { deliveredAt: new Date("2026-07-10T00:00:00.000Z") },
        requestedLines: [{ orderLineId: "line-1", quantity: 1 }],
      })
    );

    expect(outcome.outcome).toBe("INELIGIBLE");
    expect(outcome.code).toBe("ORDER_ARCHIVED");
  });

  it("est MANUAL_REVIEW si aucun Shipment n'existe pour la commande", () => {
    const outcome = determineReturnEligibility(baseInput({ shipment: null }));

    expect(outcome.outcome).toBe("MANUAL_REVIEW");
    expect(outcome.code).toBe("NO_SHIPMENT_RECORDED");
  });

  it("est MANUAL_REVIEW si le Shipment existe sans date de livraison connue", () => {
    const outcome = determineReturnEligibility(baseInput({ shipment: { deliveredAt: null } }));

    expect(outcome.outcome).toBe("MANUAL_REVIEW");
    expect(outcome.code).toBe("DELIVERY_UNKNOWN");
  });

  it("est INELIGIBLE si une demande de retour active existe déjà", () => {
    const outcome = determineReturnEligibility(
      baseInput({ existingReturnRequests: [{ status: "UNDER_REVIEW", items: [] }] })
    );

    expect(outcome.outcome).toBe("INELIGIBLE");
    expect(outcome.code).toBe("ACTIVE_REQUEST_EXISTS");
  });

  it("est INELIGIBLE pour une quantité nulle", () => {
    const outcome = determineReturnEligibility(
      baseInput({ requestedLines: [{ orderLineId: "line-1", quantity: 0 }] })
    );

    expect(outcome.outcome).toBe("INELIGIBLE");
    expect(outcome.code).toBe("INVALID_QUANTITY");
  });

  it("est INELIGIBLE pour une quantité négative", () => {
    const outcome = determineReturnEligibility(
      baseInput({ requestedLines: [{ orderLineId: "line-1", quantity: -1 }] })
    );

    expect(outcome.outcome).toBe("INELIGIBLE");
    expect(outcome.code).toBe("INVALID_QUANTITY");
  });

  it("est INELIGIBLE pour une quantité supérieure à la quantité disponible", () => {
    const outcome = determineReturnEligibility(
      baseInput({ requestedLines: [{ orderLineId: "line-1", quantity: 3 }] })
    );

    expect(outcome.outcome).toBe("INELIGIBLE");
    expect(outcome.code).toBe("INVALID_QUANTITY");
  });

  it("cumule deux entrées identiques dont la somme reste disponible (ligne à quantité commandée 2)", () => {
    const outcome = determineReturnEligibility(
      baseInput({
        requestedLines: [
          { orderLineId: "line-1", quantity: 1 },
          { orderLineId: "line-1", quantity: 1 },
        ],
      })
    );

    expect(outcome.outcome).toBe("ELIGIBLE");
  });

  it("est INELIGIBLE quand deux entrées identiques dépassent la quantité disponible une fois cumulées", () => {
    const outcome = determineReturnEligibility(
      baseInput({
        order: { status: "COMPLETED", lines: [{ orderLineId: "line-1", quantity: 1 }] },
        requestedLines: [
          { orderLineId: "line-1", quantity: 1 },
          { orderLineId: "line-1", quantity: 1 },
        ],
      })
    );

    expect(outcome.outcome).toBe("INELIGIBLE");
    expect(outcome.code).toBe("INVALID_QUANTITY");
  });

  it("est INELIGIBLE pour un cumul invalide sur des doublons mêlés à une autre ligne valide", () => {
    const outcome = determineReturnEligibility(
      baseInput({
        order: {
          status: "COMPLETED",
          lines: [
            { orderLineId: "line-1", quantity: 1 },
            { orderLineId: "line-2", quantity: 5 },
          ],
        },
        requestedLines: [
          { orderLineId: "line-2", quantity: 2 },
          { orderLineId: "line-1", quantity: 1 },
          { orderLineId: "line-1", quantity: 1 },
        ],
      })
    );

    expect(outcome.outcome).toBe("INELIGIBLE");
    expect(outcome.code).toBe("INVALID_QUANTITY");
  });

  it("est INELIGIBLE quand chaque quantité individuelle est valide mais le cumul par ligne ne l'est pas", () => {
    const outcome = determineReturnEligibility(
      baseInput({
        order: { status: "COMPLETED", lines: [{ orderLineId: "line-1", quantity: 2 }] },
        requestedLines: [
          { orderLineId: "line-1", quantity: 2 },
          { orderLineId: "line-1", quantity: 1 },
        ],
      })
    );

    expect(outcome.outcome).toBe("INELIGIBLE");
    expect(outcome.code).toBe("INVALID_QUANTITY");
  });

  it("est MANUAL_REVIEW si la quantité disponible ne peut pas être calculée de façon fiable", () => {
    const outcome = determineReturnEligibility(
      baseInput({
        existingReturnRequests: [{ status: "CLOSED", items: [{ orderLineId: null, quantity: 1 }] }],
      })
    );

    expect(outcome.outcome).toBe("MANUAL_REVIEW");
    expect(outcome.code).toBe("QUANTITY_UNCERTAIN");
  });

  it("est MANUAL_REVIEW pour un motif de défaut produit, jamais un calcul de délai", () => {
    const outcome = determineReturnEligibility(
      baseInput({
        reason: "PRODUCT_DEFECT",
        shipment: { deliveredAt: new Date("2026-01-01T00:00:00.000Z") }, // très ancien, hors délai
      })
    );

    expect(outcome.outcome).toBe("MANUAL_REVIEW");
    expect(outcome.code).toBe("MANUAL_REVIEW_REQUIRED");
    expect(outcome.details.daysSinceDelivery).toBeNull();
  });

  it("est MANUAL_REVIEW pour un motif de dommage transport, jamais un calcul de délai", () => {
    const outcome = determineReturnEligibility(
      baseInput({
        reason: "TRANSPORT_DAMAGE",
        shipment: { deliveredAt: new Date("2026-01-01T00:00:00.000Z") },
      })
    );

    expect(outcome.outcome).toBe("MANUAL_REVIEW");
    expect(outcome.code).toBe("MANUAL_REVIEW_REQUIRED");
  });

  it("n'est jamais INELIGIBLE pour un produit potentiellement personnalisé (motif OTHER)", () => {
    const outcome = determineReturnEligibility(baseInput({ reason: "OTHER" }));

    expect(outcome.outcome).toBe("MANUAL_REVIEW");
    expect(outcome.outcome).not.toBe("INELIGIBLE");
  });

  it("est pure : mêmes entrées, même résultat, sans effet de bord", () => {
    const input = baseInput();
    const first = determineReturnEligibility(input);
    const second = determineReturnEligibility(input);

    expect(first).toEqual(second);
    // Aucune mutation des entrées.
    expect(input).toEqual(baseInput());
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

import type * as DetermineReturnEligibilityModule from "@/features/commerce/returns/domain/determine-return-eligibility";

vi.mock(
  "@/features/commerce/returns/domain/determine-return-eligibility",
  async (importOriginal) => {
    const actual = await importOriginal<typeof DetermineReturnEligibilityModule>();
    return { determineReturnEligibility: vi.fn(actual.determineReturnEligibility) };
  }
);

import {
  determineAnyLineReturnEligibility,
  type AnyLineReturnEligibilityInput,
} from "@/features/commerce/returns/domain/determine-any-line-return-eligibility";
import { determineReturnEligibility } from "@/features/commerce/returns/domain/determine-return-eligibility";
import { WITHDRAWAL_PERIOD_DAYS } from "@/features/commerce/returns/domain/return-eligibility.types";

const mockDetermineReturnEligibility = determineReturnEligibility as ReturnType<typeof vi.fn>;

const NOW = new Date("2026-07-18T00:00:00.000Z");

function baseInput(
  overrides: Partial<AnyLineReturnEligibilityInput> = {}
): AnyLineReturnEligibilityInput {
  return {
    order: {
      status: "COMPLETED",
      lines: [{ orderLineId: "line-1", quantity: 2 }],
    },
    shipment: { deliveredAt: new Date("2026-07-10T00:00:00.000Z") }, // 8 jours avant NOW
    existingReturnRequests: [],
    reason: "WITHDRAWAL",
    now: NOW,
    ...overrides,
  };
}

function resultOf(
  outcome: "ELIGIBLE" | "MANUAL_REVIEW" | "INELIGIBLE",
  code: string,
  daysSinceDelivery: number | null = null
) {
  return {
    outcome,
    code,
    message: `stub-${code}`,
    details: { daysSinceDelivery, withdrawalPeriodDays: WITHDRAWAL_PERIOD_DAYS },
  };
}

describe("determineAnyLineReturnEligibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("est ELIGIBLE avec une seule ligne restante et éligible (primitives réelles)", () => {
    const outcome = determineAnyLineReturnEligibility(baseInput());

    expect(outcome.outcome).toBe("ELIGIBLE");
    expect(outcome.code).toBe("WITHDRAWAL_PERIOD_VALID");
    expect(mockDetermineReturnEligibility).toHaveBeenCalledTimes(1);
    expect(mockDetermineReturnEligibility).toHaveBeenCalledWith(
      expect.objectContaining({ requestedLines: [{ orderLineId: "line-1", quantity: 2 }] })
    );
  });

  it("est ELIGIBLE quand une ligne est éligible et une autre inéligible (priorité ELIGIBLE)", () => {
    mockDetermineReturnEligibility
      .mockImplementationOnce(() => resultOf("INELIGIBLE", "WITHDRAWAL_PERIOD_EXPIRED"))
      .mockImplementationOnce(() => resultOf("ELIGIBLE", "WITHDRAWAL_PERIOD_VALID", 8));

    const outcome = determineAnyLineReturnEligibility(
      baseInput({
        order: {
          status: "COMPLETED",
          lines: [
            { orderLineId: "line-1", quantity: 1 },
            { orderLineId: "line-2", quantity: 1 },
          ],
        },
      })
    );

    expect(outcome.outcome).toBe("ELIGIBLE");
    expect(outcome.code).toBe("WITHDRAWAL_PERIOD_VALID");
    expect(mockDetermineReturnEligibility).toHaveBeenCalledTimes(2);
  });

  it("est MANUAL_REVIEW quand aucune ligne n'est éligible mais qu'au moins une est en revue manuelle", () => {
    mockDetermineReturnEligibility
      .mockImplementationOnce(() => resultOf("INELIGIBLE", "WITHDRAWAL_PERIOD_EXPIRED"))
      .mockImplementationOnce(() => resultOf("MANUAL_REVIEW", "NO_SHIPMENT_RECORDED"));

    const outcome = determineAnyLineReturnEligibility(
      baseInput({
        order: {
          status: "COMPLETED",
          lines: [
            { orderLineId: "line-1", quantity: 1 },
            { orderLineId: "line-2", quantity: 1 },
          ],
        },
      })
    );

    expect(outcome.outcome).toBe("MANUAL_REVIEW");
    expect(outcome.code).toBe("NO_SHIPMENT_RECORDED");
  });

  it("priorise ELIGIBLE sur MANUAL_REVIEW quel que soit l'ordre des lignes", () => {
    mockDetermineReturnEligibility
      .mockImplementationOnce(() => resultOf("MANUAL_REVIEW", "NO_SHIPMENT_RECORDED"))
      .mockImplementationOnce(() => resultOf("ELIGIBLE", "WITHDRAWAL_PERIOD_VALID", 8));

    const outcome = determineAnyLineReturnEligibility(
      baseInput({
        order: {
          status: "COMPLETED",
          lines: [
            { orderLineId: "line-1", quantity: 1 },
            { orderLineId: "line-2", quantity: 1 },
          ],
        },
      })
    );

    expect(outcome.outcome).toBe("ELIGIBLE");
    expect(outcome.code).toBe("WITHDRAWAL_PERIOD_VALID");
  });

  it("est INELIGIBLE quand toutes les lignes sont inéligibles (primitives réelles, délai dépassé)", () => {
    const outcome = determineAnyLineReturnEligibility(
      baseInput({ shipment: { deliveredAt: new Date("2026-06-01T00:00:00.000Z") } })
    );

    expect(outcome.outcome).toBe("INELIGIBLE");
    expect(outcome.code).toBe("WITHDRAWAL_PERIOD_EXPIRED");
  });

  it("est INELIGIBLE sans appeler determineReturnEligibility par ligne quand toutes les quantités restantes sont nulles", () => {
    const outcome = determineAnyLineReturnEligibility(
      baseInput({
        order: { status: "COMPLETED", lines: [{ orderLineId: "line-1", quantity: 1 }] },
        existingReturnRequests: [
          { status: "CLOSED", items: [{ orderLineId: "line-1", quantity: 1 }] },
        ],
      })
    );

    expect(outcome.outcome).toBe("INELIGIBLE");
    expect(outcome.code).toBe("INVALID_QUANTITY");
    expect(mockDetermineReturnEligibility).toHaveBeenCalledTimes(1);
    expect(mockDetermineReturnEligibility).toHaveBeenCalledWith(
      expect.objectContaining({ requestedLines: [] })
    );
  });

  it("est MANUAL_REVIEW quand un article de retour orphelin rend la quantité incertaine (primitives réelles)", () => {
    const outcome = determineAnyLineReturnEligibility(
      baseInput({
        existingReturnRequests: [{ status: "CLOSED", items: [{ orderLineId: null, quantity: 1 }] }],
      })
    );

    expect(outcome.outcome).toBe("MANUAL_REVIEW");
    expect(outcome.code).toBe("QUANTITY_UNCERTAIN");
  });

  it("est INELIGIBLE si la commande est annulée, avant toute évaluation par ligne", () => {
    const outcome = determineAnyLineReturnEligibility(
      baseInput({
        order: { status: "CANCELLED", lines: [{ orderLineId: "line-1", quantity: 2 }] },
      })
    );

    expect(outcome.outcome).toBe("INELIGIBLE");
    expect(outcome.code).toBe("ORDER_CANCELLED");
  });

  it("est INELIGIBLE si la commande est archivée", () => {
    const outcome = determineAnyLineReturnEligibility(
      baseInput({
        order: { status: "ARCHIVED", lines: [{ orderLineId: "line-1", quantity: 2 }] },
      })
    );

    expect(outcome.outcome).toBe("INELIGIBLE");
    expect(outcome.code).toBe("ORDER_ARCHIVED");
  });

  it("est INELIGIBLE si une demande de retour active existe déjà", () => {
    const outcome = determineAnyLineReturnEligibility(
      baseInput({ existingReturnRequests: [{ status: "UNDER_REVIEW", items: [] }] })
    );

    expect(outcome.outcome).toBe("INELIGIBLE");
    expect(outcome.code).toBe("ACTIVE_REQUEST_EXISTS");
  });

  it("est MANUAL_REVIEW pour un motif hors rétractation", () => {
    const outcome = determineAnyLineReturnEligibility(baseInput({ reason: "PRODUCT_DEFECT" }));

    expect(outcome.outcome).toBe("MANUAL_REVIEW");
    expect(outcome.code).toBe("MANUAL_REVIEW_REQUIRED");
  });

  it("est INELIGIBLE si le délai de rétractation de 14 jours est dépassé", () => {
    const outcome = determineAnyLineReturnEligibility(
      baseInput({ shipment: { deliveredAt: new Date("2026-01-01T00:00:00.000Z") } })
    );

    expect(outcome.outcome).toBe("INELIGIBLE");
    expect(outcome.code).toBe("WITHDRAWAL_PERIOD_EXPIRED");
  });

  it("ne prétend jamais que toutes les lignes sont éligibles : le résultat reste un ReturnEligibilityResult unique, pas un rapport par ligne", () => {
    const outcome = determineAnyLineReturnEligibility(
      baseInput({
        order: {
          status: "COMPLETED",
          lines: [
            { orderLineId: "line-1", quantity: 1 },
            { orderLineId: "line-2", quantity: 1 },
          ],
        },
      })
    );

    expect(Object.keys(outcome)).toEqual(["outcome", "code", "message", "details"]);
  });
});

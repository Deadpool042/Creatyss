import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/commerce/returns/queries/identify-order-for-return.query", () => ({
  identifyOrderForReturn: vi.fn(),
}));

vi.mock("@/features/commerce/returns/domain/determine-return-eligibility", () => ({
  determineReturnEligibility: vi.fn(),
}));

vi.mock("@/features/commerce/returns/domain/determine-any-line-return-eligibility", () => ({
  determineAnyLineReturnEligibility: vi.fn(),
}));

import { determineAnyLineReturnEligibility } from "@/features/commerce/returns/domain/determine-any-line-return-eligibility";
import { determineReturnEligibility } from "@/features/commerce/returns/domain/determine-return-eligibility";
import { identifyOrderForReturn } from "@/features/commerce/returns/queries/identify-order-for-return.query";
import { checkStorefrontReturnEligibility } from "@/features/storefront/returns/services/check-storefront-return-eligibility.service";

const mockIdentifyOrderForReturn = identifyOrderForReturn as ReturnType<typeof vi.fn>;
const mockDetermineReturnEligibility = determineReturnEligibility as ReturnType<typeof vi.fn>;
const mockDetermineAnyLineReturnEligibility = determineAnyLineReturnEligibility as ReturnType<
  typeof vi.fn
>;

const VALID_INPUT = {
  reference: "CRY-ABC2345678",
  email: "client@example.com",
  reason: "WITHDRAWAL" as const,
  requestedLines: [{ orderLineId: "line-1", quantity: 1 }],
};

const IDENTIFIED_ORDER = {
  orderId: "order-1",
  status: "COMPLETED" as const,
  lines: [{ orderLineId: "line-1", quantity: 2 }],
  shipment: { deliveredAt: new Date("2026-07-10T00:00:00.000Z") },
  existingReturnRequests: [],
};

const ELIGIBILITY_RESULT = {
  outcome: "ELIGIBLE" as const,
  code: "WITHDRAWAL_PERIOD_VALID" as const,
  message: "Délai de rétractation respecté.",
  details: { daysSinceDelivery: 8, withdrawalPeriodDays: 14 },
};

describe("checkStorefrontReturnEligibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne { ok: false } et n'appelle aucune primitive pour une entrée invalide", async () => {
    const result = await checkStorefrontReturnEligibility({
      reference: "",
      email: "not-an-email",
      reason: "WITHDRAWAL",
      requestedLines: [],
    });

    expect(result).toEqual({ ok: false });
    expect(mockIdentifyOrderForReturn).not.toHaveBeenCalled();
    expect(mockDetermineReturnEligibility).not.toHaveBeenCalled();
  });

  it("retourne { ok: false } et n'appelle pas determineReturnEligibility si la commande n'est pas identifiée", async () => {
    mockIdentifyOrderForReturn.mockResolvedValue({ outcome: "NOT_IDENTIFIED" });

    const result = await checkStorefrontReturnEligibility(VALID_INPUT);

    expect(result).toEqual({ ok: false });
    expect(mockDetermineReturnEligibility).not.toHaveBeenCalled();
    // Aucune donnée d'échec exposée : le contrat public reste { ok: false } seul.
    expect(Object.keys(result)).toEqual(["ok"]);
  });

  it("appelle les deux primitives avec les données exactes et retourne le résultat d'éligibilité pour une commande identifiée et éligible", async () => {
    mockIdentifyOrderForReturn.mockResolvedValue({
      outcome: "IDENTIFIED",
      order: IDENTIFIED_ORDER,
    });
    mockDetermineReturnEligibility.mockReturnValue(ELIGIBILITY_RESULT);

    const result = await checkStorefrontReturnEligibility(VALID_INPUT);

    expect(mockIdentifyOrderForReturn).toHaveBeenCalledWith({
      reference: VALID_INPUT.reference,
      email: VALID_INPUT.email,
    });
    expect(mockIdentifyOrderForReturn).toHaveBeenCalledTimes(1);
    expect(mockDetermineReturnEligibility).toHaveBeenCalledWith({
      order: { status: IDENTIFIED_ORDER.status, lines: IDENTIFIED_ORDER.lines },
      shipment: IDENTIFIED_ORDER.shipment,
      existingReturnRequests: IDENTIFIED_ORDER.existingReturnRequests,
      reason: VALID_INPUT.reason,
      requestedLines: VALID_INPUT.requestedLines,
    });
    expect(mockDetermineReturnEligibility).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ok: true, eligibility: ELIGIBILITY_RESULT });
  });

  it("propage sans transformation le résultat métier pour une commande identifiée mais inéligible", async () => {
    const ineligibleResult = {
      outcome: "INELIGIBLE" as const,
      code: "WITHDRAWAL_PERIOD_EXPIRED" as const,
      message: "Délai de rétractation de 14 jours dépassé.",
      details: { daysSinceDelivery: 30, withdrawalPeriodDays: 14 },
    };
    mockIdentifyOrderForReturn.mockResolvedValue({
      outcome: "IDENTIFIED",
      order: IDENTIFIED_ORDER,
    });
    mockDetermineReturnEligibility.mockReturnValue(ineligibleResult);

    const result = await checkStorefrontReturnEligibility(VALID_INPUT);

    expect(result).toEqual({ ok: true, eligibility: ineligibleResult });
  });

  it("n'expose aucun identifiant de commande interne (orderId) dans le résultat public", async () => {
    mockIdentifyOrderForReturn.mockResolvedValue({
      outcome: "IDENTIFIED",
      order: IDENTIFIED_ORDER,
    });
    mockDetermineReturnEligibility.mockReturnValue(ELIGIBILITY_RESULT);

    const result = await checkStorefrontReturnEligibility(VALID_INPUT);

    expect(JSON.stringify(result)).not.toContain(IDENTIFIED_ORDER.orderId);
  });

  it("retourne { ok: false } et n'appelle aucune primitive quand requestedLines est un tableau vide, même avec le reste de l'entrée valide", async () => {
    const result = await checkStorefrontReturnEligibility({
      reference: VALID_INPUT.reference,
      email: VALID_INPUT.email,
      reason: VALID_INPUT.reason,
      requestedLines: [],
    });

    expect(result).toEqual({ ok: false });
    expect(mockIdentifyOrderForReturn).not.toHaveBeenCalled();
    expect(mockDetermineReturnEligibility).not.toHaveBeenCalled();
    expect(mockDetermineAnyLineReturnEligibility).not.toHaveBeenCalled();
  });

  it("accepte une entrée sans requestedLines et appelle determineAnyLineReturnEligibility, jamais determineReturnEligibility", async () => {
    mockIdentifyOrderForReturn.mockResolvedValue({
      outcome: "IDENTIFIED",
      order: IDENTIFIED_ORDER,
    });
    mockDetermineAnyLineReturnEligibility.mockReturnValue(ELIGIBILITY_RESULT);

    const { requestedLines: _omitted, ...inputWithoutLines } = VALID_INPUT;
    const result = await checkStorefrontReturnEligibility(inputWithoutLines);

    expect(mockIdentifyOrderForReturn).toHaveBeenCalledTimes(1);
    expect(mockDetermineAnyLineReturnEligibility).toHaveBeenCalledWith({
      order: { status: IDENTIFIED_ORDER.status, lines: IDENTIFIED_ORDER.lines },
      shipment: IDENTIFIED_ORDER.shipment,
      existingReturnRequests: IDENTIFIED_ORDER.existingReturnRequests,
      reason: VALID_INPUT.reason,
    });
    expect(mockDetermineAnyLineReturnEligibility).toHaveBeenCalledTimes(1);
    expect(mockDetermineReturnEligibility).not.toHaveBeenCalled();
    expect(result).toEqual({ ok: true, eligibility: ELIGIBILITY_RESULT });
  });

  it("retourne { ok: false } sans appeler determineAnyLineReturnEligibility si la commande n'est pas identifiée, requestedLines absent", async () => {
    mockIdentifyOrderForReturn.mockResolvedValue({ outcome: "NOT_IDENTIFIED" });

    const { requestedLines: _omitted, ...inputWithoutLines } = VALID_INPUT;
    const result = await checkStorefrontReturnEligibility(inputWithoutLines);

    expect(result).toEqual({ ok: false });
    expect(mockDetermineAnyLineReturnEligibility).not.toHaveBeenCalled();
  });

  it("n'expose aucun identifiant de commande interne (orderId) quand requestedLines est absent", async () => {
    mockIdentifyOrderForReturn.mockResolvedValue({
      outcome: "IDENTIFIED",
      order: IDENTIFIED_ORDER,
    });
    mockDetermineAnyLineReturnEligibility.mockReturnValue(ELIGIBILITY_RESULT);

    const { requestedLines: _omitted, ...inputWithoutLines } = VALID_INPUT;
    const result = await checkStorefrontReturnEligibility(inputWithoutLines);

    expect(JSON.stringify(result)).not.toContain(IDENTIFIED_ORDER.orderId);
  });
});

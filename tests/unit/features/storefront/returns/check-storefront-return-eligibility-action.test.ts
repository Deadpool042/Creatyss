import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/feature-flags/queries/get-feature-level-state.query", () => ({
  meetsFeatureLevel: vi.fn(),
}));

vi.mock(
  "@/features/storefront/returns/services/check-storefront-return-eligibility.service",
  () => ({
    checkStorefrontReturnEligibility: vi.fn(),
  })
);

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { checkStorefrontReturnEligibilityAction } from "@/features/storefront/returns/actions/check-storefront-return-eligibility-action";
import { checkStorefrontReturnEligibility } from "@/features/storefront/returns/services/check-storefront-return-eligibility.service";

const mockMeetsFeatureLevel = meetsFeatureLevel as ReturnType<typeof vi.fn>;
const mockCheckStorefrontReturnEligibility = checkStorefrontReturnEligibility as ReturnType<
  typeof vi.fn
>;

const VALID_INPUT = {
  reference: "CRY-ABC2345678",
  email: "client@example.com",
  reason: "WITHDRAWAL" as const,
  requestedLines: [{ orderLineId: "line-1", quantity: 1 }],
};

const ELIGIBILITY_RESULT = {
  outcome: "ELIGIBLE" as const,
  code: "WITHDRAWAL_PERIOD_VALID" as const,
  message: "Délai de rétractation respecté.",
  details: { daysSinceDelivery: 8, withdrawalPeriodDays: 14 },
};

describe("checkStorefrontReturnEligibilityAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne { available: false } sans appeler le service si la feature est inactive", async () => {
    mockMeetsFeatureLevel.mockResolvedValue(false);

    const result = await checkStorefrontReturnEligibilityAction(VALID_INPUT);

    expect(mockMeetsFeatureLevel).toHaveBeenCalledWith("commerce.returns", "manual");
    expect(mockCheckStorefrontReturnEligibility).not.toHaveBeenCalled();
    expect(result).toEqual({ available: false });
    expect(Object.keys(result)).toEqual(["available"]);
  });

  it("retourne { available: false } sans appeler le service pour une entrée invalide, même feature active", async () => {
    mockMeetsFeatureLevel.mockResolvedValue(true);

    const result = await checkStorefrontReturnEligibilityAction({
      reference: "",
      email: "not-an-email",
      reason: "WITHDRAWAL",
      requestedLines: [],
    });

    expect(mockCheckStorefrontReturnEligibility).not.toHaveBeenCalled();
    expect(result).toEqual({ available: false });
  });

  it("propage { available: false } quand la feature est active mais la commande n'est pas identifiée", async () => {
    mockMeetsFeatureLevel.mockResolvedValue(true);
    mockCheckStorefrontReturnEligibility.mockResolvedValue({ ok: false });

    const result = await checkStorefrontReturnEligibilityAction(VALID_INPUT);

    expect(mockCheckStorefrontReturnEligibility).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ available: false });
    expect(Object.keys(result)).toEqual(["available"]);
  });

  it("appelle le service avec les données validées et retourne le résultat d'éligibilité quand la feature est active et la commande identifiée", async () => {
    mockMeetsFeatureLevel.mockResolvedValue(true);
    mockCheckStorefrontReturnEligibility.mockResolvedValue({
      ok: true,
      eligibility: ELIGIBILITY_RESULT,
    });

    const result = await checkStorefrontReturnEligibilityAction(VALID_INPUT);

    expect(mockCheckStorefrontReturnEligibility).toHaveBeenCalledWith(VALID_INPUT);
    expect(mockCheckStorefrontReturnEligibility).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ available: true, eligibility: ELIGIBILITY_RESULT });
  });

  it("transmet au service les données normalisées par le schéma, pas l'entrée brute", async () => {
    mockMeetsFeatureLevel.mockResolvedValue(true);
    mockCheckStorefrontReturnEligibility.mockResolvedValue({
      ok: true,
      eligibility: ELIGIBILITY_RESULT,
    });

    const rawInput = {
      reference: "  CRY-ABC2345678  ",
      email: "  CLIENT@EXAMPLE.COM  ",
      reason: "WITHDRAWAL" as const,
      requestedLines: [{ orderLineId: "  line-1  ", quantity: 1 }],
    };

    await checkStorefrontReturnEligibilityAction(rawInput);

    expect(mockCheckStorefrontReturnEligibility).toHaveBeenCalledWith({
      reference: "CRY-ABC2345678",
      email: "client@example.com",
      reason: "WITHDRAWAL",
      requestedLines: [{ orderLineId: "line-1", quantity: 1 }],
    });
    expect(mockCheckStorefrontReturnEligibility).not.toHaveBeenCalledWith(rawInput);
  });

  it("n'expose jamais orderId ni de modèle Prisma brut dans une réponse indisponible", async () => {
    mockMeetsFeatureLevel.mockResolvedValue(true);
    mockCheckStorefrontReturnEligibility.mockResolvedValue({ ok: false });

    const result = await checkStorefrontReturnEligibilityAction(VALID_INPUT);

    expect(result).not.toHaveProperty("orderId");
    expect(JSON.stringify(result)).not.toContain("orderId");
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/commerce/returns/queries/identify-order-for-return.query", () => ({
  identifyOrderForReturn: vi.fn(),
}));

vi.mock("@/features/commerce/returns/domain/determine-return-eligibility", () => ({
  determineReturnEligibility: vi.fn(),
}));

vi.mock("@/features/admin/store/queries/get-current-store-id.query", () => ({
  getCurrentStoreId: vi.fn(),
}));

vi.mock("@/features/admin/commerce/returns/services/create-return-request.service", async () => {
  class CreateReturnRequestError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "CreateReturnRequestError";
    }
  }
  return {
    createReturnRequest: vi.fn(),
    CreateReturnRequestError,
  };
});

import {
  CreateReturnRequestError,
  createReturnRequest,
} from "@/features/admin/commerce/returns/services/create-return-request.service";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { determineReturnEligibility } from "@/features/commerce/returns/domain/determine-return-eligibility";
import { identifyOrderForReturn } from "@/features/commerce/returns/queries/identify-order-for-return.query";
import { submitStorefrontReturnRequest } from "@/features/storefront/returns/services/submit-storefront-return-request.service";

const mockIdentifyOrderForReturn = identifyOrderForReturn as ReturnType<typeof vi.fn>;
const mockDetermineReturnEligibility = determineReturnEligibility as ReturnType<typeof vi.fn>;
const mockGetCurrentStoreId = getCurrentStoreId as ReturnType<typeof vi.fn>;
const mockCreateReturnRequest = createReturnRequest as ReturnType<typeof vi.fn>;

const VALID_INPUT = {
  reference: "CRY-ABC2345678",
  email: "client@example.com",
  reason: "WITHDRAWAL" as const,
  lines: [{ orderLineId: "line-1", quantity: 1 }],
};

const IDENTIFIED_ORDER = {
  orderId: "order-1",
  status: "COMPLETED" as const,
  lines: [{ orderLineId: "line-1", quantity: 2 }],
  shipment: { deliveredAt: new Date("2026-07-10T00:00:00.000Z") },
  existingReturnRequests: [],
};

describe("submitStorefrontReturnRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne { ok: false } et n'appelle aucune primitive pour une entrée invalide", async () => {
    const result = await submitStorefrontReturnRequest({
      reference: "",
      email: "not-an-email",
      reason: "WITHDRAWAL",
      lines: [],
    });

    expect(result).toEqual({ ok: false });
    expect(mockIdentifyOrderForReturn).not.toHaveBeenCalled();
  });

  it("retourne { ok: false } sans évaluer l'éligibilité quand la commande n'est pas identifiée", async () => {
    mockIdentifyOrderForReturn.mockResolvedValue({ outcome: "NOT_IDENTIFIED" });

    const result = await submitStorefrontReturnRequest(VALID_INPUT);

    expect(result).toEqual({ ok: false });
    expect(mockDetermineReturnEligibility).not.toHaveBeenCalled();
    expect(mockCreateReturnRequest).not.toHaveBeenCalled();
  });

  it("crée la demande pour une issue ELIGIBLE", async () => {
    mockIdentifyOrderForReturn.mockResolvedValue({
      outcome: "IDENTIFIED",
      order: IDENTIFIED_ORDER,
    });
    mockDetermineReturnEligibility.mockReturnValue({ outcome: "ELIGIBLE" });
    mockGetCurrentStoreId.mockResolvedValue("store-1");
    mockCreateReturnRequest.mockResolvedValue({ id: "return-1", returnNumber: "RET-2026-ABCDEF" });

    const result = await submitStorefrontReturnRequest(VALID_INPUT);

    expect(mockCreateReturnRequest).toHaveBeenCalledWith({
      orderId: IDENTIFIED_ORDER.orderId,
      storeId: "store-1",
      lines: VALID_INPUT.lines,
      reasonCode: VALID_INPUT.reason,
    });
    expect(result).toEqual({ ok: true });
  });

  it("crée la demande pour une issue MANUAL_REVIEW (traitée ensuite par l'admin)", async () => {
    mockIdentifyOrderForReturn.mockResolvedValue({
      outcome: "IDENTIFIED",
      order: IDENTIFIED_ORDER,
    });
    mockDetermineReturnEligibility.mockReturnValue({ outcome: "MANUAL_REVIEW" });
    mockGetCurrentStoreId.mockResolvedValue("store-1");
    mockCreateReturnRequest.mockResolvedValue({ id: "return-1", returnNumber: "RET-2026-ABCDEF" });

    const result = await submitStorefrontReturnRequest(VALID_INPUT);

    expect(mockCreateReturnRequest).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ok: true });
  });

  it("bloque et n'appelle pas createReturnRequest pour une issue INELIGIBLE", async () => {
    mockIdentifyOrderForReturn.mockResolvedValue({
      outcome: "IDENTIFIED",
      order: IDENTIFIED_ORDER,
    });
    mockDetermineReturnEligibility.mockReturnValue({ outcome: "INELIGIBLE" });

    const result = await submitStorefrontReturnRequest(VALID_INPUT);

    expect(mockCreateReturnRequest).not.toHaveBeenCalled();
    expect(result).toEqual({ ok: false });
  });

  it("retourne { ok: false } sans détail si le store courant n'est pas résolu", async () => {
    mockIdentifyOrderForReturn.mockResolvedValue({
      outcome: "IDENTIFIED",
      order: IDENTIFIED_ORDER,
    });
    mockDetermineReturnEligibility.mockReturnValue({ outcome: "ELIGIBLE" });
    mockGetCurrentStoreId.mockResolvedValue(null);

    const result = await submitStorefrontReturnRequest(VALID_INPUT);

    expect(mockCreateReturnRequest).not.toHaveBeenCalled();
    expect(result).toEqual({ ok: false });
  });

  it("retourne { ok: false } sans fuite de détail si createReturnRequest échoue avec une erreur métier connue", async () => {
    mockIdentifyOrderForReturn.mockResolvedValue({
      outcome: "IDENTIFIED",
      order: IDENTIFIED_ORDER,
    });
    mockDetermineReturnEligibility.mockReturnValue({ outcome: "ELIGIBLE" });
    mockGetCurrentStoreId.mockResolvedValue("store-1");
    mockCreateReturnRequest.mockRejectedValue(
      new CreateReturnRequestError("Une demande de retour est déjà en cours.")
    );

    const result = await submitStorefrontReturnRequest(VALID_INPUT);

    expect(result).toEqual({ ok: false });
    expect(Object.keys(result)).toEqual(["ok"]);
  });

  it("propage une erreur technique inattendue (non CreateReturnRequestError)", async () => {
    mockIdentifyOrderForReturn.mockResolvedValue({
      outcome: "IDENTIFIED",
      order: IDENTIFIED_ORDER,
    });
    mockDetermineReturnEligibility.mockReturnValue({ outcome: "ELIGIBLE" });
    mockGetCurrentStoreId.mockResolvedValue("store-1");
    mockCreateReturnRequest.mockRejectedValue(new Error("Erreur base de données"));

    await expect(submitStorefrontReturnRequest(VALID_INPUT)).rejects.toThrow(
      "Erreur base de données"
    );
  });

  it("n'expose aucun identifiant de commande interne (orderId) dans le résultat public", async () => {
    mockIdentifyOrderForReturn.mockResolvedValue({
      outcome: "IDENTIFIED",
      order: IDENTIFIED_ORDER,
    });
    mockDetermineReturnEligibility.mockReturnValue({ outcome: "ELIGIBLE" });
    mockGetCurrentStoreId.mockResolvedValue("store-1");
    mockCreateReturnRequest.mockResolvedValue({ id: "return-1", returnNumber: "RET-2026-ABCDEF" });

    const result = await submitStorefrontReturnRequest(VALID_INPUT);

    expect(JSON.stringify(result)).not.toContain(IDENTIFIED_ORDER.orderId);
    expect(JSON.stringify(result)).not.toContain("RET-2026-ABCDEF");
  });
});

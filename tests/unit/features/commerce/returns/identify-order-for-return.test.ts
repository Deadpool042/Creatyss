import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    order: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/features/admin/store/queries/get-current-store-id.query", () => ({
  getCurrentStoreId: vi.fn(),
}));

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { identifyOrderForReturn } from "@/features/commerce/returns/queries/identify-order-for-return.query";

const mockFindFirst = (db as unknown as { order: { findFirst: ReturnType<typeof vi.fn> } }).order
  .findFirst;
const mockGetCurrentStoreId = getCurrentStoreId as ReturnType<typeof vi.fn>;

const VALID_REFERENCE = "CRY-ABC2345678";
const CURRENT_STORE_ID = "store-current";

describe("identifyOrderForReturn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentStoreId.mockResolvedValue(CURRENT_STORE_ID);
  });

  it("retourne NOT_IDENTIFIED sans appeler la base pour une référence invalide", async () => {
    const result = await identifyOrderForReturn({ reference: "not-a-ref", email: "a@b.com" });

    expect(result).toEqual({ outcome: "NOT_IDENTIFIED" });
    expect(mockFindFirst).not.toHaveBeenCalled();
  });

  it("retourne NOT_IDENTIFIED sans appeler la base pour un email vide", async () => {
    const result = await identifyOrderForReturn({ reference: VALID_REFERENCE, email: "   " });

    expect(result).toEqual({ outcome: "NOT_IDENTIFIED" });
    expect(mockFindFirst).not.toHaveBeenCalled();
  });

  it("retourne NOT_IDENTIFIED si la commande n'existe pas", async () => {
    mockFindFirst.mockResolvedValue(null);

    const result = await identifyOrderForReturn({
      reference: VALID_REFERENCE,
      email: "client@example.com",
    });

    expect(result).toEqual({ outcome: "NOT_IDENTIFIED" });
  });

  it("retourne NOT_IDENTIFIED si l'email ne correspond pas — réponse identique à la référence inconnue", async () => {
    mockFindFirst.mockResolvedValue({
      id: "order-1",
      status: "COMPLETED",
      customerEmail: "owner@example.com",
      lines: [],
      shipments: [],
      returnRequests: [],
    });

    const unknownReferenceResult = await identifyOrderForReturn({
      reference: VALID_REFERENCE,
      email: "someone@example.com",
    });

    mockFindFirst.mockResolvedValue(null);
    const wrongEmailResult = await identifyOrderForReturn({
      reference: VALID_REFERENCE,
      email: "someone@example.com",
    });

    expect(unknownReferenceResult).toEqual(wrongEmailResult);
    expect(unknownReferenceResult).toEqual({ outcome: "NOT_IDENTIFIED" });
  });

  it("retourne IDENTIFIED avec un contexte de domaine pour une référence et un email valides", async () => {
    mockFindFirst.mockResolvedValue({
      id: "order-1",
      status: "COMPLETED",
      customerEmail: "Client@Example.com",
      lines: [{ id: "line-1", quantity: 2 }],
      shipments: [{ deliveredAt: new Date("2026-07-10T00:00:00.000Z") }],
      returnRequests: [{ status: "CLOSED", items: [{ orderLineId: "line-1", quantity: 1 }] }],
    });

    const result = await identifyOrderForReturn({
      reference: VALID_REFERENCE,
      email: "  client@example.com  ",
    });

    expect(result).toEqual({
      outcome: "IDENTIFIED",
      order: {
        orderId: "order-1",
        status: "COMPLETED",
        lines: [{ orderLineId: "line-1", quantity: 2 }],
        shipment: { deliveredAt: new Date("2026-07-10T00:00:00.000Z") },
        existingReturnRequests: [
          { status: "CLOSED", items: [{ orderLineId: "line-1", quantity: 1 }] },
        ],
      },
    });
  });

  it("retourne shipment: null si la commande n'a aucun Shipment", async () => {
    mockFindFirst.mockResolvedValue({
      id: "order-1",
      status: "COMPLETED",
      customerEmail: "client@example.com",
      lines: [],
      shipments: [],
      returnRequests: [],
    });

    const result = await identifyOrderForReturn({
      reference: VALID_REFERENCE,
      email: "client@example.com",
    });

    expect(result.outcome).toBe("IDENTIFIED");
    if (result.outcome === "IDENTIFIED") {
      expect(result.order.shipment).toBeNull();
    }
  });

  it("interroge la commande scopée au store courant (référence non suffisante à elle seule)", async () => {
    mockFindFirst.mockResolvedValue(null);

    await identifyOrderForReturn({ reference: VALID_REFERENCE, email: "client@example.com" });

    expect(mockFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { storeId: CURRENT_STORE_ID, orderNumber: VALID_REFERENCE },
      })
    );
  });

  it("retourne NOT_IDENTIFIED sans appeler la base si aucun store courant n'est résolu", async () => {
    mockGetCurrentStoreId.mockResolvedValue(null);

    const result = await identifyOrderForReturn({
      reference: VALID_REFERENCE,
      email: "client@example.com",
    });

    expect(result).toEqual({ outcome: "NOT_IDENTIFIED" });
    expect(mockFindFirst).not.toHaveBeenCalled();
  });

  it("ne retient pas une commande portant le même orderNumber sur un autre store (isolation garantie par la clause where, vérifiée ci-dessus) — référence ou email incorrect reste neutre", async () => {
    // La commande d'un autre store ne peut jamais être renvoyée par Prisma
    // puisque `where` filtre par storeId courant : le mock simule ce cas en
    // renvoyant null, comme le ferait réellement la base pour cette clause.
    mockFindFirst.mockResolvedValue(null);

    const result = await identifyOrderForReturn({
      reference: VALID_REFERENCE,
      email: "client@example.com",
    });

    expect(result).toEqual({ outcome: "NOT_IDENTIFIED" });
  });

  it("retourne shipment: null quand aucun shipment livré n'existe (commande avec shipment(s) non livré(s) uniquement, exclu(s) par la clause where)", async () => {
    // Un shipment non livré (ou avec deliveredAt: null) est filtré côté base
    // par `where: { deliveredAt: { not: null } }` : Prisma ne le renvoie
    // jamais dans `shipments`, d'où le tableau vide simulé ici.
    mockFindFirst.mockResolvedValue({
      id: "order-1",
      status: "COMPLETED",
      customerEmail: "client@example.com",
      lines: [],
      shipments: [],
      returnRequests: [],
    });

    const result = await identifyOrderForReturn({
      reference: VALID_REFERENCE,
      email: "client@example.com",
    });

    expect(result.outcome).toBe("IDENTIFIED");
    if (result.outcome === "IDENTIFIED") {
      expect(result.order.shipment).toBeNull();
    }
  });

  it("sélectionne le shipment réellement livré le plus récent, en ignorant les shipments non livrés", async () => {
    mockFindFirst.mockResolvedValue({
      id: "order-1",
      status: "COMPLETED",
      customerEmail: "client@example.com",
      lines: [],
      shipments: [{ deliveredAt: new Date("2026-07-12T00:00:00.000Z") }],
      returnRequests: [],
    });

    const result = await identifyOrderForReturn({
      reference: VALID_REFERENCE,
      email: "client@example.com",
    });

    expect(result.outcome).toBe("IDENTIFIED");
    if (result.outcome === "IDENTIFIED") {
      expect(result.order.shipment).toEqual({ deliveredAt: new Date("2026-07-12T00:00:00.000Z") });
    }
    expect(mockFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          shipments: {
            where: { deliveredAt: { not: null } },
            orderBy: { deliveredAt: "desc" },
            take: 1,
            select: { deliveredAt: true },
          },
        }),
      })
    );
  });
});

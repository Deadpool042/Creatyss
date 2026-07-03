import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    orderLine: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/features/admin/store/queries/get-current-store-id.query", () => ({
  getCurrentStoreId: vi.fn(),
}));

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { getCommerceAnalyticsRecommendations } from "@/features/admin/insights/queries/get-commerce-analytics-recommendations.query";

const mockFindMany = db.orderLine.findMany as ReturnType<typeof vi.fn>;
const mockGetCurrentStoreId = getCurrentStoreId as ReturnType<typeof vi.fn>;

const STORE_ID = "store_1";

type Line = { productId: string | null; productName: string; quantity: number };

/**
 * Les 4 requêtes sont émises dans cet ordre exact (recentWindow, previousWindow,
 * currentMonth, previousMonth) — cf. Promise.all dans le service.
 */
function mockFourWindows(
  recent: Line[],
  previous: Line[],
  currentMonth: Line[],
  previousMonth: Line[]
) {
  mockFindMany
    .mockResolvedValueOnce(recent)
    .mockResolvedValueOnce(previous)
    .mockResolvedValueOnce(currentMonth)
    .mockResolvedValueOnce(previousMonth);
}

describe("getCommerceAnalyticsRecommendations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentStoreId.mockResolvedValue(STORE_ID);
  });

  it("retourne des listes vides si aucun store n'existe", async () => {
    mockGetCurrentStoreId.mockResolvedValue(null);

    const result = await getCommerceAnalyticsRecommendations();

    expect(result).toEqual({ decliningProducts: [], growingProducts: [] });
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  it("détecte un produit en repli (vendait avant, plus aucune vente depuis 30 jours)", async () => {
    mockFourWindows([], [{ productId: "p1", productName: "Sac cabas", quantity: 8 }], [], []);

    const result = await getCommerceAnalyticsRecommendations();

    expect(result.decliningProducts).toEqual([
      { productId: "p1", productName: "Sac cabas", previousQuantity: 8 },
    ]);
  });

  it("n'inclut pas un produit qui vend encore sur la fenêtre récente", async () => {
    mockFourWindows(
      [{ productId: "p1", productName: "Sac cabas", quantity: 2 }],
      [{ productId: "p1", productName: "Sac cabas", quantity: 8 }],
      [],
      []
    );

    const result = await getCommerceAnalyticsRecommendations();

    expect(result.decliningProducts).toEqual([]);
  });

  it("détecte un produit en croissance (mois courant > mois précédent)", async () => {
    mockFourWindows(
      [],
      [],
      [{ productId: "p2", productName: "Pochette", quantity: 10 }],
      [{ productId: "p2", productName: "Pochette", quantity: 3 }]
    );

    const result = await getCommerceAnalyticsRecommendations();

    expect(result.growingProducts).toEqual([
      {
        productId: "p2",
        productName: "Pochette",
        previousQuantity: 3,
        currentQuantity: 10,
        growth: 7,
      },
    ]);
  });

  it("n'inclut pas un produit sans historique le mois précédent ni un produit en baisse", async () => {
    mockFourWindows(
      [],
      [],
      [
        { productId: "p3", productName: "Nouveau produit", quantity: 5 },
        { productId: "p4", productName: "Produit en baisse", quantity: 2 },
      ],
      [{ productId: "p4", productName: "Produit en baisse", quantity: 6 }]
    );

    const result = await getCommerceAnalyticsRecommendations();

    expect(result.growingProducts).toEqual([]);
  });

  it("plafonne à 5 éléments triés par ampleur décroissante", async () => {
    const previous = Array.from({ length: 7 }, (_, i) => ({
      productId: `p${i}`,
      productName: `Produit ${i}`,
      quantity: i + 1,
    }));
    mockFourWindows([], previous, [], []);

    const result = await getCommerceAnalyticsRecommendations();

    expect(result.decliningProducts).toHaveLength(5);
    expect(result.decliningProducts[0]?.previousQuantity).toBe(7);
    expect(result.decliningProducts[4]?.previousQuantity).toBe(3);
  });
});

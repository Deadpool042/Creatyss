import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    analyticsMetric: {
      upsert: vi.fn(),
    },
    analyticsSnapshot: {
      upsert: vi.fn(),
    },
  },
}));

vi.mock("@/features/admin/store/queries/get-current-store-id.query", () => ({
  getCurrentStoreId: vi.fn(),
}));

vi.mock("@/features/feature-flags/queries/query-feature-flag-active", () => ({
  queryFeatureFlagActive: vi.fn(),
}));

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";
import {
  recordStorefrontAnalyticsEvent,
  trackStorefrontAnalyticsEvent,
} from "@/features/analytics/tracking/record-storefront-analytics-event.service";

const mockDb = db as unknown as {
  analyticsMetric: { upsert: ReturnType<typeof vi.fn> };
  analyticsSnapshot: { upsert: ReturnType<typeof vi.fn> };
};

const mockGetCurrentStoreId = getCurrentStoreId as ReturnType<typeof vi.fn>;
const mockQueryFeatureFlagActive = queryFeatureFlagActive as ReturnType<typeof vi.fn>;

const STORE_ID = "store_1";
const METRIC_ID = "metric_1";
const NOW = new Date("2026-07-02T14:30:00.000Z");
const DAY_START = new Date("2026-07-02T00:00:00.000Z");
const DAY_END = new Date("2026-07-03T00:00:00.000Z");

describe("recordStorefrontAnalyticsEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentStoreId.mockResolvedValue(STORE_ID);
    mockQueryFeatureFlagActive.mockResolvedValue(true);
    mockDb.analyticsMetric.upsert.mockResolvedValue({ id: METRIC_ID });
    mockDb.analyticsSnapshot.upsert.mockResolvedValue({ id: "snapshot_1" });
  });

  it("n'écrit rien si aucun store n'existe", async () => {
    mockGetCurrentStoreId.mockResolvedValue(null);

    await recordStorefrontAnalyticsEvent("productView", NOW);

    expect(mockQueryFeatureFlagActive).not.toHaveBeenCalled();
    expect(mockDb.analyticsMetric.upsert).not.toHaveBeenCalled();
    expect(mockDb.analyticsSnapshot.upsert).not.toHaveBeenCalled();
  });

  it("n'écrit rien si le flag engagement.analytics est inactif", async () => {
    mockQueryFeatureFlagActive.mockResolvedValue(false);

    await recordStorefrontAnalyticsEvent("productView", NOW);

    expect(mockQueryFeatureFlagActive).toHaveBeenCalledWith("engagement.analytics", {
      storeId: STORE_ID,
    });
    expect(mockDb.analyticsMetric.upsert).not.toHaveBeenCalled();
    expect(mockDb.analyticsSnapshot.upsert).not.toHaveBeenCalled();
  });

  it("upsert la métrique puis incrémente le snapshot du jour UTC", async () => {
    await recordStorefrontAnalyticsEvent("productView", NOW);

    expect(mockDb.analyticsMetric.upsert).toHaveBeenCalledOnce();
    expect(mockDb.analyticsMetric.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          storeId_code: {
            storeId: STORE_ID,
            code: "storefront.product_views",
          },
        },
      })
    );

    expect(mockDb.analyticsSnapshot.upsert).toHaveBeenCalledOnce();
    expect(mockDb.analyticsSnapshot.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          analyticsMetricId_dimensionType_dimensionKey_periodStart_periodEnd: {
            analyticsMetricId: METRIC_ID,
            dimensionType: "total",
            dimensionKey: "all",
            periodStart: DAY_START,
            periodEnd: DAY_END,
          },
        },
        update: expect.objectContaining({
          valueInteger: { increment: 1 },
        }),
        create: expect.objectContaining({
          analyticsMetricId: METRIC_ID,
          valueInteger: 1,
          status: "READY",
          periodStart: DAY_START,
          periodEnd: DAY_END,
        }),
      })
    );
  });

  it("utilise le code métrique des ajouts panier pour cartAddition", async () => {
    await recordStorefrontAnalyticsEvent("cartAddition", NOW);

    expect(mockDb.analyticsMetric.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          storeId_code: {
            storeId: STORE_ID,
            code: "storefront.cart_additions",
          },
        },
      })
    );
  });

  it("retente l'upsert snapshot une fois sur conflit d'unicité (P2002)", async () => {
    mockDb.analyticsSnapshot.upsert
      .mockRejectedValueOnce({ code: "P2002" })
      .mockResolvedValueOnce({ id: "snapshot_1" });

    await recordStorefrontAnalyticsEvent("productView", NOW);

    expect(mockDb.analyticsSnapshot.upsert).toHaveBeenCalledTimes(2);
  });

  it("propage les erreurs non liées à l'unicité", async () => {
    mockDb.analyticsSnapshot.upsert.mockRejectedValue(new Error("db down"));

    await expect(recordStorefrontAnalyticsEvent("productView", NOW)).rejects.toThrow("db down");
    expect(mockDb.analyticsSnapshot.upsert).toHaveBeenCalledOnce();
  });
});

describe("trackStorefrontAnalyticsEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ne propage jamais l'erreur au parcours storefront", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetCurrentStoreId.mockRejectedValue(new Error("db down"));

    expect(() => trackStorefrontAnalyticsEvent("productView")).not.toThrow();

    // Laisse la promesse fire-and-forget se résoudre.
    await new Promise((resolve) => setImmediate(resolve));

    expect(consoleErrorSpy).toHaveBeenCalledOnce();
    consoleErrorSpy.mockRestore();
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

class RedirectError extends Error {
  constructor(readonly destination: string) {
    super(`Redirect to ${destination}`);
  }
}

const mockTx = {
  shippingZone: { update: vi.fn() },
  shippingMethod: { updateMany: vi.fn() },
};

vi.mock("@/core/db", () => ({
  db: {
    shippingZone: { findUnique: vi.fn() },
    $transaction: vi.fn(async (callback: (tx: typeof mockTx) => Promise<void>) => {
      await callback(mockTx);
    }),
  },
}));

vi.mock("@/core/auth/admin/require-admin-capability", () => ({
  requireAdminCapability: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((destination: string) => {
    throw new RedirectError(destination);
  }),
}));

import { db } from "@/core/db";
import { updateShippingZoneStatusAction } from "@/features/admin/settings/actions/update-shipping-zone-status.action";

const mockDb = db as unknown as {
  shippingZone: { findUnique: ReturnType<typeof vi.fn> };
  $transaction: ReturnType<typeof vi.fn>;
};

function buildFormData(id: string, nextStatus: string): FormData {
  const formData = new FormData();
  formData.set("id", id);
  formData.set("nextStatus", nextStatus);
  return formData;
}

describe("updateShippingZoneStatusAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTx.shippingZone.update.mockResolvedValue({});
    mockTx.shippingMethod.updateMany.mockResolvedValue({ count: 0 });
  });

  it("archive en cascade les méthodes actives de la zone", async () => {
    mockDb.shippingZone.findUnique.mockResolvedValue({ status: "ACTIVE" });

    await expect(
      updateShippingZoneStatusAction(buildFormData("zone_1", "ARCHIVED"))
    ).rejects.toThrow(RedirectError);

    expect(mockTx.shippingZone.update).toHaveBeenCalledWith({
      where: { id: "zone_1" },
      data: expect.objectContaining({ status: "ARCHIVED", archivedAt: expect.any(Date) }),
    });
    expect(mockTx.shippingMethod.updateMany).toHaveBeenCalledWith({
      where: { shippingZoneId: "zone_1", status: "ACTIVE" },
      data: expect.objectContaining({ status: "ARCHIVED", archivedAt: expect.any(Date) }),
    });
  });

  it("désactive en cascade les méthodes actives quand la zone passe INACTIVE", async () => {
    mockDb.shippingZone.findUnique.mockResolvedValue({ status: "ACTIVE" });

    await expect(
      updateShippingZoneStatusAction(buildFormData("zone_1", "INACTIVE"))
    ).rejects.toThrow(RedirectError);

    expect(mockTx.shippingMethod.updateMany).toHaveBeenCalledWith({
      where: { shippingZoneId: "zone_1", status: "ACTIVE" },
      data: { status: "INACTIVE" },
    });
  });

  it("ne touche pas aux méthodes lors d'une réactivation (INACTIVE → ACTIVE)", async () => {
    mockDb.shippingZone.findUnique.mockResolvedValue({ status: "INACTIVE" });

    await expect(updateShippingZoneStatusAction(buildFormData("zone_1", "ACTIVE"))).rejects.toThrow(
      RedirectError
    );

    expect(mockTx.shippingMethod.updateMany).not.toHaveBeenCalled();
  });

  it("refuse une transition non autorisée sans appeler la transaction", async () => {
    mockDb.shippingZone.findUnique.mockResolvedValue({ status: "ARCHIVED" });

    await expect(updateShippingZoneStatusAction(buildFormData("zone_1", "ACTIVE"))).rejects.toThrow(
      RedirectError
    );

    expect(mockDb.$transaction).not.toHaveBeenCalled();
  });

  it("refuse si la zone est introuvable", async () => {
    mockDb.shippingZone.findUnique.mockResolvedValue(null);

    await expect(updateShippingZoneStatusAction(buildFormData("zone_1", "ACTIVE"))).rejects.toThrow(
      RedirectError
    );

    expect(mockDb.$transaction).not.toHaveBeenCalled();
  });
});

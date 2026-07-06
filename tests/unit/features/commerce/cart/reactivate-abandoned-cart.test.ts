import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    cart: {
      updateMany: vi.fn(),
    },
  },
}));

import { db } from "@/core/db";
import { reactivateAbandonedCart } from "@/features/commerce/cart/lib/guest-cart.repository";

const mockUpdateMany = (db as unknown as { cart: { updateMany: ReturnType<typeof vi.fn> } }).cart
  .updateMany;

describe("reactivateAbandonedCart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne false sans appeler la base si l'id est vide", async () => {
    const result = await reactivateAbandonedCart("");

    expect(result).toBe(false);
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("réactive un panier ABANDONED et retourne true", async () => {
    mockUpdateMany.mockResolvedValue({ count: 1 });

    const result = await reactivateAbandonedCart("cart_1");

    expect(result).toBe(true);
    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { id: "cart_1", status: "ABANDONED", archivedAt: null },
      data: { status: "ACTIVE", abandonedAt: null },
    });
  });

  it("retourne false si le panier n'est pas dans l'état ABANDONED", async () => {
    mockUpdateMany.mockResolvedValue({ count: 0 });

    const result = await reactivateAbandonedCart("cart_active");

    expect(result).toBe(false);
  });
});

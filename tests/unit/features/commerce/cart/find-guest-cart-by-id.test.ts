import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    cart: {
      updateMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { db } from "@/core/db";
import { findGuestCartById } from "@/features/commerce/cart/lib/guest-cart.repository";

const mockUpdateMany = (db as unknown as { cart: { updateMany: ReturnType<typeof vi.fn> } }).cart
  .updateMany;
const mockFindUnique = (db as unknown as { cart: { findUnique: ReturnType<typeof vi.fn> } }).cart
  .findUnique;

describe("findGuestCartById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne l'id d'un panier déjà ACTIVE", async () => {
    mockUpdateMany.mockResolvedValue({ count: 0 });
    mockFindUnique.mockResolvedValue({ id: "cart_1", status: "ACTIVE" });

    const result = await findGuestCartById("cart_1");

    expect(result).toBe("cart_1");
  });

  it("réactive un panier ABANDONED puis retourne son id (option A, lot 7)", async () => {
    mockUpdateMany.mockResolvedValue({ count: 1 });
    mockFindUnique.mockResolvedValue({ id: "cart_2", status: "ACTIVE" });

    const result = await findGuestCartById("cart_2");

    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { id: "cart_2", status: "ABANDONED", archivedAt: null },
      data: { status: "ACTIVE", abandonedAt: null },
    });
    expect(result).toBe("cart_2");
  });

  it("retourne null pour un panier CONVERTED (réactivation sans effet)", async () => {
    mockUpdateMany.mockResolvedValue({ count: 0 });
    mockFindUnique.mockResolvedValue({ id: "cart_3", status: "CONVERTED" });

    const result = await findGuestCartById("cart_3");

    expect(result).toBeNull();
  });

  it("retourne null sans appeler la base si l'id est vide", async () => {
    const result = await findGuestCartById("");

    expect(result).toBeNull();
    expect(mockUpdateMany).not.toHaveBeenCalled();
    expect(mockFindUnique).not.toHaveBeenCalled();
  });
});

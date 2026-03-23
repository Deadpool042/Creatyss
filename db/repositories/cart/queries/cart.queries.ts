import { prisma } from "@/db/prisma-client";
import { cartSelect, type CartRow } from "@db-cart/types/rows";

export async function findCartRowById(id: string): Promise<CartRow | null> {
  return prisma.cart.findUnique({
    where: {
      id,
    },
    select: cartSelect,
  });
}

export async function findGuestCartRowById(id: string): Promise<CartRow | null> {
  return prisma.cart.findFirst({
    where: {
      id,
      customerId: null,
    },
    select: cartSelect,
  });
}

export async function findActiveCustomerCartRowByCustomerId(
  customerId: string
): Promise<CartRow | null> {
  return prisma.cart.findFirst({
    where: {
      customerId,
      status: "ACTIVE",
    },
    orderBy: [{ updatedAt: "desc" }],
    select: cartSelect,
  });
}

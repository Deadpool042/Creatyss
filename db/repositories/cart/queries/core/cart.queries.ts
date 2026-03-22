import { prisma } from "@db/prisma-client";
import { cartSelect } from "@db-cart/types/rows/cart.rows";

export async function findCartRowById(cartId: string) {
  return prisma.cart.findUnique({
    where: {
      id: cartId,
    },
    select: cartSelect,
  });
}

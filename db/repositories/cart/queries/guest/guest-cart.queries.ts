import { prisma } from "@db/prisma-client";
import { guestCartSelect } from "@db-cart/types/rows/guest-cart.rows";

export async function findGuestCartRowByToken(guestToken: string) {
  return prisma.cart.findFirst({
    where: {
      guestToken,
      userId: null,
    },
    select: guestCartSelect,
  });
}

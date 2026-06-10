import { db } from "@/core/db";

export async function getStoreIdByCartId(cartId: string): Promise<string | null> {
  const cart = await db.cart.findUnique({
    where: { id: cartId },
    select: { storeId: true },
  });

  return cart?.storeId ?? null;
}

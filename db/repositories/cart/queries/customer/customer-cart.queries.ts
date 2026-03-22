import { prisma } from "@db/prisma-client";
import { customerCartSelect } from "@db-cart/types/rows/customer-cart.rows";

export async function findCustomerCartRowByCustomerId(customerId: string) {
  return prisma.cart.findFirst({
    where: {
      userId: customerId,
    },
    orderBy: [{ updatedAt: "desc" }],
    select: customerCartSelect,
  });
}

import { prisma } from "@/db/prisma-client";
import { orderEmailEventSelect } from "../types/rows";

export async function findOrderEmailEventRowById(id: string) {
  return prisma.orderEmailEvent.findUnique({
    where: { id },
    select: orderEmailEventSelect,
  });
}

export async function listOrderEmailEventRowsByOrderId(orderId: string) {
  return prisma.orderEmailEvent.findMany({
    where: { orderId },
    orderBy: [{ createdAt: "desc" }],
    select: orderEmailEventSelect,
  });
}

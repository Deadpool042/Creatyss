import { prisma } from "@/db/prisma-client";
import { refundSelect } from "../types/rows";

export async function findRefundRowById(id: string) {
  return prisma.refund.findUnique({
    where: { id },
    select: refundSelect,
  });
}

export async function listRefundRowsByOrderId(orderId: string) {
  return prisma.refund.findMany({
    where: { orderId },
    orderBy: [{ createdAt: "desc" }],
    select: refundSelect,
  });
}

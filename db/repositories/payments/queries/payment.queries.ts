import { prisma } from "@/db/prisma-client";
import { paymentSelect } from "../types/rows";

export async function findPaymentRowById(id: string) {
  return prisma.payment.findUnique({
    where: { id },
    select: paymentSelect,
  });
}

export async function listPaymentRowsByOrderId(orderId: string) {
  return prisma.payment.findMany({
    where: { orderId },
    orderBy: [{ createdAt: "desc" }],
    select: paymentSelect,
  });
}

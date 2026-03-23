import { prisma } from "@/db/prisma-client";
import { paymentSelect, type PaymentRow } from "@db-payments/types/rows";

export async function listPaymentRowsByOrderId(orderId: string): Promise<PaymentRow[]> {
  return prisma.payment.findMany({
    where: {
      orderId,
    },
    orderBy: [{ createdAt: "desc" }],
    select: paymentSelect,
  });
}

export async function findPaymentRowById(id: string): Promise<PaymentRow | null> {
  return prisma.payment.findUnique({
    where: {
      id,
    },
    select: paymentSelect,
  });
}

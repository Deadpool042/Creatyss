import { db } from "@/core/db";

export type AdminShippingSettings = {
  standardShippingAmount: number;
  freeShippingThreshold: number | null;
  currencyCode: string;
};

export async function getAdminShippingSettings(): Promise<AdminShippingSettings | null> {
  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      defaultCurrency: true,
    },
  });

  if (!store) return null;

  const currencyCode = store.defaultCurrency as string;

  const [standardMethod, freeMethod] = await Promise.all([
    db.shippingMethod.findFirst({
      where: { storeId: store.id, code: "STANDARD" },
      select: { amount: true },
    }),
    db.shippingMethod.findFirst({
      where: { storeId: store.id, code: "FREE" },
      select: { minSubtotalAmount: true, status: true },
    }),
  ]);

  const standardShippingAmount = standardMethod
    ? Number(standardMethod.amount)
    : 0;

  const freeShippingThreshold =
    freeMethod && freeMethod.status === "ACTIVE" && freeMethod.minSubtotalAmount !== null
      ? Number(freeMethod.minSubtotalAmount)
      : null;

  return {
    standardShippingAmount,
    freeShippingThreshold,
    currencyCode,
  };
}

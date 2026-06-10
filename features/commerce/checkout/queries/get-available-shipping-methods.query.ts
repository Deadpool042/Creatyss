import { db } from "@/core/db";

export type AvailableShippingMethod = {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly amountCents: number;
  readonly currencyCode: string;
};

export async function getAvailableShippingMethods(input: {
  storeId: string;
  subtotalCents: number;
}): Promise<ReadonlyArray<AvailableShippingMethod>> {
  const { storeId, subtotalCents } = input;

  const methods = await db.shippingMethod.findMany({
    where: { storeId, status: "ACTIVE" },
    select: {
      id: true,
      code: true,
      name: true,
      amount: true,
      currencyCode: true,
      minSubtotalAmount: true,
      maxSubtotalAmount: true,
    },
    orderBy: [{ amount: "asc" }, { name: "asc" }],
  });

  return methods
    .filter((method) => {
      if (
        method.minSubtotalAmount !== null &&
        subtotalCents < Math.round(Number(method.minSubtotalAmount) * 100)
      ) {
        return false;
      }
      if (
        method.maxSubtotalAmount !== null &&
        subtotalCents > Math.round(Number(method.maxSubtotalAmount) * 100)
      ) {
        return false;
      }
      return true;
    })
    .map((method) => ({
      id: method.id,
      code: method.code,
      name: method.name,
      amountCents: Math.round(Number(method.amount) * 100),
      currencyCode: method.currencyCode as string,
    }));
}

import { withTransaction } from "@/core/db";
import { AdminProductEditorServiceError, assertProductExists } from "./shared";

type PriceUpsertEntry = {
  priceListId: string;
  amount: string;
  compareAtAmount: string | null;
  costAmount: string | null;
  startsAt: string | null;
  endsAt: string | null;
};

type UpdateProductPricesServiceInput = {
  productId: string;
  prices: PriceUpsertEntry[];
  toArchive: string[];
};

export async function updateProductPrices(input: UpdateProductPricesServiceInput): Promise<void> {
  await withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);

    for (const entry of input.prices) {
      const priceListExists = await tx.priceList.findFirst({
        where: { id: entry.priceListId, archivedAt: null },
        select: { id: true },
      });

      if (priceListExists === null) {
        throw new AdminProductEditorServiceError(
          "product_missing",
          `price_list_missing:${entry.priceListId}`
        );
      }

      const amount = parseFloat(entry.amount);
      const compareAtAmount =
        entry.compareAtAmount !== null && entry.compareAtAmount.trim().length > 0
          ? parseFloat(entry.compareAtAmount)
          : null;
      const costAmount =
        entry.costAmount !== null && entry.costAmount.trim().length > 0
          ? parseFloat(entry.costAmount)
          : null;

      if (isNaN(amount)) {
        continue;
      }

      await tx.productPrice.upsert({
        where: {
          productId_priceListId: {
            productId: input.productId,
            priceListId: entry.priceListId,
          },
        },
        create: {
          productId: input.productId,
          priceListId: entry.priceListId,
          amount,
          compareAtAmount,
          costAmount,
          startsAt: entry.startsAt ? new Date(entry.startsAt) : null,
          endsAt: entry.endsAt ? new Date(entry.endsAt) : null,
        },
        update: {
          amount,
          compareAtAmount,
          costAmount,
          startsAt: entry.startsAt ? new Date(entry.startsAt) : null,
          endsAt: entry.endsAt ? new Date(entry.endsAt) : null,
          archivedAt: null,
        },
      });
    }

    if (input.toArchive.length > 0) {
      await tx.productPrice.updateMany({
        where: {
          productId: input.productId,
          priceListId: { in: input.toArchive },
          archivedAt: null,
        },
        data: { archivedAt: new Date() },
      });
    }
  });
}

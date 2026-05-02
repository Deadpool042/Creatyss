import { computeCatalogPriceSnapshot } from "@/entities/catalog/catalog-price-snapshot";
import type { Prisma } from "@/prisma-generated/client";
import { createScriptPrismaClient } from "./helpers/prisma-client";

const prisma = createScriptPrismaClient();

const DEFAULT_BATCH_SIZE = 100;
const productSnapshotBackfillSelect = {
  id: true,
  catalogPriceCents: true,
  catalogPriceCurrencyCode: true,
  catalogPriceSource: true,
  prices: {
    select: {
      amount: true,
      isActive: true,
      archivedAt: true,
      priceList: {
        select: {
          id: true,
          currencyCode: true,
          status: true,
          isDefault: true,
          archivedAt: true,
        },
      },
    },
  },
  variants: {
    select: {
      status: true,
      archivedAt: true,
      prices: {
        select: {
          amount: true,
          isActive: true,
          archivedAt: true,
          priceList: {
            select: {
              id: true,
              currencyCode: true,
              status: true,
              isDefault: true,
              archivedAt: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.ProductSelect;

type ProductSnapshotBackfillRecord = Prisma.ProductGetPayload<{
  select: typeof productSnapshotBackfillSelect;
}>;

function hasCliFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function readBatchSize(): number {
  const argument = process.argv.find((value) => value.startsWith("--batch-size="));

  if (!argument) {
    return DEFAULT_BATCH_SIZE;
  }

  const rawValue = argument.slice("--batch-size=".length);
  const parsedValue = Number.parseInt(rawValue, 10);

  if (!Number.isSafeInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`Invalid --batch-size value: "${rawValue}"`);
  }

  return parsedValue;
}

type BackfillStats = {
  totalAnalyzed: number;
  totalUpdated: number;
  totalUnchanged: number;
  totalNullSnapshots: number;
};

async function main() {
  const isDryRun = hasCliFlag("--dry-run");
  const batchSize = readBatchSize();

  const stats: BackfillStats = {
    totalAnalyzed: 0,
    totalUpdated: 0,
    totalUnchanged: 0,
    totalNullSnapshots: 0,
  };

  let cursorProductId: string | null = null;

  while (true) {
    const products: ProductSnapshotBackfillRecord[] = await prisma.product.findMany({
      select: productSnapshotBackfillSelect,
      orderBy: {
        id: "asc",
      },
      take: batchSize,
      ...(cursorProductId
        ? {
            cursor: { id: cursorProductId },
            skip: 1,
          }
        : {}),
    });

    if (products.length === 0) {
      break;
    }

    for (const product of products) {
      const snapshot = computeCatalogPriceSnapshot({
        prices: product.prices,
        variants: product.variants,
      });

      stats.totalAnalyzed += 1;

      if (snapshot.catalogPriceCents === null) {
        stats.totalNullSnapshots += 1;
      }

      const isUnchanged =
        product.catalogPriceCents === snapshot.catalogPriceCents &&
        product.catalogPriceCurrencyCode === snapshot.catalogPriceCurrencyCode &&
        product.catalogPriceSource === snapshot.catalogPriceSource;

      if (isUnchanged) {
        stats.totalUnchanged += 1;
        continue;
      }

      stats.totalUpdated += 1;

      if (!isDryRun) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            catalogPriceCents: snapshot.catalogPriceCents,
            catalogPriceCurrencyCode: snapshot.catalogPriceCurrencyCode,
            catalogPriceSource: snapshot.catalogPriceSource,
          },
        });
      }
    }

    const lastProduct: ProductSnapshotBackfillRecord | undefined = products[products.length - 1];

    if (!lastProduct) {
      break;
    }

    cursorProductId = lastProduct.id;
    process.stdout.write(`Processed ${stats.totalAnalyzed} products...\n`);
  }

  process.stdout.write("\nCatalog price snapshot backfill summary\n");
  process.stdout.write(`- mode: ${isDryRun ? "dry-run" : "apply"}\n`);
  process.stdout.write(`- batch size: ${batchSize}\n`);
  process.stdout.write(`- analyzed: ${stats.totalAnalyzed}\n`);
  process.stdout.write(`- updated: ${stats.totalUpdated}\n`);
  process.stdout.write(`- unchanged: ${stats.totalUnchanged}\n`);
  process.stdout.write(`- null snapshots: ${stats.totalNullSnapshots}\n`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

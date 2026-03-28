import { createScriptPrismaClient } from "../../helpers/prisma-client";
import {
  CategoryStatus,
  ProductStatus,
  ProductVariantStatus,
} from "../../../src/generated/prisma/client";

type DiagnosticCounts = {
  activeCategories: number;
  archivedCategories: number;
  activeProducts: number;
  archivedProducts: number;
  activeVariants: number;
  archivedVariants: number;
  importedMediaAssets: number;
  productsWithoutPrimaryImage: number;
  variantsWithoutPrimaryImage: number;
  productsWithoutActivePrice: number;
  variantsWithoutActivePrice: number;
  productsWithoutCategory: number;
  variableSourceVariantsWithoutOptionValues: number;
};

function printLine(label: string, value: number): void {
  process.stdout.write(`${label}: ${value}\n`);
}

async function main(): Promise<void> {
  const prisma = createScriptPrismaClient();

  try {
    const [
      activeCategories,
      archivedCategories,
      activeProducts,
      archivedProducts,
      activeVariants,
      archivedVariants,
      importedMediaAssets,
      productsWithoutPrimaryImage,
      variantsWithoutPrimaryImage,
      productsWithoutActivePrice,
      variantsWithoutActivePrice,
      productsWithoutCategory,
      variableSourceVariantsWithoutOptionValues,
    ] = await Promise.all([
      prisma.category.count({
        where: {
          status: CategoryStatus.ACTIVE,
        },
      }),
      prisma.category.count({
        where: {
          status: CategoryStatus.ARCHIVED,
        },
      }),
      prisma.product.count({
        where: {
          status: ProductStatus.ACTIVE,
        },
      }),
      prisma.product.count({
        where: {
          status: ProductStatus.ARCHIVED,
        },
      }),
      prisma.productVariant.count({
        where: {
          status: ProductVariantStatus.ACTIVE,
        },
      }),
      prisma.productVariant.count({
        where: {
          status: ProductVariantStatus.ARCHIVED,
        },
      }),
      prisma.mediaAsset.count({
        where: {
          OR: [
            {
              storageKey: {
                startsWith: "imports/woocommerce",
              },
            },
            {
              storageKey: {
                startsWith: "imports/wordpress/blog",
              },
            },
          ],
        },
      }),
      prisma.product.count({
        where: {
          status: ProductStatus.ACTIVE,
          primaryImageId: null,
        },
      }),
      prisma.productVariant.count({
        where: {
          status: ProductVariantStatus.ACTIVE,
          primaryImageId: null,
        },
      }),
      prisma.product.count({
        where: {
          status: ProductStatus.ACTIVE,
          prices: {
            none: {
              isActive: true,
            },
          },
        },
      }),
      prisma.productVariant.count({
        where: {
          status: ProductVariantStatus.ACTIVE,
          prices: {
            none: {
              isActive: true,
            },
          },
        },
      }),
      prisma.product.count({
        where: {
          status: ProductStatus.ACTIVE,
          productCategories: {
            none: {},
          },
        },
      }),
      prisma.productVariant.count({
        where: {
          status: ProductVariantStatus.ACTIVE,
          externalReference: {
            startsWith: "woo_variation:",
          },
          optionValues: {
            none: {},
          },
        },
      }),
    ]);

    const diagnostics: DiagnosticCounts = {
      activeCategories,
      archivedCategories,
      activeProducts,
      archivedProducts,
      activeVariants,
      archivedVariants,
      importedMediaAssets,
      productsWithoutPrimaryImage,
      variantsWithoutPrimaryImage,
      productsWithoutActivePrice,
      variantsWithoutActivePrice,
      productsWithoutCategory,
      variableSourceVariantsWithoutOptionValues,
    };

    process.stdout.write("=== Import diagnostics ===\n");
    printLine("Active categories", diagnostics.activeCategories);
    printLine("Archived categories", diagnostics.archivedCategories);
    printLine("Active products", diagnostics.activeProducts);
    printLine("Archived products", diagnostics.archivedProducts);
    printLine("Active variants", diagnostics.activeVariants);
    printLine("Archived variants", diagnostics.archivedVariants);
    printLine("Imported media assets", diagnostics.importedMediaAssets);
    printLine("Active products without primary image", diagnostics.productsWithoutPrimaryImage);
    printLine("Active variants without primary image", diagnostics.variantsWithoutPrimaryImage);
    printLine("Active products without active price", diagnostics.productsWithoutActivePrice);
    printLine("Active variants without active price", diagnostics.variantsWithoutActivePrice);
    printLine("Active products without category", diagnostics.productsWithoutCategory);
    printLine(
      "Active Woo variable-source variants without option values",
      diagnostics.variableSourceVariantsWithoutOptionValues
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown diagnostics error.";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});

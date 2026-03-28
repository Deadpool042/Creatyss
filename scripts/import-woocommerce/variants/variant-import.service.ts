import type { ImportWooCommerceEnv } from "../env";
import { importVariantPrimaryImage } from "../media/media-import.service";
import { createVariantPrice } from "../pricing/price.repository";
import type { PreparedWooProduct } from "../schemas";
import type { DbClient } from "../shared/db";
import { endProgress, logProgress } from "../shared/logging";
import { mapPreparedProductToImportedVariants } from "./variant-mappers";
import { syncVariantOptionSelections } from "./variant-option.repository";
import { createVariant, setVariantPrimaryImage } from "./variant.repository";

export type ImportedVariantRecord = {
  variantId: string;
  externalId: string;
  productId: string;
};

export type ImportVariantsResult = {
  importedVariants: ImportedVariantRecord[];
  importedImages: number;
};

function countTotalVariantsToImport(preparedProducts: readonly PreparedWooProduct[]): number {
  return preparedProducts.reduce((count, preparedProduct) => {
    if (preparedProduct.product.type !== "variable" || preparedProduct.variations.length === 0) {
      return count + 1;
    }

    return count + preparedProduct.variations.length;
  }, 0);
}

export async function importVariants(
  prisma: DbClient,
  input: {
    env: ImportWooCommerceEnv;
    priceListId: string;
    preparedProducts: readonly PreparedWooProduct[];
    productIdByExternalId: ReadonlyMap<string, string>;
    primaryImageIdByProductId: ReadonlyMap<string, string | null>;
    skipImages: boolean;
  }
): Promise<ImportVariantsResult> {
  const importedVariants: ImportedVariantRecord[] = [];
  const totalVariantsToImport = countTotalVariantsToImport(input.preparedProducts);

  let importedImages = 0;
  let importedVariantCount = 0;

  for (const preparedProduct of input.preparedProducts) {
    const productExternalId = `woo_product:${preparedProduct.product.id}`;
    const productId = input.productIdByExternalId.get(productExternalId);

    if (!productId) {
      continue;
    }

    const productRecord = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        storeId: true,
        productTypeId: true,
        slug: true,
      },
    });

    if (!productRecord) {
      continue;
    }

    const mappedVariants = mapPreparedProductToImportedVariants({
      product: preparedProduct.product,
      variations: preparedProduct.variations,
    });

    for (const mappedVariant of mappedVariants) {
      importedVariantCount += 1;
      logProgress(importedVariantCount, totalVariantsToImport, "Importing variants");

      const createdVariant = await createVariant(prisma, {
        productId,
        variant: mappedVariant,
      });

      if (mappedVariant.amount !== null) {
        await createVariantPrice(prisma, {
          priceListId: input.priceListId,
          variantId: createdVariant.id,
          amount: mappedVariant.amount,
          compareAtAmount: mappedVariant.compareAtAmount,
        });
      }

      await syncVariantOptionSelections(prisma, {
        productTypeId: productRecord.productTypeId,
        variantId: createdVariant.id,
        selections: mappedVariant.optionSelections,
      });

      if (!input.skipImages) {
        let variantPrimaryImageId: string | null = null;

        if (mappedVariant.image?.src && productRecord.slug) {
          const imageResult = await importVariantPrimaryImage(prisma, {
            env: input.env,
            storeId: productRecord.storeId,
            variantId: createdVariant.id,
            productSlug: productRecord.slug,
            image: mappedVariant.image,
            sortOrder: mappedVariant.sortOrder,
          });

          importedImages += imageResult.importedImages;
          variantPrimaryImageId = imageResult.primaryImageId;
        }

        if (variantPrimaryImageId === null) {
          variantPrimaryImageId = input.primaryImageIdByProductId.get(productId) ?? null;
        }

        if (variantPrimaryImageId !== null) {
          await setVariantPrimaryImage(prisma, createdVariant.id, variantPrimaryImageId);
        }
      }

      importedVariants.push({
        variantId: createdVariant.id,
        externalId: mappedVariant.externalId,
        productId,
      });
    }
  }

  if (totalVariantsToImport > 0) {
    endProgress(`Imported ${importedVariants.length} variants`);
  }

  return {
    importedVariants,
    importedImages,
  };
}

import type { ImportWooCommerceEnv } from "../env";
import { importVariantPrimaryImage } from "../media/media-import.service";
import type { PreparedWooProduct } from "../schemas";
import type { DbClient } from "../shared/db";
import { createVariantPrice } from "../pricing/price.repository";
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
};

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
          variantPrimaryImageId = await importVariantPrimaryImage(prisma, {
            env: input.env,
            storeId: productRecord.storeId,
            variantId: createdVariant.id,
            productSlug: productRecord.slug,
            image: mappedVariant.image,
            sortOrder: mappedVariant.sortOrder,
          });
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

  return {
    importedVariants,
  };
}

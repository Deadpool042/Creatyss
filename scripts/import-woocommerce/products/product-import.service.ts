import type { ImportWooCommerceEnv } from "../env";
import { importProductImages } from "../media/media-import.service";
import { normalizeMoneyToDecimalString, resolveCompareAtAmount } from "../normalizers/money";
import { replaceProductPrice } from "../pricing/price.repository";
import type { PreparedWooProduct } from "../schemas";
import type { DbClient } from "../shared/db";
import { endProgress, logProgress } from "../shared/logging";
import { replaceProductCategoryLinks } from "./product-category.repository";
import { mapWooProductToImportedProduct } from "./product-mappers";
import { setProductPrimaryImage, upsertImportedProduct } from "./product.repository";

export type ImportedProductRecord = {
  productId: string;
  externalId: string;
  productTypeId: string | null;
  primaryImageId: string | null;
};

export type ImportProductsResult = {
  importedProducts: ImportedProductRecord[];
  productIdByExternalId: Map<string, string>;
  primaryImageIdByProductId: Map<string, string | null>;
  importedImages: number;
  reusedImages: number;
  skippedImages: number;
  failedImages: number;
};

function buildProductCategoryLinks(
  categoryExternalIds: readonly string[],
  categoryIdByExternalId: ReadonlyMap<string, string>
) {
  return categoryExternalIds
    .map((externalId, index) => {
      const categoryId = categoryIdByExternalId.get(externalId);

      if (!categoryId) {
        return null;
      }

      return {
        categoryId,
        sortOrder: index,
        isPrimary: index === 0,
      };
    })
    .filter((value): value is NonNullable<typeof value> => value !== null);
}

export async function importProducts(
  prisma: DbClient,
  input: {
    env: ImportWooCommerceEnv;
    storeId: string;
    priceListId: string;
    productTypeId: string | null;
    preparedProducts: readonly PreparedWooProduct[];
    categoryIdByExternalId: ReadonlyMap<string, string>;
    skipImages: boolean;
  }
): Promise<ImportProductsResult> {
  const importedProducts: ImportedProductRecord[] = [];
  const productIdByExternalId = new Map<string, string>();
  const primaryImageIdByProductId = new Map<string, string | null>();

  let importedImages = 0;
  let reusedImages = 0;
  let skippedImages = 0;
  let failedImages = 0;

  for (const [index, preparedProduct] of input.preparedProducts.entries()) {
    logProgress(index + 1, input.preparedProducts.length, "Importing products");

    const mappedProduct = mapWooProductToImportedProduct(
      preparedProduct.product,
      input.productTypeId
    );

    const savedProduct = await upsertImportedProduct(prisma, input.storeId, mappedProduct);

    const categoryLinks = buildProductCategoryLinks(
      mappedProduct.categoryExternalIds,
      input.categoryIdByExternalId
    );

    await replaceProductCategoryLinks(prisma, savedProduct.id, categoryLinks);

    const amount =
      normalizeMoneyToDecimalString(preparedProduct.product.price) ??
      normalizeMoneyToDecimalString(preparedProduct.product.regular_price);

    if (amount !== null) {
      await replaceProductPrice(prisma, {
        priceListId: input.priceListId,
        productId: savedProduct.id,
        amount,
        compareAtAmount: resolveCompareAtAmount(
          amount,
          normalizeMoneyToDecimalString(preparedProduct.product.regular_price)
        ),
      });
    }

    let primaryImageId: string | null = null;

    if (!input.skipImages) {
      const imageResult = await importProductImages(prisma, {
        env: input.env,
        storeId: input.storeId,
        productId: savedProduct.id,
        productSlug: mappedProduct.slug,
        images: mappedProduct.images,
      });

      importedImages += imageResult.importedImages;
      reusedImages += imageResult.reusedImages;
      skippedImages += imageResult.skippedImages;
      failedImages += imageResult.failedImages;
      primaryImageId = imageResult.primaryImageId;

      if (primaryImageId !== null) {
        await setProductPrimaryImage(prisma, savedProduct.id, primaryImageId);
      }
    }

    importedProducts.push({
      productId: savedProduct.id,
      externalId: mappedProduct.externalId,
      productTypeId: savedProduct.productTypeId,
      primaryImageId,
    });

    productIdByExternalId.set(mappedProduct.externalId, savedProduct.id);
    primaryImageIdByProductId.set(savedProduct.id, primaryImageId);
  }

  if (input.preparedProducts.length > 0) {
    endProgress(`Imported ${importedProducts.length} products`);
  }

  return {
    importedProducts,
    productIdByExternalId,
    primaryImageIdByProductId,
    importedImages,
    reusedImages,
    skippedImages,
    failedImages,
  };
}

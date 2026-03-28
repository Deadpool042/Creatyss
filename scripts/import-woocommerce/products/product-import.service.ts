import type { ImportWooCommerceEnv } from "../env";
import { importProductImages } from "../media/media-import.service";
import type { DbClient } from "../shared/db";
import type { PreparedWooProduct } from "../schemas";
import { normalizeMoneyToDecimalString, resolveCompareAtAmount } from "../normalizers/money";
import { createProductPrice } from "../pricing/price.repository";
import { createProductCategoryLinks } from "./product-category.repository";
import { mapWooProductToImportedProduct } from "./product-mappers";
import { createProduct, setProductPrimaryImage } from "./product.repository";

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

  for (const preparedProduct of input.preparedProducts) {
    const mappedProduct = mapWooProductToImportedProduct(
      preparedProduct.product,
      input.productTypeId
    );

    const createdProduct = await createProduct(prisma, input.storeId, mappedProduct);

    const categoryLinks = buildProductCategoryLinks(
      mappedProduct.categoryExternalIds,
      input.categoryIdByExternalId
    );

    await createProductCategoryLinks(prisma, createdProduct.id, categoryLinks);

    const amount =
      normalizeMoneyToDecimalString(preparedProduct.product.price) ??
      normalizeMoneyToDecimalString(preparedProduct.product.regular_price);

    if (amount !== null) {
      await createProductPrice(prisma, {
        priceListId: input.priceListId,
        productId: createdProduct.id,
        amount,
        compareAtAmount: resolveCompareAtAmount(
          amount,
          normalizeMoneyToDecimalString(preparedProduct.product.regular_price)
        ),
      });
    }

    let primaryImageId: string | null = null;

    if (!input.skipImages) {
      primaryImageId = await importProductImages(prisma, {
        env: input.env,
        storeId: input.storeId,
        productId: createdProduct.id,
        productSlug: mappedProduct.slug,
        images: mappedProduct.images,
      });

      if (primaryImageId !== null) {
        await setProductPrimaryImage(prisma, createdProduct.id, primaryImageId);
      }
    }

    importedProducts.push({
      productId: createdProduct.id,
      externalId: mappedProduct.externalId,
      productTypeId: createdProduct.productTypeId,
      primaryImageId,
    });

    productIdByExternalId.set(mappedProduct.externalId, createdProduct.id);
    primaryImageIdByProductId.set(createdProduct.id, primaryImageId);
  }

  return {
    importedProducts,
    productIdByExternalId,
    primaryImageIdByProductId,
  };
}

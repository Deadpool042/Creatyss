import type { CreateAdminProductInput, UpdateAdminProductInput } from "@db-products/admin/product";
import { productExistsInTx } from "@db-products/queries/product";
import type { ProductTxClient } from "@db-products/types/tx";
import {
  replaceProductCategoriesInTx,
  ensureCategoriesExistInTx,
} from "@db-products/helpers/categories";
import { assertProductPublicationRulesInTx } from "./publication.transaction";
import { assertProductKindBusinessRules } from "@db-products/helpers/validation";

export async function createProductWithCategoriesInTx(
  tx: ProductTxClient,
  input: CreateAdminProductInput
): Promise<string> {
  const categoryIds = input.categoryIds ?? [];

  const createProductKindRulesInput: {
    productType: "simple" | "variable";
    productKind: "physical" | "digital" | "hybrid";
    simpleStockQuantity?: number | null;
    trackInventory?: boolean;
  } = {
    productType: input.productType,
    productKind: input.productKind,
  };

  if (input.simpleStockQuantity !== undefined) {
    createProductKindRulesInput.simpleStockQuantity = input.simpleStockQuantity;
  }

  if (input.trackInventory !== undefined) {
    createProductKindRulesInput.trackInventory = input.trackInventory;
  }

  assertProductKindBusinessRules(createProductKindRulesInput);

  const categoriesExist = await ensureCategoriesExistInTx(tx, categoryIds);

  if (!categoriesExist) {
    throw new Error("PRODUCT_CATEGORY_INVALID");
  }

  const effectiveTrackInventory =
    input.productKind === "digital" ? false : (input.trackInventory ?? true);
  const effectiveSimpleStockQuantity =
    input.productKind === "digital" ? null : (input.simpleStockQuantity ?? null);

  const created = await tx.product.create({
    data: {
      slug: input.slug,
      name: input.name,
      shortDescription: input.shortDescription ?? null,
      description: input.description ?? null,
      status: input.status ?? "draft",
      productType: input.productType,
      productKind: input.productKind,
      isFeatured: input.isFeatured ?? false,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
      publishedAt: input.publishedAt ?? null,
      simpleSku: input.simpleSku ?? null,
      simplePriceCents: input.simplePriceCents ?? null,
      simpleCompareAtCents: input.simpleCompareAtCents ?? null,
      simpleStockQuantity: effectiveSimpleStockQuantity,
      trackInventory: effectiveTrackInventory,
    },
    select: {
      id: true,
    },
  });

  await replaceProductCategoriesInTx(tx, created.id, categoryIds);

  await assertProductPublicationRulesInTx(tx, {
    productId: created.id,
    status: input.status ?? "draft",
    productKind: input.productKind,
  });

  return created.id;
}

export async function updateProductWithCategoriesInTx(
  tx: ProductTxClient,
  input: UpdateAdminProductInput
): Promise<boolean> {
  const currentProduct = await tx.product.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true,
      status: true,
      productKind: true,
      trackInventory: true,
      simpleStockQuantity: true,
    },
  });

  if (!currentProduct) {
    return false;
  }

  const updateProductKindRulesInput: {
    productType: "simple" | "variable";
    productKind: "physical" | "digital" | "hybrid";
    simpleStockQuantity?: number | null;
    trackInventory?: boolean;
  } = {
    productType: input.productType,
    productKind: input.productKind,
  };

  if (input.simpleStockQuantity !== undefined) {
    updateProductKindRulesInput.simpleStockQuantity = input.simpleStockQuantity;
  }

  if (input.trackInventory !== undefined) {
    updateProductKindRulesInput.trackInventory = input.trackInventory;
  }

  assertProductKindBusinessRules(updateProductKindRulesInput);

  const categoryIds = input.categoryIds ?? [];
  const categoriesExist = await ensureCategoriesExistInTx(tx, categoryIds);

  if (!categoriesExist) {
    throw new Error("PRODUCT_CATEGORY_INVALID");
  }

  const effectiveTrackInventory =
    input.productKind === "digital"
      ? false
      : (input.trackInventory ?? currentProduct.trackInventory);
  const effectiveSimpleStockQuantity =
    input.productKind === "digital"
      ? null
      : input.simpleStockQuantity !== undefined
        ? input.simpleStockQuantity
        : currentProduct.simpleStockQuantity;

  const productData: {
    slug: string;
    name: string;
    shortDescription: string | null;
    description: string | null;
    productType: "simple" | "variable";
    productKind: "physical" | "digital" | "hybrid";
    seoTitle: string | null;
    seoDescription: string | null;
    simpleSku: string | null;
    simplePriceCents: number | null;
    simpleCompareAtCents: number | null;
    simpleStockQuantity: number | null;
    status?: "draft" | "published" | "archived";
    isFeatured?: boolean;
    publishedAt?: Date | null;
    trackInventory: boolean;
  } = {
    slug: input.slug,
    name: input.name,
    shortDescription: input.shortDescription ?? null,
    description: input.description ?? null,
    productType: input.productType,
    productKind: input.productKind,
    seoTitle: input.seoTitle ?? null,
    seoDescription: input.seoDescription ?? null,
    simpleSku: input.simpleSku ?? null,
    simplePriceCents: input.simplePriceCents ?? null,
    simpleCompareAtCents: input.simpleCompareAtCents ?? null,
    simpleStockQuantity: effectiveSimpleStockQuantity,
    trackInventory: effectiveTrackInventory,
  };

  if (input.status !== undefined) {
    productData.status = input.status;
  }

  if (input.isFeatured !== undefined) {
    productData.isFeatured = input.isFeatured;
  }

  if (input.publishedAt !== undefined) {
    productData.publishedAt = input.publishedAt;
  }

  await tx.product.update({
    where: {
      id: input.id,
    },
    data: productData,
  });

  await replaceProductCategoriesInTx(tx, input.id, categoryIds);

  await assertProductPublicationRulesInTx(tx, {
    productId: input.id,
    status: input.status ?? currentProduct.status,
    productKind: input.productKind,
  });

  return true;
}

export async function deleteProductInTx(tx: ProductTxClient, productId: string): Promise<boolean> {
  const exists = await productExistsInTx(tx, productId);

  if (!exists) {
    return false;
  }

  await tx.product.delete({
    where: {
      id: productId,
    },
  });

  return true;
}

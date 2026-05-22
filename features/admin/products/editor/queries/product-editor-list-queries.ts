import "server-only";

// ─── list-admin-product-category-options ─────────────────────────────────────

import { db } from "@/core/db";
import type {
  AttachableMediaAssetsData,
  AttachableMediaAssetItem,
} from "../types";

export async function listAdminProductCategoryOptions() {
  const categories = await db.category.findMany({
    where: {
      archivedAt: null,
    },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      parent: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    parentId: category.parent?.id ?? null,
    parentName: category.parent?.name ?? null,
  }));
}

// ─── list-admin-product-type-options ─────────────────────────────────────────

export async function listAdminProductTypeOptions(input: {
  storeId: string;
}) {
  return db.productType.findMany({
    where: {
      storeId: input.storeId,
      archivedAt: null,
    },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
      slug: true,
      isActive: true,
    },
  });
}

// ─── list-admin-related-product-options ──────────────────────────────────────

type ListAdminRelatedProductOptionsInput = {
  storeId: string;
  excludeProductId?: string;
};

export type AdminRelatedProductOptionStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export type AdminRelatedProductOption = {
  id: string;
  name: string;
  slug: string;
  status: AdminRelatedProductOptionStatus;
};

export async function listAdminRelatedProductOptions(
  input: ListAdminRelatedProductOptionsInput,
): Promise<AdminRelatedProductOption[]> {
  const products = await db.product.findMany({
    where: {
      storeId: input.storeId,
      archivedAt: null,
      ...(input.excludeProductId
        ? {
            id: {
              not: input.excludeProductId,
            },
          }
        : {}),
    },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
    },
  });

  return products.map<AdminRelatedProductOption>((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug ?? "",
    status:
      product.status === "ACTIVE"
        ? "active"
        : product.status === "INACTIVE"
          ? "inactive"
          : product.status === "ARCHIVED"
            ? "archived"
            : "draft",
  }));
}

// ─── list-attachable-media-assets ────────────────────────────────────────────

export async function listAttachableMediaAssets(
  productId: string,
): Promise<AttachableMediaAssetsData> {
  const assets = await db.mediaAsset.findMany({
    where: {
      archivedAt: null,
    },
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      publicUrl: true,
      altText: true,
      originalFilename: true,
      createdAt: true,
    },
  });

  const items: AttachableMediaAssetItem[] = assets
    .filter(
      (asset) =>
        typeof asset.publicUrl === "string" && asset.publicUrl.length > 0,
    )
    .map((asset) => ({
      id: asset.id,
      publicUrl: asset.publicUrl as string,
      altText: asset.altText,
      originalFilename: asset.originalFilename,
      createdAt: asset.createdAt.toISOString(),
    }));

  return {
    productId,
    items,
  };
}

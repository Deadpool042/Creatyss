import { MediaReferenceRole, ProductStatus, ProductVariantStatus } from "@prisma-generated/client";

import type { AdminProductEditorData } from "../types/product-editor.types";

type ProductEditorMediaReferenceSource = {
  role: MediaReferenceRole;
  sortOrder: number;
  isPrimary: boolean;
  asset: {
    id: string;
    publicUrl: string | null;
    altText: string | null;
  };
};

type ProductEditorSource = {
  product: {
    id: string;
    slug: string | null;
    name: string;
    shortDescription: string | null;
    description: string | null;
    status: ProductStatus;
    isFeatured: boolean;
    primaryImageId: string | null;
    productCategories: Array<{
      isPrimary: boolean;
      sortOrder: number;
      category: {
        id: string;
        slug: string;
        name: string;
      };
    }>;
    variants: Array<{
      id: string;
      slug: string | null;
      name: string | null;
      sku: string;
      status: ProductVariantStatus;
      primaryImage: {
        publicUrl: string | null;
        altText: string | null;
      } | null;
      prices: Array<{
        amount: { toString(): string };
        compareAtAmount: { toString(): string } | null;
      }>;
    }>;
  };
  mediaReferences: ProductEditorMediaReferenceSource[];
};

function decimalToString(value: { toString(): string } | null): string {
  return value ? value.toString() : "";
}

function mapProductStatusToAdminStatus(status: ProductStatus): AdminProductEditorData["status"] {
  if (status === ProductStatus.ACTIVE) {
    return "published";
  }

  if (status === ProductStatus.ARCHIVED) {
    return "archived";
  }

  return "draft";
}

function mapVariantStatusToAdminStatus(
  status: ProductVariantStatus
): AdminProductEditorData["variants"][number]["status"] {
  if (status === ProductVariantStatus.ACTIVE) {
    return "published";
  }

  if (status === ProductVariantStatus.ARCHIVED) {
    return "archived";
  }

  return "draft";
}

export function mapProductEditorData(input: ProductEditorSource): AdminProductEditorData {
  const { product, mediaReferences } = input;

  const categories = product.productCategories.map((item) => ({
    id: item.category.id,
    slug: item.category.slug,
    name: item.category.name,
    isPrimary: item.isPrimary,
    sortOrder: item.sortOrder,
  }));

  const categoryIds = categories.map((category) => category.id);

  const images = mediaReferences
    .filter(
      (reference) =>
        reference.role === MediaReferenceRole.GALLERY ||
        reference.role === MediaReferenceRole.PRIMARY
    )
    .map((reference) => ({
      id: reference.asset.id,
      url: reference.asset.publicUrl ?? "",
      alt: reference.asset.altText ?? "",
      isPrimary:
        reference.asset.id === product.primaryImageId ||
        reference.isPrimary ||
        reference.role === MediaReferenceRole.PRIMARY,
      sortOrder: reference.sortOrder,
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder);

  const variants = product.variants.map((variant) => {
    const activePrice = variant.prices[0] ?? null;

    return {
      id: variant.id,
      slug: variant.slug ?? "",
      name: variant.name ?? "",
      sku: variant.sku,
      status: mapVariantStatusToAdminStatus(variant.status),
      amount: decimalToString(activePrice?.amount ?? null),
      compareAtAmount: decimalToString(activePrice?.compareAtAmount ?? null),
      primaryImageUrl: variant.primaryImage?.publicUrl ?? null,
      primaryImageAlt: variant.primaryImage?.altText ?? null,
    };
  });

  return {
    id: product.id,
    slug: product.slug ?? "",
    name: product.name,
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    status: mapProductStatusToAdminStatus(product.status),
    isFeatured: product.isFeatured,
    categoryIds,
    categories,
    images,
    variants,
    seo: {
      title: product.name,
      description: product.shortDescription ?? "",
    },
  };
}

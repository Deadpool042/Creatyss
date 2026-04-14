import { ProductVariantStatus } from "@/prisma-generated/client";
import type { AdminProductVariantListItem } from "@/features/admin/products/editor/types/product-variants.types";

type ProductVariantListSource = {
  id: string;
  slug: string | null;
  name: string | null;
  sku: string;
  status: ProductVariantStatus;
  isDefault: boolean;
  sortOrder: number;
  barcode: string | null;
  externalReference: string | null;
  weightGrams: number | null;
  widthMm: number | null;
  heightMm: number | null;
  depthMm: number | null;
  primaryImageId: string | null;
  primaryImage: {
    publicUrl: string | null;
    storageKey: string | null;
    altText: string | null;
  } | null;
  optionValues?: Array<{
    optionValue: {
      id: string;
      value: string;
      label: string | null;
      option: {
        id: string;
        name: string;
      };
    };
  }>;
};

function mapStatus(status: ProductVariantStatus): AdminProductVariantListItem["status"] {
  switch (status) {
    case ProductVariantStatus.ACTIVE:
      return "active";
    case ProductVariantStatus.INACTIVE:
      return "inactive";
    case ProductVariantStatus.ARCHIVED:
      return "archived";
    default:
      return "draft";
  }
}

export function mapAdminProductVariantListItem(
  variant: ProductVariantListSource
): AdminProductVariantListItem {
  return {
    id: variant.id,
    slug: variant.slug,
    name: variant.name,
    sku: variant.sku,
    status: mapStatus(variant.status),
    isDefault: variant.isDefault,
    sortOrder: variant.sortOrder,
    barcode: variant.barcode,
    externalReference: variant.externalReference,
    weightGrams: variant.weightGrams?.toString() ?? null,
    widthMm: variant.widthMm?.toString() ?? null,
    heightMm: variant.heightMm?.toString() ?? null,
    depthMm: variant.depthMm?.toString() ?? null,
    primaryImageId: variant.primaryImageId,
    primaryImageUrl: variant.primaryImage?.publicUrl ?? null,
    primaryImageStorageKey: variant.primaryImage?.storageKey ?? null,
    primaryImageAltText: variant.primaryImage?.altText ?? null,
    availability: {
      status: "unavailable",
      isSellable: false,
      backorderAllowed: false,
      sellableFrom: null,
      sellableUntil: null,
      preorderStartsAt: null,
      preorderEndsAt: null,
    },
    inventory: {
      onHandQuantity: 0,
      reservedQuantity: 0,
      availableQuantity: 0,
      hasInventoryRecord: false,
    },
    optionValues:
      variant.optionValues?.map((item) => ({
        optionName: item.optionValue.option.name,
        value: item.optionValue.label ?? item.optionValue.value,
        optionValueId: item.optionValue.id,
        optionId: item.optionValue.option.id,
      })) ?? [],
  };
}

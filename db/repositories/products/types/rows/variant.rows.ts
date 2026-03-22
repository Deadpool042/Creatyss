import type { Prisma } from "@prisma/client";
import { productVariantImageSelect } from "./image.rows";

export const productCategorySelect = {
  category: {
    select: {
      id: true,
      slug: true,
      name: true,
    },
  },
} satisfies Prisma.ProductCategorySelect;

export const productVariantSelect = {
  id: true,
  productId: true,
  name: true,
  colorName: true,
  colorHex: true,
  sku: true,
  priceCents: true,
  compareAtCents: true,
  stockQuantity: true,
  trackInventory: true,
  isDefault: true,
  status: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
  images: {
    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
    select: productVariantImageSelect,
  },
} satisfies Prisma.ProductVariantSelect;

export type ProductVariantRow = Prisma.ProductVariantGetPayload<{
  select: typeof productVariantSelect;
}>;

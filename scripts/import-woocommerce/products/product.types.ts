import { type ProductStatus } from "../../../src/generated/prisma/client";
import type { WooImage } from "../schemas";

export type ImportedProductInput = {
  externalId: string;
  productTypeId: string | null;
  slug: string;
  name: string;
  skuRoot: string | null;
  shortDescription: string | null;
  description: string | null;
  status: ProductStatus;
  isFeatured: boolean;
  isStandalone: boolean;
  publishedAt: Date | null;
  categoryExternalIds: string[];
  images: WooImage[];
};

export type ImportedProductCategoryLinkInput = {
  categoryId: string;
  sortOrder: number;
  isPrimary: boolean;
};

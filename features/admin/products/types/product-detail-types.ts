import { type AdminProductImage } from "@/db/repositories/products/admin-product-image.types";

export type { AdminCategory } from "@/db/repositories/admin-category.types";
export type { AdminMediaAsset } from "@/db/repositories/admin-media.types";
export type { AdminProductDetail, AdminProductSummary } from "@/db/repositories/products/admin-product.types";
export type { AdminProductImage };
export type { AdminProductVariant } from "@/db/repositories/products/admin-product-variant.types";

export type ProductDetailSearchParams = Record<string, string | string[] | undefined>;

export type PrimaryImageScope = "product" | "variant";

export type PrimaryImageState = {
  primaryImage: AdminProductImage | null;
  displayImage: AdminProductImage | null;
  extraImageCount: number;
  usesFallbackImage: boolean;
};

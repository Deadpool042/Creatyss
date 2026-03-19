import { type AdminProductImage } from "@/db/repositories/admin-product-image.repository";

export type { AdminCategory } from "@/db/repositories/admin-category.repository";
export type { AdminMediaAsset } from "@/db/admin-media";
export type { AdminProductDetail, AdminProductSummary } from "@/db/repositories/admin-product.repository";
export type { AdminProductImage };
export type { AdminProductVariant } from "@/db/repositories/admin-product-variant.repository";

export type ProductDetailSearchParams = Record<string, string | string[] | undefined>;

export type PrimaryImageScope = "product" | "variant";

export type PrimaryImageState = {
  primaryImage: AdminProductImage | null;
  displayImage: AdminProductImage | null;
  extraImageCount: number;
  usesFallbackImage: boolean;
};

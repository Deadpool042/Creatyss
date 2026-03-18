import { type AdminProductImage } from "@/db/repositories/admin-product-image.repository";

export type ProductDetailSearchParams = Record<
  string,
  string | string[] | undefined
>;

export type PrimaryImageScope = "product" | "variant";

export type PrimaryImageState = {
  primaryImage: AdminProductImage | null;
  displayImage: AdminProductImage | null;
  extraImageCount: number;
  usesFallbackImage: boolean;
};

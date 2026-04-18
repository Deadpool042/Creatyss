import type { AdminProductActionResult } from "@/features/admin/products/types";

export type ToggleProductFeaturedInput = {
  productId: string;
};

export type ToggleProductFeaturedResult = AdminProductActionResult & {
  isFeatured?: boolean;
};

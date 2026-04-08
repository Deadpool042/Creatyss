//features/admin/products/navigation/types/products-page-params.types.ts
export type ProductsPageStatusParam = "" | "published" | "draft" | "archived";

export type ProductsPageFeaturedParam = "" | "featured" | "standard";

export type ProductsPageParams = {
  search: string;
  status: ProductsPageStatusParam;
  category: string;
  featured: ProductsPageFeaturedParam;
};

export type RawProductsPageSearchParams =
  | Record<string, string | string[] | undefined>
  | URLSearchParams
  | undefined;

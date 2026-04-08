export type AdminProductsListStatusFilter = "all" | "draft" | "published" | "archived";

export type AdminProductsListFeaturedFilter = "all" | "featured" | "standard";

export type AdminProductsListFilters = {
  query: string;
  status: AdminProductsListStatusFilter;
  categoryId: string | null;
  parentCategoryId: string | null;
  featured: AdminProductsListFeaturedFilter;
  page: number;
};

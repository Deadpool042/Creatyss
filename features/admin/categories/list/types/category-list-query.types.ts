import type { AdminCategoryCardItem, AdminCategoryStatus } from "./admin-category-card-item.types";

export type CategorySortOption = "name-asc" | "name-desc" | "updated-asc" | "updated-desc";
export type CategoryFeaturedFilter = "featured" | "not-featured";

export type CategoryPickerItem = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

export type CategoryListFilters = {
  search?: string;
  status?: AdminCategoryStatus[];
  featured?: CategoryFeaturedFilter[];
  categorySlugs?: string[];
  sort?: CategorySortOption;
  page?: number;
  perPage?: number;
};

export type CategoryStatusCounts = Partial<Record<AdminCategoryStatus, number>>;

export type CategoryListResult = {
  items: AdminCategoryCardItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  statusCounts: CategoryStatusCounts;
};

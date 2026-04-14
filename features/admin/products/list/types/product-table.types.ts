// features/admin/products/list/types/product-table.types.ts
export type ProductTableStatus = "draft" | "active" | "inactive" | "archived";

export type ProductStockState = "in-stock" | "out-of-stock";

export type ProductFilterFeaturedOption = "all" | "featured" | "standard";
export type ProductFilterImageOption = "all" | "with-image" | "without-image";
export type ProductFilterStockOption = "all" | "in-stock" | "out-of-stock";
export type ProductFilterVariantOption = "all" | "single" | "multiple";

export type ProductSortOption = "updated-desc" | "updated-asc" | "name-asc" | "name-desc";

export type ProductTableFeaturedFilter = ProductFilterFeaturedOption;
export type ProductTableImageFilter = ProductFilterImageOption;
export type ProductTableStockFilter = ProductFilterStockOption;
export type ProductTableVariantFilter = ProductFilterVariantOption;
export type ProductTableSortOption = ProductSortOption;

export type ProductTableStatusFilter = "all" | ProductTableStatus;

export type ProductFilterCategoryOption = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  productCount: number;
};

export type ProductTableItem = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  status: ProductTableStatus;
  isFeatured: boolean;
  primaryImageUrl: string | null;
  primaryImageAlt: string | null;
  categoryNames: string[];
  categoryPathLabel: string;
  productTypeName: string | null;
  variantCount: number;
  stockState: ProductStockState;
  stockQuantity: number | null;
  priceLabel: string;
  compareAtPriceLabel: string;
  hasPromotion: boolean;
  updatedAt: string;
};

export type ProductTableFiltersInput = {
  search?: string | null;
  status?: ProductTableStatusFilter;
  categoryId?: string | null;
  parentCategoryId?: string | null;
  featured?: ProductFilterFeaturedOption;
  image?: ProductFilterImageOption;
  stock?: ProductFilterStockOption;
  variant?: ProductFilterVariantOption;
  sort?: ProductSortOption;
};

export type ProductTableFiltersValues = {
  search: string;
  status: ProductTableStatusFilter;
  categoryId: string;
  parentCategoryId: string;
  featured: ProductFilterFeaturedOption;
  image: ProductFilterImageOption;
  stock: ProductFilterStockOption;
  variant: ProductFilterVariantOption;
  sort: ProductSortOption;
};

export type ProductTableActiveFilter = {
  key: string;
  label: string;
  onRemove: () => void;
};

export type ProductTableFiltersState = {
  search: string;
  setSearch: (value: string) => void;
  handleSearchChange: (value: string) => void;

  status: ProductTableStatusFilter;
  setStatus: (value: ProductTableStatusFilter) => void;

  categoryId: string;
  setCategoryId: (value: string) => void;

  parentCategoryId: string;
  setParentCategoryId: (value: string) => void;

  featured: ProductFilterFeaturedOption;
  setFeatured: (value: ProductFilterFeaturedOption) => void;

  image: ProductFilterImageOption;
  setImage: (value: ProductFilterImageOption) => void;

  stock: ProductFilterStockOption;
  setStock: (value: ProductFilterStockOption) => void;

  variant: ProductFilterVariantOption;
  setVariant: (value: ProductFilterVariantOption) => void;

  sort: ProductSortOption;
  setSort: (value: ProductSortOption) => void;

  categoryOptions: ProductFilterCategoryOption[];
  allFilteredProducts: ProductTableItem[];
  paginated: ProductTableItem[];
  currentPage: number;
  totalPages: number;
  goPrevious: () => void;
  goNext: () => void;

  filteredCount: number;
  activeFilters: ProductTableActiveFilter[];
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (value: boolean) => void;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (value: boolean) => void;
  reset: () => void;
};

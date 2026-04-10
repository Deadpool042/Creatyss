import { useMemo, useState } from "react";
import type { AdminDataTableActiveFilterItem } from "@/components/admin/tables/admin-data-table-active-filters";
import type {
  ProductFilterCategoryOption,
  ProductFilterFeaturedOption,
  ProductFilterImageOption,
  ProductFilterStockOption,
  ProductFilterVariantOption,
  ProductSortOption,
  ProductTableFiltersState,
  ProductTableItem,
  ProductTableStatusFilter,
} from "../types";

type UseProductTableFiltersInput = {
  products: ProductTableItem[];
  categoryOptions: ProductFilterCategoryOption[];
};

const PAGE_SIZE = 24;

export function useProductTableFilters({
  products,
  categoryOptions,
}: UseProductTableFiltersInput): ProductTableFiltersState {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductTableStatusFilter>("all");
  const [categoryId, setCategoryId] = useState("all");
  const [parentCategoryFilter, setParentCategoryFilter] = useState("all");
  const [featured, setFeatured] = useState<ProductFilterFeaturedOption>("all");
  const [image, setImage] = useState<ProductFilterImageOption>("all");
  const [stock, setStock] = useState<ProductFilterStockOption>("all");
  const [variant, setVariant] = useState<ProductFilterVariantOption>("all");
  const [sort, setSort] = useState<ProductSortOption>("updated-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const normalizedStatus = status === "published" ? "active" : status;

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim().length > 0) {
      const normalized = search.trim().toLowerCase();
      result = result.filter((product) => product.name.toLowerCase().includes(normalized));
    }

    if (normalizedStatus !== "all") {
      result = result.filter((product) => product.status === normalizedStatus);
    }

    if (featured === "featured") {
      result = result.filter((product) => product.isFeatured);
    } else if (featured === "standard") {
      result = result.filter((product) => !product.isFeatured);
    }

    if (image === "with-image") {
      result = result.filter((product) => Boolean(product.primaryImageUrl));
    } else if (image === "without-image") {
      result = result.filter((product) => !product.primaryImageUrl);
    }

    if (stock === "in-stock") {
      result = result.filter((product) => product.stockState === "in-stock");
    } else if (stock === "out-of-stock") {
      result = result.filter((product) => product.stockState === "out-of-stock");
    }

    if (variant === "single" || variant === "single-variant") {
      result = result.filter((product) => product.variantCount <= 1);
    } else if (variant === "multiple" || variant === "multi-variant" || variant === "with-variants") {
      result = result.filter((product) => product.variantCount > 1);
    } else if (variant === "without-variants") {
      result = result.filter((product) => product.variantCount === 0);
    }

    if (categoryId !== "all") {
      const selectedCategory = categoryOptions.find((entry) => entry.id === categoryId);
      if (selectedCategory) {
        result = result.filter((product) => product.categoryNames.includes(selectedCategory.name));
      }
    }

    switch (sort) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name, "fr"));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name, "fr"));
        break;
      case "created-asc":
      case "updated-asc":
        result.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
        break;
      case "price-asc":
      case "price-desc":
      case "created-desc":
      case "updated-desc":
      default:
        result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        break;
    }

    return result;
  }, [
    products,
    search,
    normalizedStatus,
    categoryId,
    featured,
    image,
    stock,
    variant,
    sort,
    categoryOptions,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  function reset(): void {
    setSearch("");
    setStatus("all");
    setCategoryId("all");
    setParentCategoryFilter("all");
    setFeatured("all");
    setImage("all");
    setStock("all");
    setVariant("all");
    setSort("updated-desc");
    setCurrentPage(1);
  }

  const activeFilters: AdminDataTableActiveFilterItem[] = [
    ...(normalizedStatus !== "all"
      ? [{ key: "status", label: String(status), onRemove: () => setStatus("all") }]
      : []),
    ...(categoryId !== "all"
      ? [{ key: "category", label: categoryId, onRemove: () => setCategoryId("all") }]
      : []),
    ...(featured !== "all"
      ? [{ key: "featured", label: featured, onRemove: () => setFeatured("all") }]
      : []),
    ...(image !== "all"
      ? [{ key: "image", label: image, onRemove: () => setImage("all") }]
      : []),
    ...(stock !== "all"
      ? [{ key: "stock", label: stock, onRemove: () => setStock("all") }]
      : []),
    ...(variant !== "all"
      ? [{ key: "variant", label: variant, onRemove: () => setVariant("all") }]
      : []),
    ...(search.trim().length > 0
      ? [{ key: "search", label: search.trim(), onRemove: () => setSearch("") }]
      : []),
  ];

  return {
    search,
    setSearch,
    handleSearchChange: setSearch,

    status,
    setStatus,
    statusFilter: status,
    setStatusFilter: setStatus,

    categoryId,
    setCategoryId,
    categoryFilter: categoryId,
    setCategoryFilter: setCategoryId,

    parentCategoryFilter,
    setParentCategoryFilter,

    featured,
    setFeatured,
    featuredFilter: featured,
    setFeaturedFilter: setFeatured,

    image,
    setImage,
    imageFilter: image,
    setImageFilter: setImage,

    stock,
    setStock,
    stockFilter: stock,
    setStockFilter: setStock,

    variant,
    setVariant,
    variantFilter: variant,
    setVariantFilter: setVariant,

    sort,
    setSort,
    sortOption: sort,
    setSortOption: setSort,

    categoryOptions,
    paginated,
    currentPage: safeCurrentPage,
    totalPages,
    goPrevious: () => setCurrentPage((value) => Math.max(1, value - 1)),
    goNext: () => setCurrentPage((value) => Math.min(totalPages, value + 1)),

    filteredCount: filtered.length,
    activeFilters,
    showAdvancedFilters,
    setShowAdvancedFilters,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    reset,
  };
}

export type { ProductTableFiltersState } from "../types";

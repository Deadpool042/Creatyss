import { useMemo, useState } from "react";
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

function sortCategories(
  left: ProductFilterCategoryOption,
  right: ProductFilterCategoryOption
): number {
  return left.name.localeCompare(right.name, "fr");
}

export function useProductTableFilters({
  products,
  categoryOptions,
}: UseProductTableFiltersInput): ProductTableFiltersState {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductTableStatusFilter>("all");
  const [categoryId, setCategoryId] = useState("all");
  const [parentCategoryId, setParentCategoryId] = useState("all");
  const [featured, setFeatured] = useState<ProductFilterFeaturedOption>("all");
  const [image, setImage] = useState<ProductFilterImageOption>("all");
  const [stock, setStock] = useState<ProductFilterStockOption>("all");
  const [variant, setVariant] = useState<ProductFilterVariantOption>("all");
  const [sort, setSort] = useState<ProductSortOption>("updated-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredCategoryOptions = useMemo(() => {
    if (parentCategoryId === "all") {
      return categoryOptions;
    }

    return categoryOptions.filter(
      (category) => category.id === parentCategoryId || category.parentId === parentCategoryId
    );
  }, [categoryOptions, parentCategoryId]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim().length > 0) {
      const normalizedSearch = search.trim().toLowerCase();
      result = result.filter((product) => {
        return (
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.slug.toLowerCase().includes(normalizedSearch) ||
          product.categoryNames.some((categoryName) =>
            categoryName.toLowerCase().includes(normalizedSearch)
          )
        );
      });
    }

    if (status !== "all") {
      result = result.filter((product) => product.status === status);
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

    if (variant === "single") {
      result = result.filter((product) => product.variantCount <= 1);
    } else if (variant === "multiple") {
      result = result.filter((product) => product.variantCount > 1);
    }

    if (categoryId !== "all") {
      const selectedCategory = categoryOptions.find((category) => category.id === categoryId);

      if (selectedCategory) {
        result = result.filter((product) =>
          product.categoryNames.includes(selectedCategory.name)
        );
      }
    }

    switch (sort) {
      case "name-asc":
        result.sort((left, right) => left.name.localeCompare(right.name, "fr"));
        break;
      case "name-desc":
        result.sort((left, right) => right.name.localeCompare(left.name, "fr"));
        break;
      case "updated-asc":
        result.sort((left, right) => left.updatedAt.localeCompare(right.updatedAt));
        break;
      case "updated-desc":
      default:
        result.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
        break;
    }

    return result;
  }, [
    categoryId,
    categoryOptions,
    featured,
    image,
    products,
    search,
    sort,
    status,
    stock,
    variant,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  function reset(): void {
    setSearch("");
    setStatus("all");
    setCategoryId("all");
    setParentCategoryId("all");
    setFeatured("all");
    setImage("all");
    setStock("all");
    setVariant("all");
    setSort("updated-desc");
    setCurrentPage(1);
  }

  const activeFilters = [
    ...(status !== "all"
      ? [
          {
            key: "status",
            label: `Statut · ${status}`,
            onRemove: () => setStatus("all"),
          },
        ]
      : []),
    ...(categoryId !== "all"
      ? [
          {
            key: "category",
            label:
              `Catégorie · ${
                categoryOptions.find((category) => category.id === categoryId)?.name ?? categoryId
              }`,
            onRemove: () => setCategoryId("all"),
          },
        ]
      : []),
    ...(featured !== "all"
      ? [
          {
            key: "featured",
            label: featured === "featured" ? "Mis en avant" : "Standard",
            onRemove: () => setFeatured("all"),
          },
        ]
      : []),
    ...(image !== "all"
      ? [
          {
            key: "image",
            label: image === "with-image" ? "Avec image" : "Sans image",
            onRemove: () => setImage("all"),
          },
        ]
      : []),
    ...(stock !== "all"
      ? [
          {
            key: "stock",
            label: stock === "in-stock" ? "En stock" : "Rupture",
            onRemove: () => setStock("all"),
          },
        ]
      : []),
    ...(variant !== "all"
      ? [
          {
            key: "variant",
            label: variant === "single" ? "Simple" : "Multi-variantes",
            onRemove: () => setVariant("all"),
          },
        ]
      : []),
    ...(search.trim().length > 0
      ? [
          {
            key: "search",
            label: `Recherche · ${search.trim()}`,
            onRemove: () => setSearch(""),
          },
        ]
      : []),
  ];

  return {
    search,
    setSearch,
    handleSearchChange: setSearch,

    status,
    setStatus,

    categoryId,
    setCategoryId,

    parentCategoryId,
    setParentCategoryId,

    featured,
    setFeatured,

    image,
    setImage,

    stock,
    setStock,

    variant,
    setVariant,

    sort,
    setSort,

    categoryOptions: filteredCategoryOptions.sort(sortCategories),
    allFilteredProducts: filtered,
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

export type { ProductTableFiltersState } from "../types/product-table.types";

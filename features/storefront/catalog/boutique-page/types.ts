export type BoutiqueSortValue =
  | "featured"
  | "newest"
  | "name"
  | "price-asc"
  | "price-desc";
export type BoutiqueAvailabilityValue = "in-stock" | "made-to-order" | "unavailable";

export type BoutiqueCategoryItem = {
  id: string;
  parentId: string | null;
  slug: string;
  name: string;
  href: string;
  isActive: boolean;
  visual: {
    src: string;
    alt: string;
  } | null;
};

export type BoutiqueQuickFilterItem = {
  id: "all" | "newest" | "available" | "featured";
  label: string;
  href: string;
  isActive: boolean;
};

export type BoutiqueActiveFilterItem = {
  key:
    | "q"
    | "category"
    | "availability"
    | "minPrice"
    | "maxPrice"
    | "priceRange"
    | "sort";
  label: string;
  clearHref: string;
};

export type BoutiqueProductCardItem = {
  id: string;
  slug: string;
  name: string;
  price: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  availabilityStatus: BoutiqueAvailabilityValue;
  variantCount: number;
  colorCount: number;
  summary: string | null;
  image: {
    src: string;
    alt: string;
  } | null;
};

export type BoutiquePageViewModel = {
  headingEyebrow: "Sélection" | "Boutique";
  headingTitle: "Produits à découvrir" | "Produits publiés";
  headingDescription: string | null;
  resultCountLabel: string;
  selectedSort: BoutiqueSortValue;
  selectedCategorySlug: string;
  searchQuery: string;
  onlyAvailable: boolean;
  selectedMinPriceCents: number | null;
  selectedMaxPriceCents: number | null;
  totalProductCount: number;
  resetHref: string;
  activeFilterLabels: BoutiqueActiveFilterItem[];
  availabilityOptions: Array<{
    id: BoutiqueAvailabilityValue;
    label: string;
    count: number | null;
  }>;
  selectedAvailabilityStatus: BoutiqueAvailabilityValue | null;
  apiFilters: {
    q: string | null;
    category: string | null;
    availability: BoutiqueAvailabilityValue | null;
    minPrice: number | null;
    maxPrice: number | null;
    sort: BoutiqueSortValue;
  };
  pagination: {
    pageSize: number;
    currentPage: number;
    totalPages: number;
    items: Array<
      | { kind: "page"; pageNumber: number; href: string; isCurrent: boolean }
      | { kind: "ellipsis"; key: string }
    >;
    previousHref: string | null;
    nextHref: string | null;
  };
  quickFilters: BoutiqueQuickFilterItem[];
  categories: BoutiqueCategoryItem[];
  filterCategories: BoutiqueCategoryItem[];
  products: BoutiqueProductCardItem[];
  heroImage: {
    lightSrc: string;
    darkSrc: string;
  } | null;
};

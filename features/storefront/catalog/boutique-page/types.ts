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
  label: string;
  clearHref: string | null;
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
  availableProductCount: number;
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
    nextCursor: string | null;
    hasMore: boolean;
    pageSize: number;
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

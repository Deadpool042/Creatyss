import type {
  BoutiqueActiveFilterItem,
  BoutiqueAvailabilityValue,
  BoutiquePageViewModel,
  BoutiqueSortValue,
} from "@/features/storefront/catalog/boutique-page/types";
import { CATALOG_AVAILABILITY_FILTER_VALUE } from "@/entities/catalog/catalog-filter-input";
import { buildBoutiqueUrl } from "@/features/storefront/catalog/boutique-page/model/build-boutique-url";
import { mapBoutiqueProductCardItem } from "@/features/storefront/catalog/boutique-page/composition/map-boutique-product-card-item";
import type { listCatalogFilterCategories } from "@/features/storefront/catalog";
import type { CatalogProductListItem } from "@/features/storefront/catalog/types";

type BoutiqueProduct = CatalogProductListItem;
type BoutiqueCategory = Awaited<ReturnType<typeof listCatalogFilterCategories>>[number];
const BOUTIQUE_HERO_IMAGE = {
  lightSrc: "/uploads/boutique-hero-light.webp",
  darkSrc: "/uploads/boutique-hero-dark.webp",
} as const;

type BuildBoutiquePageViewModelInput = {
  products: BoutiqueProduct[];
  categories: BoutiqueCategory[];
  uploadsPublicPath: string;
  totalProductCount: number;
  searchQuery: string | null;
  selectedCategorySlug: string | null;
  selectedCategoryLabel: string | null;
  selectedAvailabilityStatus: BoutiqueAvailabilityValue | null;
  selectedMinPriceCents: number | null;
  selectedMaxPriceCents: number | null;
  selectedSort: BoutiqueSortValue;
  pageSize: number;
  currentPage: number;
};

type PaginationItem = BoutiquePageViewModel["pagination"]["items"][number];

function buildPaginationItems(input: {
  currentPage: number;
  totalPages: number;
  buildHrefForPage: (pageNumber: number) => string;
}): PaginationItem[] {
  const { currentPage, totalPages, buildHrefForPage } = input;

  if (totalPages <= 1) {
    return [];
  }

  const pageNumbers = new Set<number>();
  pageNumbers.add(1);
  pageNumbers.add(totalPages);
  for (let offset = -1; offset <= 1; offset += 1) {
    const candidate = currentPage + offset;
    if (candidate >= 1 && candidate <= totalPages) {
      pageNumbers.add(candidate);
    }
  }

  const sortedPageNumbers = Array.from(pageNumbers).sort((a, b) => a - b);
  const items: PaginationItem[] = [];
  let previousPageNumber: number | null = null;

  for (const pageNumber of sortedPageNumbers) {
    if (previousPageNumber !== null && pageNumber - previousPageNumber > 1) {
      items.push({ kind: "ellipsis", key: `ellipsis-${previousPageNumber}-${pageNumber}` });
    }

    items.push({
      kind: "page",
      pageNumber,
      href: buildHrefForPage(pageNumber),
      isCurrent: pageNumber === currentPage,
    });

    previousPageNumber = pageNumber;
  }

  return items;
}

type CategoryWithOptionalCover = BoutiqueCategory & {
  coverImage?: {
    filePath: string;
    altText: string | null;
  } | null;
};

function buildImageUrl(uploadsPublicPath: string, filePath: string): string {
  return `${uploadsPublicPath}/${filePath.replace(/^\/+/, "")}`;
}

function buildHeading(input: {
  searchQuery: string | null;
  selectedCategoryLabel: string | null;
  selectedAvailabilityStatus: BoutiqueAvailabilityValue | null;
}): Pick<BoutiquePageViewModel, "headingEyebrow" | "headingTitle" | "headingDescription"> {
  const hasActiveFilters =
    input.searchQuery !== null ||
    input.selectedCategoryLabel !== null ||
    input.selectedAvailabilityStatus !== null;

  if (hasActiveFilters) {
    return {
      headingEyebrow: "Boutique",
      headingTitle: "Produits publiés",
      headingDescription: null,
    };
  }

  return {
    headingEyebrow: "Sélection",
    headingTitle: "Produits à découvrir",
    headingDescription:
      "Une sélection de produits déjà disponibles, avec les pièces mises en avant en premier.",
  };
}

function mapCategoryVisual(
  category: BoutiqueCategory,
  uploadsPublicPath: string
): { src: string; alt: string } | null {
  const withCover = category as CategoryWithOptionalCover;
  const cover = withCover.coverImage;

  if (!cover?.filePath) {
    return null;
  }

  return {
    src: buildImageUrl(uploadsPublicPath, cover.filePath),
    alt: cover.altText ?? category.name,
  };
}

function buildAvailabilityOptions(): Array<{
  id: BoutiqueAvailabilityValue;
  label: string;
  count: number | null;
}> {
  return [
    {
      id: "in-stock",
      label: "En stock",
      count: null,
    },
    {
      id: "made-to-order",
      label: "Sur commande",
      count: null,
    },
    {
      id: "unavailable",
      label: "Indisponible",
      count: null,
    },
  ];
}

function formatPriceFilterLabel(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function formatSortFilterLabel(sort: BoutiqueSortValue): string {
  if (sort === "newest") {
    return "Nouveautes";
  }

  if (sort === "name") {
    return "Nom";
  }

  if (sort === "price-asc") {
    return "Prix croissant";
  }

  if (sort === "price-desc") {
    return "Prix decroissant";
  }

  return "Selection";
}

export function buildBoutiquePageViewModel(
  input: BuildBoutiquePageViewModelInput
): BoutiquePageViewModel {
  const activeFilterLabels: BoutiqueActiveFilterItem[] = [];

  const hasSearchQuery = input.searchQuery !== null && input.searchQuery.trim().length > 0;
  const hasCategoryFilter = input.selectedCategorySlug !== null;
  const hasAvailabilityFilter = input.selectedAvailabilityStatus !== null;
  const hasPriceFilter =
    input.selectedMinPriceCents !== null || input.selectedMaxPriceCents !== null;
  const isDefaultQuickFilterState =
    !hasSearchQuery &&
    !hasCategoryFilter &&
    !hasAvailabilityFilter &&
    !hasPriceFilter &&
    input.selectedSort === "featured";

  if (hasSearchQuery) {
    activeFilterLabels.push({
      key: "q",
      label: `Recherche : ${input.searchQuery}`,
      clearHref: buildBoutiqueUrl({
        category: input.selectedCategorySlug,
        availability: input.selectedAvailabilityStatus,
        minPrice: input.selectedMinPriceCents,
        maxPrice: input.selectedMaxPriceCents,
        sort: input.selectedSort,
      }),
    });
  }

  if (input.selectedCategoryLabel !== null) {
    activeFilterLabels.push({
      key: "category",
      label: `Catégorie : ${input.selectedCategoryLabel}`,
      clearHref: buildBoutiqueUrl({
        q: input.searchQuery,
        availability: input.selectedAvailabilityStatus,
        minPrice: input.selectedMinPriceCents,
        maxPrice: input.selectedMaxPriceCents,
        sort: input.selectedSort,
      }),
    });
  }

  if (input.selectedAvailabilityStatus === "in-stock") {
    activeFilterLabels.push({
      key: "availability",
      label: "En stock",
      clearHref: buildBoutiqueUrl({
        q: input.searchQuery,
        category: input.selectedCategorySlug,
        minPrice: input.selectedMinPriceCents,
        maxPrice: input.selectedMaxPriceCents,
        sort: input.selectedSort,
      }),
    });
  }

  if (input.selectedAvailabilityStatus === "made-to-order") {
    activeFilterLabels.push({
      key: "availability",
      label: "Sur commande",
      clearHref: buildBoutiqueUrl({
        q: input.searchQuery,
        category: input.selectedCategorySlug,
        minPrice: input.selectedMinPriceCents,
        maxPrice: input.selectedMaxPriceCents,
        sort: input.selectedSort,
      }),
    });
  }

  if (input.selectedAvailabilityStatus === "unavailable") {
    activeFilterLabels.push({
      key: "availability",
      label: "Indisponible",
      clearHref: buildBoutiqueUrl({
        q: input.searchQuery,
        category: input.selectedCategorySlug,
        minPrice: input.selectedMinPriceCents,
        maxPrice: input.selectedMaxPriceCents,
        sort: input.selectedSort,
      }),
    });
  }

  if (hasPriceFilter) {
    let label = "Prix :";

    if (input.selectedMinPriceCents !== null && input.selectedMaxPriceCents !== null) {
      label = `Prix : ${formatPriceFilterLabel(input.selectedMinPriceCents)} € – ${formatPriceFilterLabel(input.selectedMaxPriceCents)} €`;
    } else if (input.selectedMinPriceCents !== null) {
      label = `Prix : dès ${formatPriceFilterLabel(input.selectedMinPriceCents)} €`;
    } else if (input.selectedMaxPriceCents !== null) {
      label = `Prix : jusqu’à ${formatPriceFilterLabel(input.selectedMaxPriceCents)} €`;
    }

    activeFilterLabels.push({
      key: "priceRange",
      label,
      clearHref: buildBoutiqueUrl({
        q: input.searchQuery,
        category: input.selectedCategorySlug,
        availability: input.selectedAvailabilityStatus,
        sort: input.selectedSort,
      }),
    });
  }

  if (input.selectedSort !== "featured") {
    activeFilterLabels.push({
      key: "sort",
      label: `Tri : ${formatSortFilterLabel(input.selectedSort)}`,
      clearHref: buildBoutiqueUrl({
        q: input.searchQuery,
        category: input.selectedCategorySlug,
        availability: input.selectedAvailabilityStatus,
        minPrice: input.selectedMinPriceCents,
        maxPrice: input.selectedMaxPriceCents,
        sort: "featured",
      }),
    });
  }

  const heading = buildHeading({
    searchQuery: input.searchQuery,
    selectedCategoryLabel: input.selectedCategoryLabel,
    selectedAvailabilityStatus: input.selectedAvailabilityStatus,
  });

  const selectedCategorySlug = input.selectedCategorySlug ?? "";
  const searchQuery = input.searchQuery ?? "";
  const resultCountLabel = `${input.totalProductCount} résultat${input.totalProductCount > 1 ? "s" : ""}`;
  const totalProductCount = input.totalProductCount;
  const resetHref = "/boutique";

  const safePageSize = input.pageSize > 0 ? input.pageSize : 12;
  const totalPages = Math.max(1, Math.ceil(totalProductCount / safePageSize));
  const currentPage = Math.min(Math.max(1, input.currentPage), totalPages);
  const buildHrefForPage = (pageNumber: number): string =>
    buildBoutiqueUrl({
      q: input.searchQuery,
      category: input.selectedCategorySlug,
      availability: input.selectedAvailabilityStatus,
      minPrice: input.selectedMinPriceCents,
      maxPrice: input.selectedMaxPriceCents,
      sort: input.selectedSort,
      page: pageNumber > 1 ? pageNumber : null,
    });
  const paginationItems = buildPaginationItems({
    currentPage,
    totalPages,
    buildHrefForPage,
  });
  const previousHref = currentPage > 1 ? buildHrefForPage(currentPage - 1) : null;
  const nextHref = currentPage < totalPages ? buildHrefForPage(currentPage + 1) : null;

  const categories = input.categories.map((category) => ({
    id: category.id,
    parentId: category.parentId,
    slug: category.slug,
    name: category.name,
    href: buildBoutiqueUrl({
      q: input.searchQuery,
      category: category.slug,
      availability: input.selectedAvailabilityStatus,
      minPrice: input.selectedMinPriceCents,
      maxPrice: input.selectedMaxPriceCents,
      sort: input.selectedSort,
    }),
    isActive: category.slug === input.selectedCategorySlug,
    visual: mapCategoryVisual(category, input.uploadsPublicPath),
  }));
  const filterCategories = categories.filter((category) => category.parentId === null);

  return {
    headingEyebrow: heading.headingEyebrow,
    headingTitle: heading.headingTitle,
    headingDescription: heading.headingDescription,
    heroImage: BOUTIQUE_HERO_IMAGE,
    resultCountLabel,
    selectedSort: input.selectedSort,
    selectedCategorySlug,
    searchQuery,
    onlyAvailable: input.selectedAvailabilityStatus === "in-stock",
    selectedMinPriceCents: input.selectedMinPriceCents,
    selectedMaxPriceCents: input.selectedMaxPriceCents,
    selectedAvailabilityStatus: input.selectedAvailabilityStatus,
    totalProductCount,
    resetHref,
    activeFilterLabels,
    apiFilters: {
      q: input.searchQuery,
      category: input.selectedCategorySlug,
      availability: input.selectedAvailabilityStatus,
      minPrice: input.selectedMinPriceCents,
      maxPrice: input.selectedMaxPriceCents,
      sort: input.selectedSort,
    },
    pagination: {
      pageSize: safePageSize,
      currentPage,
      totalPages,
      items: paginationItems,
      previousHref,
      nextHref,
    },
    availabilityOptions: buildAvailabilityOptions(),
    quickFilters: [
      {
        id: "all",
        label: "Tout voir",
        href: buildBoutiqueUrl({ sort: "featured" }),
        isActive: isDefaultQuickFilterState,
      },
      {
        id: "newest",
        label: "Tri : Nouveautes",
        href: buildBoutiqueUrl({
          q: input.searchQuery,
          category: input.selectedCategorySlug,
          availability: input.selectedAvailabilityStatus,
          minPrice: input.selectedMinPriceCents,
          maxPrice: input.selectedMaxPriceCents,
          sort: "newest",
        }),
        isActive: input.selectedSort === "newest",
      },
      {
        id: "available",
        label: "Disponibilite : En stock",
        href: buildBoutiqueUrl({
          q: input.searchQuery,
          category: input.selectedCategorySlug,
          availability: CATALOG_AVAILABILITY_FILTER_VALUE,
          minPrice: input.selectedMinPriceCents,
          maxPrice: input.selectedMaxPriceCents,
          sort: input.selectedSort,
        }),
        isActive: input.selectedAvailabilityStatus === "in-stock",
      },
      {
        id: "featured",
        label: "Tri : Selection",
        href: buildBoutiqueUrl({
          q: input.searchQuery,
          category: input.selectedCategorySlug,
          availability: input.selectedAvailabilityStatus,
          minPrice: input.selectedMinPriceCents,
          maxPrice: input.selectedMaxPriceCents,
          sort: "featured",
        }),
        isActive: input.selectedSort === "featured" && !isDefaultQuickFilterState,
      },
    ],
    categories,
    filterCategories,
    products: input.products.map((product) =>
      mapBoutiqueProductCardItem({
        product,
        uploadsPublicPath: input.uploadsPublicPath,
      })
    ),
  };
}

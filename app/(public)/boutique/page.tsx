import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getUploadsPublicPath } from "@/core/uploads";
import { readFavoriteProductIds } from "@/core/sessions/favorites";
import {
  type CatalogAvailabilityFilterValue,
  validateCatalogFilterInput,
} from "@/entities/catalog/catalog-filter-input";
import { validateCatalogSearchQuery } from "@/entities/catalog/catalog-search-input";
import {
  listCatalogFilterCategories,
  listPublishedProductsPage,
  countPublishedProducts,
} from "@/features/storefront/catalog";
import { BoutiquePage } from "@/features/storefront/catalog/boutique-page/components/boutique-page";
import { buildBoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/composition/build-boutique-page-view-model";
import { getLocalizedBoutiquePageCopy } from "@/features/storefront/catalog/boutique-page/queries/get-localized-boutique-page-copy.query";
import { catalogSearchParamsSchema } from "@/features/storefront/catalog/schemas/catalog-search-params.schema";
import { searchPublishedProductIds } from "@/features/search/queries/search-published-product-ids.query";
import { trackStorefrontSearchEvent } from "@/features/analytics/tracking/record-storefront-analytics-event.service";

export const dynamic = "force-dynamic";
const BOUTIQUE_PRODUCTS_PAGE_SIZE = 12;

type BoutiqueSearchParams = {
  q?: string | string[];
  category?: string | string[];
  availability?: string | string[];
  minPrice?: string | string[];
  maxPrice?: string | string[];
  sort?: string | string[];
  page?: string | string[];
};

type ProductsPageProps = Readonly<{
  searchParams: Promise<BoutiqueSearchParams>;
}>;

function getFirstSearchParamValue(value: string | string[] | undefined): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
    return value[0];
  }

  return null;
}

function buildCanonicalBoutiqueHref(
  searchParams: BoutiqueSearchParams,
  canonicalPage: number
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "page") {
      continue;
    }

    if (typeof value === "string") {
      params.set(key, value);
      continue;
    }

    if (Array.isArray(value) && value.length > 0) {
      for (const v of value) {
        params.append(key, v);
      }
    }
  }

  if (canonicalPage > 1) {
    params.set("page", String(canonicalPage));
  }

  const query = params.toString();
  return query.length > 0 ? `/boutique?${query}` : "/boutique";
}

function getBoutiqueMetadata(input: {
  searchQuery: string | null;
  categoryLabel: string | null;
  availabilityStatus: CatalogAvailabilityFilterValue | null;
}): Metadata {
  const titleSegments: string[] = [];
  const descriptionSegments: string[] = [];

  if (input.searchQuery !== null) {
    titleSegments.push(`Recherche ${input.searchQuery}`);
    descriptionSegments.push(`Résultats du catalogue Creatyss pour ${input.searchQuery}.`);
  }

  if (input.categoryLabel !== null) {
    titleSegments.push(input.categoryLabel);
    descriptionSegments.push(`Sélection de produits pour la catégorie ${input.categoryLabel}.`);
  }

  if (input.availabilityStatus === "in-stock") {
    titleSegments.push("En stock");
    descriptionSegments.push("Produits vendables immédiatement.");
  }

  if (input.availabilityStatus === "made-to-order") {
    titleSegments.push("Sur commande");
    descriptionSegments.push("Produits disponibles sur commande.");
  }

  if (input.availabilityStatus === "unavailable") {
    titleSegments.push("Indisponibles");
    descriptionSegments.push("Produits temporairement indisponibles.");
  }

  if (titleSegments.length === 0) {
    return {
      title: "Boutique Creatyss",
      description:
        "Découvrez les produits publiés, les pièces mises en avant et les essentiels du catalogue Creatyss.",
    };
  }

  return {
    title: `${titleSegments.join(" · ")} | Boutique Creatyss`,
    description: descriptionSegments.join(" "),
  };
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const catalogSearchParams = catalogSearchParamsSchema.parse({
    q: resolvedSearchParams.q,
    category: resolvedSearchParams.category,
    availability: resolvedSearchParams.availability,
    minPrice: resolvedSearchParams.minPrice,
    maxPrice: resolvedSearchParams.maxPrice,
    sort: resolvedSearchParams.sort,
    page: resolvedSearchParams.page,
  });
  const searchQuery = validateCatalogSearchQuery(catalogSearchParams.q);
  const filters = validateCatalogFilterInput({
    categories: catalogSearchParams.category,
    availability: catalogSearchParams.availability,
    minPrice: catalogSearchParams.minPrice,
    maxPrice: catalogSearchParams.maxPrice,
  });
  const categories = filters.categorySlugs.length === 0 ? [] : await listCatalogFilterCategories();
  const firstSlug = filters.categorySlugs[0] ?? null;
  const selectedCategoryLabel: string | null =
    filters.categorySlugs.length === 0
      ? null
      : filters.categorySlugs.length === 1 && firstSlug !== null
        ? (categories.find((c) => c.slug === firstSlug)?.name ?? firstSlug)
        : `${filters.categorySlugs.length} catégories`;

  return getBoutiqueMetadata({
    searchQuery,
    categoryLabel: selectedCategoryLabel,
    availabilityStatus: filters.availabilityStatus,
  });
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawPageParam = getFirstSearchParamValue(resolvedSearchParams.page)?.trim() ?? null;
  const hasPageParam = rawPageParam !== null;
  const hasValidRawPageParam = rawPageParam !== null && /^\d+$/.test(rawPageParam);
  const rawRequestedPage =
    hasValidRawPageParam && rawPageParam !== null ? Number.parseInt(rawPageParam, 10) : null;
  const catalogSearchParams = catalogSearchParamsSchema.parse({
    q: resolvedSearchParams.q,
    category: resolvedSearchParams.category,
    availability: resolvedSearchParams.availability,
    minPrice: resolvedSearchParams.minPrice,
    maxPrice: resolvedSearchParams.maxPrice,
    sort: resolvedSearchParams.sort,
    page: resolvedSearchParams.page,
  });
  const searchQuery = validateCatalogSearchQuery(catalogSearchParams.q);
  const filters = validateCatalogFilterInput({
    categories: catalogSearchParams.category,
    availability: catalogSearchParams.availability,
    minPrice: catalogSearchParams.minPrice,
    maxPrice: catalogSearchParams.maxPrice,
  });
  // FTS résolu une seule fois (null si satellite.search inactif → fallback ILIKE).
  const searchProductIds =
    searchQuery === null ? null : await searchPublishedProductIds(searchQuery);
  const totalProductCount = await countPublishedProducts({
    searchQuery,
    searchProductIds,
    categorySlugs: filters.categorySlugs,
    availabilityStatus: filters.availabilityStatus,
    minPriceCents: filters.minPriceCents,
    maxPriceCents: filters.maxPriceCents,
  });

  if (searchQuery !== null) {
    trackStorefrontSearchEvent(searchQuery, totalProductCount);
  }

  const totalPages = Math.max(1, Math.ceil(totalProductCount / BOUTIQUE_PRODUCTS_PAGE_SIZE));
  const requestedPage = catalogSearchParams.page;
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const shouldRedirectToCanonicalPage =
    hasPageParam &&
    (rawRequestedPage === null ||
      rawRequestedPage < 1 ||
      rawRequestedPage === 1 ||
      rawRequestedPage !== currentPage);

  if (shouldRedirectToCanonicalPage) {
    redirect(buildCanonicalBoutiqueHref(resolvedSearchParams, currentPage));
  }

  const skip = (currentPage - 1) * BOUTIQUE_PRODUCTS_PAGE_SIZE;
  const [
    productsPage,
    categories,
    initialFavoriteProductIds,
    inStockCount,
    madeToOrderCount,
    unavailableCount,
    boutiquePageCopy,
  ] = await Promise.all([
    listPublishedProductsPage({
      searchQuery,
      searchProductIds,
      categorySlugs: filters.categorySlugs,
      availabilityStatus: filters.availabilityStatus,
      minPriceCents: filters.minPriceCents,
      maxPriceCents: filters.maxPriceCents,
      sort: catalogSearchParams.sort,
      limit: BOUTIQUE_PRODUCTS_PAGE_SIZE,
      cursor: null,
      skip,
    }),
    listCatalogFilterCategories(),
    readFavoriteProductIds(),
    countPublishedProducts({
      searchQuery,
      searchProductIds,
      categorySlugs: filters.categorySlugs,
      availabilityStatus: "in-stock",
      minPriceCents: filters.minPriceCents,
      maxPriceCents: filters.maxPriceCents,
    }),
    countPublishedProducts({
      searchQuery,
      searchProductIds,
      categorySlugs: filters.categorySlugs,
      availabilityStatus: "made-to-order",
      minPriceCents: filters.minPriceCents,
      maxPriceCents: filters.maxPriceCents,
    }),
    countPublishedProducts({
      searchQuery,
      searchProductIds,
      categorySlugs: filters.categorySlugs,
      availabilityStatus: "unavailable",
      minPriceCents: filters.minPriceCents,
      maxPriceCents: filters.maxPriceCents,
    }),
    getLocalizedBoutiquePageCopy(),
  ]);

  const firstCategorySlug = filters.categorySlugs[0] ?? null;
  const selectedCategoryLabel: string | null =
    filters.categorySlugs.length === 0
      ? null
      : filters.categorySlugs.length === 1 && firstCategorySlug !== null
        ? (categories.find((c) => c.slug === firstCategorySlug)?.name ?? firstCategorySlug)
        : `${filters.categorySlugs.length} catégories`;
  const uploadsPublicPath = getUploadsPublicPath();

  const model = buildBoutiquePageViewModel({
    products: productsPage.items,
    categories,
    uploadsPublicPath,
    searchQuery,
    selectedCategorySlugs: filters.categorySlugs,
    selectedCategoryLabel,
    selectedAvailabilityStatus: filters.availabilityStatus,
    selectedMinPriceCents: filters.minPriceCents,
    selectedMaxPriceCents: filters.maxPriceCents,
    selectedSort: catalogSearchParams.sort,
    totalProductCount,
    pageSize: BOUTIQUE_PRODUCTS_PAGE_SIZE,
    currentPage,
    availabilityCounts: {
      "in-stock": inStockCount,
      "made-to-order": madeToOrderCount,
      unavailable: unavailableCount,
    },
  });

  return (
    <BoutiquePage
      model={model}
      initialFavoriteProductIds={initialFavoriteProductIds}
      copy={boutiquePageCopy}
    />
  );
}

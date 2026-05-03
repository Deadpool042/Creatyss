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
import { catalogSearchParamsSchema } from "@/features/storefront/catalog/schemas/catalog-search-params.schema";

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
      params.set(key, value[0] ?? "");
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
    category: catalogSearchParams.category,
    availability: catalogSearchParams.availability,
    minPrice: catalogSearchParams.minPrice,
    maxPrice: catalogSearchParams.maxPrice,
  });
  const categories = filters.categorySlug === null ? [] : await listCatalogFilterCategories();
  const selectedCategory =
    filters.categorySlug === null
      ? null
      : (categories.find((category) => category.slug === filters.categorySlug) ?? null);

  return getBoutiqueMetadata({
    searchQuery,
    categoryLabel:
      filters.categorySlug === null ? null : (selectedCategory?.name ?? filters.categorySlug),
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
    category: catalogSearchParams.category,
    availability: catalogSearchParams.availability,
    minPrice: catalogSearchParams.minPrice,
    maxPrice: catalogSearchParams.maxPrice,
  });
  const totalProductCount = await countPublishedProducts({
    searchQuery,
    categorySlug: filters.categorySlug,
    availabilityStatus: filters.availabilityStatus,
    minPriceCents: filters.minPriceCents,
    maxPriceCents: filters.maxPriceCents,
  });
  const totalPages = Math.max(
    1,
    Math.ceil(totalProductCount / BOUTIQUE_PRODUCTS_PAGE_SIZE)
  );
  const requestedPage = catalogSearchParams.page;
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const shouldRedirectToCanonicalPage =
    hasPageParam &&
    (
      rawRequestedPage === null ||
      rawRequestedPage < 1 ||
      rawRequestedPage === 1 ||
      rawRequestedPage !== currentPage
    );

  if (shouldRedirectToCanonicalPage) {
    redirect(buildCanonicalBoutiqueHref(resolvedSearchParams, currentPage));
  }

  const skip = (currentPage - 1) * BOUTIQUE_PRODUCTS_PAGE_SIZE;
  const [productsPage, categories, initialFavoriteProductIds] = await Promise.all([
    listPublishedProductsPage({
      searchQuery,
      categorySlug: filters.categorySlug,
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
  ]);

  const selectedCategory =
    filters.categorySlug === null
      ? null
      : (categories.find((category) => category.slug === filters.categorySlug) ?? null);
  const uploadsPublicPath = getUploadsPublicPath();

  const model = buildBoutiquePageViewModel({
    products: productsPage.items,
    categories,
    uploadsPublicPath,
    searchQuery,
    selectedCategorySlug: filters.categorySlug,
    selectedCategoryLabel:
      filters.categorySlug === null ? null : (selectedCategory?.name ?? filters.categorySlug),
    selectedAvailabilityStatus: filters.availabilityStatus,
    selectedMinPriceCents: filters.minPriceCents,
    selectedMaxPriceCents: filters.maxPriceCents,
    selectedSort: catalogSearchParams.sort,
    totalProductCount,
    pageSize: BOUTIQUE_PRODUCTS_PAGE_SIZE,
    currentPage,
  });

  return <BoutiquePage model={model} initialFavoriteProductIds={initialFavoriteProductIds} />;
}

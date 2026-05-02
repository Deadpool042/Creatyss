import type { Metadata } from "next";

import { getUploadsPublicPath } from "@/core/uploads";
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
};

type ProductsPageProps = Readonly<{
  searchParams: Promise<BoutiqueSearchParams>;
}>;

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
  const catalogSearchParams = catalogSearchParamsSchema.parse({
    q: resolvedSearchParams.q,
    category: resolvedSearchParams.category,
    availability: resolvedSearchParams.availability,
    minPrice: resolvedSearchParams.minPrice,
    maxPrice: resolvedSearchParams.maxPrice,
    sort: resolvedSearchParams.sort,
  });
  const searchQuery = validateCatalogSearchQuery(catalogSearchParams.q);
  const filters = validateCatalogFilterInput({
    category: catalogSearchParams.category,
    availability: catalogSearchParams.availability,
    minPrice: catalogSearchParams.minPrice,
    maxPrice: catalogSearchParams.maxPrice,
  });
  const [productsPage, totalProductCount, categories] = await Promise.all([
    listPublishedProductsPage({
      searchQuery,
      categorySlug: filters.categorySlug,
      availabilityStatus: filters.availabilityStatus,
      minPriceCents: filters.minPriceCents,
      maxPriceCents: filters.maxPriceCents,
      sort: catalogSearchParams.sort,
      limit: BOUTIQUE_PRODUCTS_PAGE_SIZE,
      cursor: null,
    }),
    countPublishedProducts({
      searchQuery,
      categorySlug: filters.categorySlug,
      availabilityStatus: filters.availabilityStatus,
      minPriceCents: filters.minPriceCents,
      maxPriceCents: filters.maxPriceCents,
    }),
    listCatalogFilterCategories(),
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
    nextCursor: productsPage.nextCursor,
    hasMore: productsPage.hasMore,
    pageSize: BOUTIQUE_PRODUCTS_PAGE_SIZE,
  });

  return <BoutiquePage model={model} />;
}

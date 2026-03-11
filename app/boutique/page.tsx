import type { Metadata } from "next";
import Link from "next/link";
import {
  listCatalogFilterCategories,
  listPublishedProducts
} from "@/db/catalog";
import {
  CATALOG_AVAILABILITY_FILTER_VALUE,
  validateCatalogFilterInput
} from "@/entities/catalog/catalog-filter-input";
import { validateCatalogSearchQuery } from "@/entities/catalog/catalog-search-input";

export const dynamic = "force-dynamic";

type BoutiqueSearchParams = {
  q?: string | string[];
  category?: string | string[];
  availability?: string | string[];
};

type ProductsPageProps = Readonly<{
  searchParams: Promise<BoutiqueSearchParams>;
}>;

function getFirstSearchParamValue(
  value: string | string[] | undefined
): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function getBoutiqueMetadata(input: {
  searchQuery: string | null;
  categoryLabel: string | null;
  onlyAvailable: boolean;
}): Metadata {
  const titleSegments: string[] = [];
  const descriptionSegments: string[] = [];

  if (input.searchQuery !== null) {
    titleSegments.push(`Recherche ${input.searchQuery}`);
    descriptionSegments.push(
      `Resultats du catalogue Creatyss pour ${input.searchQuery}.`
    );
  }

  if (input.categoryLabel !== null) {
    titleSegments.push(input.categoryLabel);
    descriptionSegments.push(
      `Selection de produits pour la categorie ${input.categoryLabel}.`
    );
  }

  if (input.onlyAvailable) {
    titleSegments.push("Disponibles");
    descriptionSegments.push("Produits actuellement disponibles a la commande.");
  }

  if (titleSegments.length === 0) {
    return {
      title: "Boutique Creatyss",
      description:
        "Decouvrez les produits publies, les pieces mises en avant et les essentiels du catalogue Creatyss."
    };
  }

  return {
    title: `${titleSegments.join(" · ")} | Boutique Creatyss`,
    description: descriptionSegments.join(" ")
  };
}

export async function generateMetadata({
  searchParams
}: ProductsPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const searchQuery = validateCatalogSearchQuery(
    getFirstSearchParamValue(resolvedSearchParams.q)
  );
  const filters = validateCatalogFilterInput({
    category: getFirstSearchParamValue(resolvedSearchParams.category),
    availability: getFirstSearchParamValue(resolvedSearchParams.availability)
  });
  const categories =
    filters.categorySlug === null ? [] : await listCatalogFilterCategories();
  const selectedCategory =
    filters.categorySlug === null
      ? null
      : categories.find((category) => category.slug === filters.categorySlug) ??
        null;

  return getBoutiqueMetadata({
    searchQuery,
    categoryLabel:
      filters.categorySlug === null
        ? null
        : selectedCategory?.name ?? filters.categorySlug,
    onlyAvailable: filters.onlyAvailable
  });
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawQuery = getFirstSearchParamValue(resolvedSearchParams.q);
  const rawCategory = getFirstSearchParamValue(resolvedSearchParams.category);
  const rawAvailability = getFirstSearchParamValue(
    resolvedSearchParams.availability
  );
  const searchQuery = validateCatalogSearchQuery(rawQuery);
  const filters = validateCatalogFilterInput({
    category: rawCategory,
    availability: rawAvailability
  });
  const [products, categories] = await Promise.all([
    listPublishedProducts({
      searchQuery,
      categorySlug: filters.categorySlug,
      onlyAvailable: filters.onlyAvailable
    }),
    listCatalogFilterCategories()
  ]);
  const selectedCategory =
    filters.categorySlug === null
      ? null
      : categories.find((category) => category.slug === filters.categorySlug) ?? null;
  const selectedCategoryLabel =
    filters.categorySlug === null
      ? null
      : selectedCategory?.name ?? filters.categorySlug;
  const activeFilters: string[] = [];

  if (searchQuery !== null) {
    activeFilters.push(`Recherche : ${searchQuery}`);
  }

  if (selectedCategoryLabel !== null) {
    activeFilters.push(`Categorie : ${selectedCategoryLabel}`);
  }

  if (filters.onlyAvailable) {
    activeFilters.push("Disponibles uniquement");
  }

  const hasActiveFilters = activeFilters.length > 0;
  const hasOnlyActiveSearch =
    searchQuery !== null &&
    filters.categorySlug === null &&
    !filters.onlyAvailable;
  const hasEditorialListing = !hasActiveFilters;

  return (
    <div className="page">
      <section className="section">
        <div className="page-header">
          <div>
            <p className="eyebrow">{hasEditorialListing ? "Selection" : "Boutique"}</p>
            <h1>{hasEditorialListing ? "Produits a decouvrir" : "Produits publies"}</h1>
            {hasEditorialListing ? (
              <p className="catalog-intro">
                Une selection de produits deja disponibles, avec les pieces mises
                en avant en premier.
              </p>
            ) : null}
          </div>
        </div>

        <form action="/boutique" className="catalog-search-form" method="get">
          <label className="admin-field" htmlFor="catalog-search-query">
            <span className="meta-label">Recherche</span>
            <input
              className="admin-input"
              defaultValue={searchQuery ?? ""}
              id="catalog-search-query"
              name="q"
              placeholder="Nom, categorie ou couleur"
              type="search"
            />
          </label>

          <label className="admin-field" htmlFor="catalog-category-filter">
            <span className="meta-label">Categorie</span>
            <select
              className="admin-input"
              defaultValue={filters.categorySlug ?? ""}
              id="catalog-category-filter"
              name="category"
            >
              <option value="">Toutes les categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-checkbox catalog-filter-checkbox" htmlFor="catalog-availability-filter">
            <input
              defaultChecked={filters.onlyAvailable}
              id="catalog-availability-filter"
              name="availability"
              type="checkbox"
              value={CATALOG_AVAILABILITY_FILTER_VALUE}
            />
            <span>Disponibles uniquement</span>
          </label>

          <div className="button-row">
            <button className="button" type="submit">
              Rechercher
            </button>
            {hasActiveFilters ? (
              <Link className="link link-subtle" href="/boutique">
                Revenir a la liste complete
              </Link>
            ) : null}
          </div>
        </form>

        {hasOnlyActiveSearch ? (
          <p className="catalog-search-summary">
            Resultats pour <strong>{searchQuery}</strong>
          </p>
        ) : null}

        {!hasOnlyActiveSearch && hasActiveFilters ? (
          <p className="catalog-search-summary catalog-search-summary--active">
            Filtres actifs : <strong>{activeFilters.join(" · ")}</strong>
          </p>
        ) : null}

        {products.length > 0 ? (
          <div className="card-grid">
            {products.map((product) => (
              <article className="store-card" key={product.id}>
                <div className="store-card-header">
                  <p className="card-kicker">Produit</p>
                  <div className="store-card-badges">
                    {product.isFeatured ? (
                      <span className="store-card-badge store-card-badge--featured">
                        Mis en avant
                      </span>
                    ) : null}
                    <span
                      className={`store-card-badge ${
                        product.isAvailable
                          ? "store-card-badge--available"
                          : "store-card-badge--unavailable"
                      }`}
                    >
                      {product.isAvailable
                        ? "Disponible"
                        : "Temporairement indisponible"}
                    </span>
                  </div>
                </div>
                <h3>
                  <Link href={`/boutique/${product.slug}`}>{product.name}</Link>
                </h3>
                <p className="card-copy">
                  {product.shortDescription ??
                    product.description ??
                    "Aucune description n'est disponible pour ce produit."}
                </p>
                <p className="store-card-availability">
                  {product.isAvailable
                    ? "Disponible a la commande."
                    : "Actuellement indisponible a la commande."}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">
              {hasActiveFilters ? "Aucun resultat" : "Catalogue vide"}
            </p>
            <h2>
              {hasOnlyActiveSearch
                ? "Aucun produit ne correspond a cette recherche"
                : hasActiveFilters
                ? "Aucun produit ne correspond a ces filtres"
                : "Aucun produit publie"}
            </h2>
            <p className="card-copy">
              {hasOnlyActiveSearch
                ? "Essayez un autre terme ou revenez a la liste complete."
                : hasActiveFilters
                ? "Essayez une autre combinaison ou revenez a la liste complete."
                : "Les produits publics apparaitront ici des qu&apos;ils seront publies."}
            </p>
            {hasActiveFilters ? (
              <Link className="link link-subtle" href="/boutique">
                Voir tous les produits
              </Link>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}

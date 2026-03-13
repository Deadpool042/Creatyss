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
      `Résultats du catalogue Creatyss pour ${input.searchQuery}.`
    );
  }

  if (input.categoryLabel !== null) {
    titleSegments.push(input.categoryLabel);
    descriptionSegments.push(
      `Sélection de produits pour la catégorie ${input.categoryLabel}.`
    );
  }

  if (input.onlyAvailable) {
    titleSegments.push("Disponibles");
    descriptionSegments.push("Produits actuellement disponibles à la commande.");
  }

  if (titleSegments.length === 0) {
    return {
      title: "Boutique Creatyss",
      description:
        "Découvrez les produits publiés, les pièces mises en avant et les essentiels du catalogue Creatyss."
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
    activeFilters.push(`Catégorie : ${selectedCategoryLabel}`);
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
            <p className="eyebrow">{hasEditorialListing ? "Sélection" : "Boutique"}</p>
            <h1>{hasEditorialListing ? "Produits à découvrir" : "Produits publiés"}</h1>
            {hasEditorialListing ? (
              <p className="catalog-intro">
                Une sélection de produits déjà disponibles, avec les pièces mises
                en avant en premier.
              </p>
            ) : null}
          </div>
        </div>

        <form action="/boutique" className="catalog-search-form" method="get">
          <label className="form-field" htmlFor="catalog-search-query">
            <span className="meta-label">Recherche</span>
            <input
              className="form-input"
              defaultValue={searchQuery ?? ""}
              id="catalog-search-query"
              name="q"
              placeholder="Nom, catégorie ou couleur"
              type="search"
            />
          </label>

          <label className="form-field" htmlFor="catalog-category-filter">
            <span className="meta-label">Catégorie</span>
            <select
              className="form-input"
              defaultValue={filters.categorySlug ?? ""}
              id="catalog-category-filter"
              name="category"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-checkbox catalog-filter-checkbox" htmlFor="catalog-availability-filter">
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
                Revenir à la liste complète
              </Link>
            ) : null}
          </div>
        </form>

        {hasOnlyActiveSearch ? (
          <p className="catalog-search-summary">
            Résultats pour <strong>{searchQuery}</strong>
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
                    ? "Disponible à la commande."
                    : "Actuellement indisponible à la commande."}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">
              {hasActiveFilters ? "Aucun résultat" : "Catalogue vide"}
            </p>
            <h2>
              {hasOnlyActiveSearch
                ? "Aucun produit ne correspond à cette recherche"
                : hasActiveFilters
                ? "Aucun produit ne correspond à ces filtres"
                : "Aucun produit publié"}
            </h2>
            <p className="card-copy">
              {hasOnlyActiveSearch
                ? "Essayez un autre terme ou revenez à la liste complète."
                : hasActiveFilters
                ? "Essayez une autre combinaison ou revenez à la liste complète."
                : "Les produits publics apparaîtront ici dès qu&apos;ils seront publiés."}
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

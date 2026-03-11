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

type ProductsPageProps = Readonly<{
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    availability?: string | string[];
  }>;
}>;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawQuery = Array.isArray(resolvedSearchParams.q)
    ? resolvedSearchParams.q[0] ?? null
    : resolvedSearchParams.q ?? null;
  const rawCategory = Array.isArray(resolvedSearchParams.category)
    ? resolvedSearchParams.category[0] ?? null
    : resolvedSearchParams.category ?? null;
  const rawAvailability = Array.isArray(resolvedSearchParams.availability)
    ? resolvedSearchParams.availability[0] ?? null
    : resolvedSearchParams.availability ?? null;
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

  return (
    <div className="page">
      <section className="section">
        <div className="page-header">
          <div>
            <p className="eyebrow">Boutique</p>
            <h1>Produits publies</h1>
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
          <p className="catalog-search-summary">
            Filtres actifs : <strong>{activeFilters.join(" · ")}</strong>
          </p>
        ) : null}

        {products.length > 0 ? (
          <div className="card-grid">
            {products.map((product) => (
              <article className="store-card" key={product.id}>
                <p className="card-kicker">Produit</p>
                <h3>
                  <Link href={`/boutique/${product.slug}`}>{product.name}</Link>
                </h3>
                <p className="card-copy">
                  {product.shortDescription ??
                    product.description ??
                    "Aucune description n'est disponible pour ce produit."}
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

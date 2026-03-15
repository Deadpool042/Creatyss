import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        <div className="mb-6 grid gap-2">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">
            {hasEditorialListing ? "Sélection" : "Boutique"}
          </p>
          <h1 className="m-0">
            {hasEditorialListing ? "Produits à découvrir" : "Produits publiés"}
          </h1>
          {hasEditorialListing ? (
            <p className="mt-1 leading-relaxed text-muted-foreground">
              Une sélection de produits déjà disponibles, avec les pièces mises
              en avant en premier.
            </p>
          ) : null}
        </div>

        <form
          action="/boutique"
          className="grid gap-3"
          method="get">
          <label
            className="form-field"
            htmlFor="catalog-search-query">
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

          <label
            className="form-field"
            htmlFor="catalog-category-filter">
            <span className="meta-label">Catégorie</span>
            <select
              className="form-input"
              defaultValue={filters.categorySlug ?? ""}
              id="catalog-category-filter"
              name="category">
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label
            className="form-checkbox"
            htmlFor="catalog-availability-filter">
            <input
              defaultChecked={filters.onlyAvailable}
              id="catalog-availability-filter"
              name="availability"
              type="checkbox"
              value={CATALOG_AVAILABILITY_FILTER_VALUE}
            />
            <span>Disponibles uniquement</span>
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit">Rechercher</Button>
            {hasActiveFilters ? (
              <Link
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                href="/boutique">
                Revenir à la liste complète
              </Link>
            ) : null}
          </div>
        </form>

        {hasOnlyActiveSearch ? (
          <p className="mb-4 mt-5 text-sm text-muted-foreground">
            Résultats pour <strong className="text-foreground">{searchQuery}</strong>
          </p>
        ) : null}

        {!hasOnlyActiveSearch && hasActiveFilters ? (
          <div className="mb-4 mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            <span>Filtres actifs :</span>
            {activeFilters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary">
                {filter}
              </Badge>
            ))}
            <Link
              className="ml-auto text-xs underline-offset-4 transition-colors hover:text-foreground hover:underline"
              href="/boutique">
              Effacer
            </Link>
          </div>
        ) : null}

        {products.length > 0 ? (
          <div className="card-grid">
            {products.map((product) => (
              <article
                className="store-card"
                key={product.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Produit
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.isFeatured ? (
                      <Badge variant="secondary">Mis en avant</Badge>
                    ) : null}
                    <Badge variant={product.isAvailable ? "outline" : "outline"}>
                      <span
                        className={
                          product.isAvailable
                            ? "text-emerald-700"
                            : "text-destructive"
                        }>
                        {product.isAvailable
                          ? "Disponible"
                          : "Temporairement indisponible"}
                      </span>
                    </Badge>
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
                <p className="text-sm leading-relaxed text-muted-foreground">
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
                : "Les produits publics apparaîtront ici dès qu'ils seront publiés."}
            </p>
            {hasActiveFilters ? (
              <Link
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                href="/boutique">
                Voir tous les produits
              </Link>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}

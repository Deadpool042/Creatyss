import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  listCatalogFilterCategories,
  listPublishedProducts
} from "@/db/catalog";
import {
  CATALOG_AVAILABILITY_FILTER_VALUE,
  validateCatalogFilterInput
} from "@/entities/catalog/catalog-filter-input";
import { validateCatalogSearchQuery } from "@/entities/catalog/catalog-search-input";
import { getUploadsPublicPath } from "@/lib/uploads";

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

function getImageUrl(uploadsPublicPath: string, filePath: string): string {
  return `${uploadsPublicPath}/${filePath.replace(/^\/+/, "")}`;
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
  const uploadsPublicPath = getUploadsPublicPath();
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
  const hasEditorialListing = !hasActiveFilters;

  return (
    <div className="grid gap-10">
      {/* Header section */}
      <section className="w-full rounded-xl border border-shell-border bg-shell-surface p-8 shadow-soft min-[700px]:p-10">
        <div className="grid gap-2">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">
            {hasEditorialListing ? "Sélection" : "Boutique"}
          </p>
          <h1 className="m-0">
            {hasEditorialListing ? "Produits à découvrir" : "Produits publiés"}
          </h1>
          {hasEditorialListing ? (
            <p className="leading-relaxed text-muted-foreground">
              Une sélection de produits déjà disponibles, avec les pièces mises
              en avant en premier.
            </p>
          ) : null}
        </div>

        {/* Compact filter bar */}
        <form
          action="/boutique"
          className="mt-6 flex flex-wrap items-end gap-3"
          method="get">
          <div className="min-w-40 flex-1">
            <Input
              defaultValue={searchQuery ?? ""}
              name="q"
              placeholder="Rechercher…"
              type="search"
            />
          </div>

          <div className="min-w-36 flex-1">
            <select
              className="h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              defaultValue={filters.categorySlug ?? ""}
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
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              className="size-4"
              defaultChecked={filters.onlyAvailable}
              name="availability"
              type="checkbox"
              value={CATALOG_AVAILABILITY_FILTER_VALUE}
            />
            <span>Disponibles</span>
          </label>

          <Button
            size="sm"
            type="submit">
            Filtrer
          </Button>

          {hasActiveFilters ? (
            <Link
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              href="/boutique">
              Tout voir
            </Link>
          ) : null}
        </form>

        {hasActiveFilters ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Filtres :</span>
            {activeFilters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary">
                {filter}
              </Badge>
            ))}
          </div>
        ) : null}
      </section>

      {/* Product grid */}
      {products.length > 0 ? (
        <div className="grid gap-5 min-[500px]:grid-cols-2 min-[900px]:grid-cols-3">
          {products.map((product) => (
            <article
              className="group grid grid-rows-[auto_1fr] overflow-hidden rounded-xl border border-surface-border bg-shell-surface shadow-card transition-shadow hover:shadow-soft"
              key={product.id}>
              {/* Image zone */}
              <Link
                className="block"
                href={`/boutique/${product.slug}`}
                tabIndex={-1}>
                {product.primaryImage !== null ? (
                  <figure className="relative aspect-[4/3] overflow-hidden bg-media-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={product.primaryImage.altText ?? product.name}
                      className="absolute inset-0 block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      src={getImageUrl(uploadsPublicPath, product.primaryImage.filePath)}
                    />
                  </figure>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-media-surface text-media-foreground">
                    <span className="text-xs font-medium uppercase tracking-widest opacity-60">
                      {product.name}
                    </span>
                  </div>
                )}
              </Link>

              {/* Text content */}
              <div className="grid gap-3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {product.isFeatured ? "Pièce phare" : "Produit"}
                  </p>
                  <Badge
                    variant="outline">
                    <span
                      className={
                        product.isAvailable
                          ? "text-emerald-700"
                          : "text-destructive"
                      }>
                      {product.isAvailable ? "Disponible" : "Indisponible"}
                    </span>
                  </Badge>
                </div>

                <h3 className="m-0 text-base font-semibold leading-snug">
                  <Link
                    className="transition-colors hover:text-brand"
                    href={`/boutique/${product.slug}`}>
                    {product.name}
                  </Link>
                </h3>

                {(product.shortDescription ?? product.description) ? (
                  <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {product.shortDescription ?? product.description}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="w-full rounded-xl border border-shell-border bg-shell-surface p-8 shadow-soft min-[700px]:p-10">
          <div className="grid gap-4 rounded-lg border border-surface-border bg-surface-panel-soft p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-brand">
              {hasActiveFilters ? "Aucun résultat" : "Catalogue vide"}
            </p>
            <h2>
              {hasActiveFilters
                ? "Aucun produit ne correspond à ces filtres"
                : "Aucun produit publié"}
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              {hasActiveFilters
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
        </section>
      )}
    </div>
  );
}

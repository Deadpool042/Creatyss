import Link from "next/link";
import { listPublishedProducts } from "@/db/catalog";
import { validateCatalogSearchQuery } from "@/entities/catalog/catalog-search-input";

export const dynamic = "force-dynamic";

type ProductsPageProps = Readonly<{
  searchParams: Promise<{
    q?: string | string[];
  }>;
}>;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawQuery = Array.isArray(resolvedSearchParams.q)
    ? resolvedSearchParams.q[0] ?? null
    : resolvedSearchParams.q ?? null;
  const searchQuery = validateCatalogSearchQuery(rawQuery);
  const products = await listPublishedProducts(searchQuery);
  const hasActiveSearch = searchQuery !== null;

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

          <div className="button-row">
            <button className="button" type="submit">
              Rechercher
            </button>
            {hasActiveSearch ? (
              <Link className="link link-subtle" href="/boutique">
                Revenir a la liste complete
              </Link>
            ) : null}
          </div>
        </form>

        {hasActiveSearch ? (
          <p className="catalog-search-summary">
            Resultats pour <strong>{searchQuery}</strong>
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
              {hasActiveSearch ? "Aucun resultat" : "Catalogue vide"}
            </p>
            <h2>
              {hasActiveSearch
                ? "Aucun produit ne correspond a cette recherche"
                : "Aucun produit publie"}
            </h2>
            <p className="card-copy">
              {hasActiveSearch
                ? "Essayez un autre terme ou revenez a la liste complete."
                : "Les produits publics apparaitront ici des qu&apos;ils seront publies."}
            </p>
            {hasActiveSearch ? (
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

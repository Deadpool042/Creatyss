import Link from "next/link";
import { listAdminProducts } from "@/db/repositories/admin-product.repository";
import { getAdminProductPresentation } from "@/entities/product/product-admin-presentation";

export const dynamic = "force-dynamic";

type AdminProductsPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
    status?: string | string[];
  }>;
}>;

function getStatusLabel(status: string): string {
  return status === "published" ? "Publie" : "Brouillon";
}

function getStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "deleted":
      return "Produit supprime avec succes.";
    default:
      return null;
  }
}

function getErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_product":
      return "Le produit demande est introuvable.";
    default:
      return null;
  }
}

export default async function AdminProductsPage({
  searchParams
}: AdminProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const statusParam = Array.isArray(resolvedSearchParams.status)
    ? resolvedSearchParams.status[0]
    : resolvedSearchParams.status;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const successMessage = getStatusMessage(statusParam);
  const errorMessage = getErrorMessage(errorParam);
  const products = await listAdminProducts();

  return (
    <div className="admin-product-page">
      <section className="section">
        <div className="page-header">
          <div>
            <p className="eyebrow">Produits</p>
            <h1>Produits admin</h1>
            <p className="lead">
              Gere les produits parents, leurs categories, leurs variantes et
              leurs images depuis un flux admin unique.
            </p>
          </div>

          <Link className="button" href="/admin/products/new">
            Nouveau produit
          </Link>
        </div>

        {successMessage ? <p className="admin-success">{successMessage}</p> : null}
        {errorMessage ? (
          <p className="admin-alert" role="alert">
            {errorMessage}
          </p>
        ) : null}

        {products.length > 0 ? (
          <div className="admin-product-list">
            {products.map((product) => {
              const presentation = getAdminProductPresentation(
                product.productType,
                product.variantCount
              );

              return (
                <article className="store-card admin-product-card" key={product.id}>
                  <div className="stack">
                    <p className="card-kicker">Produit</p>
                    <h2>{product.name}</h2>
                    <p className="card-meta">{product.slug}</p>
                  </div>

                  {product.shortDescription ? (
                    <p className="card-copy">{product.shortDescription}</p>
                  ) : (
                    <p className="card-copy">
                      Aucune description courte pour ce produit.
                    </p>
                  )}

                  <div className="admin-product-tags">
                    <span className="admin-chip">{getStatusLabel(product.status)}</span>
                    <span className="admin-chip">{presentation.typeLabel}</span>
                    <span className="admin-chip">
                      {product.isFeatured ? "Mis en avant" : "Standard"}
                    </span>
                    <span className="admin-chip">
                      {product.categoryCount} categorie
                      {product.categoryCount > 1 ? "s" : ""}
                    </span>
                    <span className="admin-chip">
                      {presentation.sellableCountLabel}
                    </span>
                  </div>

                  <div>
                    <Link className="link" href={`/admin/products/${product.id}`}>
                      Modifier le produit
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Aucun produit</p>
            <h2>Le catalogue ne contient pas encore de produit admin</h2>
            <p className="card-copy">
              Creez un premier produit parent pour commencer a structurer le
              catalogue.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

import Link from "next/link";
import { getAdminProductPresentation } from "@/entities/product/product-admin-presentation";
import { type AdminProductSummary } from "@/db/repositories/admin-product.repository";

function getStatusLabel(status: string): string {
  return status === "published" ? "Publié" : "Brouillon";
}

type AdminProductCardProps = {
  product: AdminProductSummary;
};

export function AdminProductCard({ product }: AdminProductCardProps) {
  const presentation = getAdminProductPresentation(
    product.productType,
    product.variantCount
  );

  return (
    <article className="store-card admin-product-card">
      <div className="stack">
        <p className="card-kicker">Produit</p>
        <h2>{product.name}</h2>
        <p className="card-meta">{product.slug}</p>
      </div>

      {product.shortDescription ? (
        <p className="card-copy">{product.shortDescription}</p>
      ) : (
        <p className="card-copy">Aucune description courte pour ce produit.</p>
      )}

      <div className="admin-product-tags">
        <span className="admin-chip">{getStatusLabel(product.status)}</span>
        <span className="admin-chip">{presentation.typeLabel}</span>
        <span className="admin-chip">
          {product.isFeatured ? "Mis en avant" : "Standard"}
        </span>
        <span className="admin-chip">
          {product.categoryCount} catégorie
          {product.categoryCount > 1 ? "s" : ""}
        </span>
        <span className="admin-chip">{presentation.sellableCountLabel}</span>
      </div>

      <div>
        <Link className="link" href={`/admin/products/${product.id}`}>
          Modifier le produit
        </Link>
      </div>
    </article>
  );
}

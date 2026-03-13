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
  const titleId = `admin-product-${product.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="store-card admin-product-card rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm">
      <div className="stack gap-2">
        <p className="card-kicker text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Produit
        </p>
        <h2
          className="text-lg font-semibold tracking-tight text-foreground"
          id={titleId}>
          {product.name}
        </h2>
        <p className="card-meta text-sm text-muted-foreground">
          {product.slug}
        </p>
      </div>

      {product.shortDescription ? (
        <p className="card-copy text-sm leading-6 text-foreground/85">
          {product.shortDescription}
        </p>
      ) : (
        <p className="card-copy text-sm leading-6 text-foreground/85">
          Aucune description courte pour ce produit.
        </p>
      )}

      <div className="admin-product-tags flex flex-wrap gap-2">
        <span className="admin-chip border-border/70 bg-muted/50 text-xs font-medium text-foreground">
          {getStatusLabel(product.status)}
        </span>
        <span className="admin-chip border-border/70 bg-muted/50 text-xs font-medium text-foreground">
          {presentation.typeLabel}
        </span>
        <span className="admin-chip border-border/70 bg-muted/50 text-xs font-medium text-foreground">
          {product.isFeatured ? "Mis en avant" : "Standard"}
        </span>
        <span className="admin-chip border-border/70 bg-muted/50 text-xs font-medium text-foreground">
          {product.categoryCount} catégorie
          {product.categoryCount > 1 ? "s" : ""}
        </span>
        <span className="admin-chip border-border/70 bg-muted/50 text-xs font-medium text-foreground">
          {presentation.sellableCountLabel}
        </span>
      </div>

      <div className="pt-1">
        <Link
          className="link inline-flex w-fit items-center text-sm font-medium"
          href={`/admin/products/${product.id}`}>
          Modifier le produit
        </Link>
      </div>
    </article>
  );
}

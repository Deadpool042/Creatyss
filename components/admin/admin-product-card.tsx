import Link from "next/link";
import { getAdminProductPresentation } from "@/entities/product/product-admin-presentation";
import { type AdminProductSummary } from "@/db/repositories/admin-product.repository";
import { Badge } from "@/components/ui/badge";

function getStatusLabel(status: string): string {
  return status === "published" ? "Publié" : "Brouillon";
}

function getStatusBadgeVariant(status: AdminProductSummary["status"]) {
  return status === "published" ? "secondary" as const : "outline" as const;
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
      className="admin-product-card grid h-full gap-4 rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm">
      <div className="grid gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Produit
        </p>
        <h2
          className="text-lg font-semibold tracking-tight text-foreground"
          id={titleId}>
          {product.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {product.slug}
        </p>
      </div>

      {product.shortDescription ? (
        <p className="text-sm leading-6 text-foreground/85">
          {product.shortDescription}
        </p>
      ) : (
        <p className="text-sm leading-6 text-foreground/85">
          Aucune description courte pour ce produit.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Badge variant={getStatusBadgeVariant(product.status)}>
          {getStatusLabel(product.status)}
        </Badge>
        <Badge variant="outline">
          {presentation.typeLabel}
        </Badge>
        <Badge variant={product.isFeatured ? "secondary" : "outline"}>
          {product.isFeatured ? "Mis en avant" : "Standard"}
        </Badge>
        <Badge variant="outline">
          {product.categoryCount} catégorie
          {product.categoryCount > 1 ? "s" : ""}
        </Badge>
        <Badge variant="outline">
          {presentation.sellableCountLabel}
        </Badge>
      </div>

      <Link
        className="inline-flex w-fit items-center text-sm font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
        href={`/admin/products/${product.id}`}>
        Modifier le produit
      </Link>
    </article>
  );
}

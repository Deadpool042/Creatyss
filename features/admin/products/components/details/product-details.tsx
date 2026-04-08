import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ProductStatusBadge, type ProductStatus } from "../shared/product-status-badge";
import { ProductSection } from "../shared/product-section";
import Image from "next/image";

type ProductImage = {
  id: string;
  url: string;
  alt?: string;
};

type ProductVariant = {
  id: string;
  name: string;
  price?: string;
  sku?: string;
  stock?: number;
};

type ProductCategory = {
  id: string;
  name: string;
};

export type ProductDetailsData = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  status: ProductStatus;
  price?: string;
  compareAtPrice?: string;
  sku?: string;
  imageUrl?: string;
  images?: ProductImage[];
  categories?: ProductCategory[];
  variants?: ProductVariant[];
};

type ProductDetailsProps = {
  product: ProductDetailsData;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="flex h-full flex-col">
      {/* En-tête — mode lecture */}
      <div className="flex shrink-0 items-start justify-between border-b px-6 py-5">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
                width={64}
                height={64}
              />
            ) : (
              <span className="text-xs text-muted-foreground">–</span>
            )}
          </div>
          <div className="space-y-1.5 pt-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold leading-tight">{product.name}</h2>
              <ProductStatusBadge status={product.status} />
            </div>
            {product.price && <p className="text-sm font-medium">{product.price}</p>}
            <p className="font-mono text-xs text-muted-foreground">/{product.slug}</p>
          </div>
        </div>
        <Button asChild size="sm" className="ml-4 shrink-0">
          <Link href={`/admin/products/${product.slug}/edit`}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Modifier
          </Link>
        </Button>
      </div>

      {/* Contenu — sections lecture seule */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-8 px-6 py-6">
          {product.description && (
            <ProductSection title="Description">
              <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            </ProductSection>
          )}

          <ProductSection title="Prix">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Prix de vente</p>
                <p className="text-sm font-medium">{product.price ?? "—"}</p>
              </div>
              {product.compareAtPrice && (
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Prix avant réduction</p>
                  <p className="text-sm font-medium text-muted-foreground line-through">
                    {product.compareAtPrice}
                  </p>
                </div>
              )}
            </div>
          </ProductSection>

          <ProductSection title="Références">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">SKU</p>
                <p className="font-mono text-sm">{product.sku ?? "—"}</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Slug URL</p>
                <p className="font-mono text-xs text-muted-foreground">{product.slug}</p>
              </div>
            </div>
          </ProductSection>

          {product.categories && product.categories.length > 0 && (
            <ProductSection title="Catégories">
              <div className="flex flex-wrap gap-1.5">
                {product.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </ProductSection>
          )}

          {product.variants && product.variants.length > 0 && (
            <ProductSection title={`Variantes (${product.variants.length})`}>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between rounded-lg border px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium">{variant.name}</p>
                      {variant.sku && (
                        <p className="font-mono text-xs text-muted-foreground">{variant.sku}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {variant.price && <p className="text-sm font-medium">{variant.price}</p>}
                      {variant.stock !== undefined && (
                        <p className="text-xs text-muted-foreground">{variant.stock} en stock</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ProductSection>
          )}
        </div>
      </div>
    </div>
  );
}

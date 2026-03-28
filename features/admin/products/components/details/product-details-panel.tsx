import Link from "next/link";

import {
  buildProductEditorHref,
  type ProductsPageParams,
} from "@/features/admin/products/navigation";
import type { AdminProductDetails } from "@/features/admin/products/details";
import type { JSX } from "react";

type ProductDetailsPanelProps = {
  params: ProductsPageParams;
  product: AdminProductDetails | null;
};

function formatStatus(status: AdminProductDetails["status"]): string {
  switch (status) {
    case "published":
      return "Publié";
    case "archived":
      return "Archivé";
    default:
      return "Brouillon";
  }
}

function getStatusBadgeClass(status: AdminProductDetails["status"]): string {
  switch (status) {
    case "published":
      return "border-green-500/30 bg-green-500/10 text-green-200";
    case "archived":
      return "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";
    default:
      return "border-amber-500/30 bg-amber-500/10 text-amber-200";
  }
}

function formatProductType(type: AdminProductDetails["productType"]): string {
  return type === "variable" ? "Variable" : "Simple";
}

function formatPrice(product: AdminProductDetails): string {
  if (!product.amount) {
    return "Prix à définir";
  }

  return `${product.amount} €`;
}

function DiagnosticItem({ label, ok }: { label: string; ok: boolean }): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
      <span className="text-sm">{label}</span>
      <span
        className={ok ? "text-xs font-medium text-green-300" : "text-xs font-medium text-amber-300"}
      >
        {ok ? "OK" : "À compléter"}
      </span>
    </div>
  );
}

function ProductHero({ product }: { product: AdminProductDetails }): JSX.Element {
  if (product.primaryImageUrl) {
    return (
      <div className="overflow-hidden rounded-2xl border bg-muted/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.primaryImageUrl}
          alt={product.primaryImageAlt ?? product.name}
          className="h-48 w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-48 items-center justify-center rounded-2xl border bg-muted/20 text-sm text-muted-foreground">
      Aucune image principale
    </div>
  );
}

export function ProductDetailsPanel({ params, product }: ProductDetailsPanelProps): JSX.Element {
  if (!product) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        Le produit sélectionné est introuvable.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card">
      <div className="border-b p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-semibold">{product.name}</h2>

              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${getStatusBadgeClass(
                  product.status
                )}`}
              >
                {formatStatus(product.status)}
              </span>

              <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                {formatProductType(product.productType)}
              </span>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              {product.shortDescription ?? "Sans description courte"}
            </p>
          </div>

          <Link
            href={buildProductEditorHref(params, product.slug)}
            className="rounded-md border px-3 py-2 text-sm font-medium"
          >
            Modifier
          </Link>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <ProductHero product={product} />

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Prix</p>
            <p className="mt-1 text-sm font-medium">{formatPrice(product)}</p>
            {product.compareAtAmount ? (
              <p className="text-xs text-muted-foreground line-through">
                {product.compareAtAmount} €
              </p>
            ) : null}
          </div>

          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Variantes</p>
            <p className="mt-1 text-sm font-medium">
              {product.variantCount} variante{product.variantCount > 1 ? "s" : ""}
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium">Catégories</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.categories.length === 0 ? (
              <span className="text-sm text-muted-foreground">Aucune catégorie</span>
            ) : (
              product.categories.map((category) => (
                <span key={category.id} className="rounded-full border px-2 py-1 text-xs">
                  {category.name}
                </span>
              ))
            )}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium">Diagnostic</h3>
          <div className="mt-2 space-y-2">
            <DiagnosticItem
              label="Image principale"
              ok={!product.diagnostics.missingPrimaryImage}
            />
            <DiagnosticItem label="Prix" ok={!product.diagnostics.missingPrice} />
            <DiagnosticItem
              label="Catégorie principale"
              ok={!product.diagnostics.missingCategory}
            />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium">Variantes</h3>
          <div className="mt-2 space-y-2">
            {product.variants.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune variante</p>
            ) : (
              product.variants.map((variant) => (
                <div key={variant.id} className="rounded-xl border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {variant.name ?? "Variante sans nom"}
                      </p>
                      <p className="text-xs text-muted-foreground">{variant.sku}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatStatus(variant.status)}
                    </span>
                  </div>

                  {variant.optionValues.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {variant.optionValues.map((optionValue, index) => (
                        <span
                          key={`${variant.id}-${optionValue.optionName}-${index}`}
                          className="rounded-full border px-2 py-1 text-[11px] text-muted-foreground"
                        >
                          {optionValue.optionName} : {optionValue.value}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </section>

        {product.description ? (
          <section>
            <details className="rounded-xl border p-3">
              <summary className="cursor-pointer text-sm font-medium">Description complète</summary>
              <div className="mt-3 text-sm text-muted-foreground">{product.description}</div>
            </details>
          </section>
        ) : null}
      </div>
    </div>
  );
}

import type { AdminProductEditorData } from "@/features/admin/products/editor";
import type { JSX } from "react";

type ProductEditorPanelProps = {
  product: AdminProductEditorData | null;
};

export function ProductEditorPanel({ product }: ProductEditorPanelProps): JSX.Element {
  if (!product) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        Aucun produit sélectionné pour l’édition.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card">
      <div className="border-b p-6">
        <h2 className="text-lg font-semibold">Édition</h2>
        <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
      </div>

      <div className="space-y-6 p-6">
        <section>
          <h3 className="text-sm font-medium">Général</h3>
          <div className="mt-3 grid gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Slug</p>
              <p className="text-sm">{product.slug}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Description courte</p>
              <p className="text-sm">{product.shortDescription || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="text-sm">{product.description || "—"}</p>
            </div>
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
          <h3 className="text-sm font-medium">Images</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {product.images.length} image{product.images.length > 1 ? "s" : ""}
          </p>
        </section>

        <section>
          <h3 className="text-sm font-medium">Variantes</h3>
          <div className="mt-2 space-y-2">
            {product.variants.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune variante</p>
            ) : (
              product.variants.map((variant) => (
                <div key={variant.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{variant.name || "Variante sans nom"}</p>
                      <p className="text-xs text-muted-foreground">{variant.sku}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{variant.status}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium">SEO</h3>
          <div className="mt-3 grid gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Titre</p>
              <p className="text-sm">{product.seo.title || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="text-sm">{product.seo.description || "—"}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

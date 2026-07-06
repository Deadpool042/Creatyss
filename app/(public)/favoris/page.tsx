import type { Metadata } from "next";
import Link from "next/link";

import { StorefrontEmptyState } from "@/components/storefront/storefront-empty-state";
import { readFavoriteProductIds } from "@/core/sessions/favorites";
import { findFavoriteProductsByIds } from "@/features/storefront/catalog/queries/find-favorite-products-by-ids";
import { getUploadsPublicPath } from "@/core/uploads";
import { FavoriteProductCard } from "@/features/storefront/favorites/components/favorite-product-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mes favoris — Creatyss",
  description: "Vos pièces mises de côté.",
};

export default async function FavoritesPage() {
  const productIds = await readFavoriteProductIds();
  const uploadsPublicPath = getUploadsPublicPath();

  const products = await findFavoriteProductsByIds(productIds);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-8">
      <div className="mb-8 grid gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Mes favoris
        </h1>
        <p className="text-sm text-text-muted-strong">
          {products.length > 0
            ? `${products.length} pièce${products.length > 1 ? "s" : ""} mise${products.length > 1 ? "s" : ""} de côté`
            : "Aucun favori pour le moment"}
        </p>
      </div>

      {products.length === 0 ? (
        <StorefrontEmptyState
          title="Vous n'avez pas encore ajouté de pièces à vos favoris"
          action={
            <Link
              href="/boutique"
              className="mx-auto inline-flex items-center gap-2 rounded-lg border border-control-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-control-border-strong hover:bg-surface-panel/60"
            >
              Découvrir la boutique
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <FavoriteProductCard
              key={product.id}
              product={product}
              uploadsPublicPath={uploadsPublicPath}
              initialFavoriteProductIds={productIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}

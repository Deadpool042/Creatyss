//features/storefront/catalog/boutique-page/components/boutique-page.tsx
import { BoutiqueEmptyState } from "@/features/storefront/catalog/boutique-page/components/boutique-empty-state";
import { BoutiqueMarketAside } from "@/features/storefront/catalog/boutique-page/components/aside/boutique-market-aside";
import { BoutiqueMobileCategoryGrid } from "@/features/storefront/catalog/boutique-page/components/header/boutique-mobile-category-grid";
import { BoutiquePageHeader } from "@/features/storefront/catalog/boutique-page/components/header/boutique-page-header";
import { BoutiquePagination } from "@/features/storefront/catalog/boutique-page/components/products/boutique-pagination";
import { BoutiqueProductGrid } from "@/features/storefront/catalog/boutique-page/components/products/boutique-product-grid";
import { BoutiqueSidebar } from "@/features/storefront/catalog/boutique-page/components/sidebar/boutique-sidebar";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiquePageProps = {
  model: BoutiquePageViewModel;
  initialFavoriteProductIds: readonly string[];
};

export function BoutiquePage({ model, initialFavoriteProductIds }: BoutiquePageProps) {
  const hasActiveFilters = model.activeFilterLabels.length > 0;
  const isDiscoveryMode =
    model.activeFilterLabels.length === 0 && model.selectedSort === "featured";
  const productCount = model.totalProductCount;
  const productCountLabel = `${productCount} produit${productCount > 1 ? "s" : ""}`;
  const heroImage = model.heroImage;

  return (
    <section className="grid gap-4 laptop:grid-cols-[minmax(0,1fr)_220px] laptop:items-start desktop:grid-cols-[minmax(0,1fr)_240px] wide:grid-cols-[240px_minmax(0,1fr)_250px] ultrawide:grid-cols-[280px_minmax(0,1fr)_300px]">
      <BoutiqueSidebar model={model} />

      <div className="min-w-0 grid gap-4 laptop:gap-5 ">
        <BoutiquePageHeader
          model={model}
          productCountLabel={productCountLabel}
          isDiscoveryMode={isDiscoveryMode}
          heroImage={heroImage || null}
        />

        {isDiscoveryMode ? (
          <div className="wide:hidden">
            <BoutiqueMobileCategoryGrid categories={model.categories} resetHref={model.resetHref} />
          </div>
        ) : null}

        {model.products.length > 0 ? (
          <>
            <BoutiqueProductGrid
              products={model.products}
              initialFavoriteProductIds={initialFavoriteProductIds}
            />
            <BoutiquePagination pagination={model.pagination} />
          </>
        ) : (
          <BoutiqueEmptyState hasActiveFilters={hasActiveFilters} resetHref={model.resetHref} />
        )}
      </div>

      <BoutiqueMarketAside href={model.resetHref} />
    </section>
  );
}

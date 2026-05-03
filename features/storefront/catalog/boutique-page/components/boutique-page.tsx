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
    <div className="grid gap-5 sm:max-[899px]:landscape:gap-3 min-[700px]:gap-6 md:max-[1199px]:gap-4 desktop:gap-5">
      <BoutiquePageHeader
        model={model}
        productCountLabel={productCountLabel}
        isDiscoveryMode={isDiscoveryMode}
        heroImage={heroImage || null}
      />

      <section className="grid gap-4 sm:max-[899px]:landscape:gap-2.5 md:max-[1199px]:gap-3.5 laptop:grid-cols-[minmax(0,1fr)_220px] desktop:grid-cols-[minmax(0,1fr)_240px] desktop:items-start wide:grid-cols-[240px_minmax(0,1fr)_250px] ultrawide:grid-cols-[260px_minmax(0,1fr)_280px]">
        <BoutiqueSidebar model={model} />

        <div className="grid gap-4 px-2 md:px-0 sm:max-[899px]:landscape:gap-2.5 min-[700px]:gap-5 md:max-[1199px]:gap-4 desktop:pb-10">
          {isDiscoveryMode ? (
            <div className="sm:max-[1199px]:landscape:hidden">
              <BoutiqueMobileCategoryGrid
                categories={model.categories}
                resetHref={model.resetHref}
              />
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
    </div>
  );
}

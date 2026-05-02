//features/storefront/catalog/boutique-page/components/boutique-page.tsx
import { BoutiqueEmptyState } from "@/features/storefront/catalog/boutique-page/components/boutique-empty-state";
import { BoutiqueMarketAside } from "@/features/storefront/catalog/boutique-page/components/aside/boutique-market-aside";
import { BoutiqueMobileFilters } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-mobile-filters";
import { BoutiqueMobileCategoryGrid } from "@/features/storefront/catalog/boutique-page/components/header/boutique-mobile-category-grid";
import { BoutiquePageHeader } from "@/features/storefront/catalog/boutique-page/components/header/boutique-page-header";
import { BoutiqueProductsLoadMore } from "@/features/storefront/catalog/boutique-page/components/products/boutique-products-load-more";
import { BoutiqueSidebar } from "@/features/storefront/catalog/boutique-page/components/sidebar/boutique-sidebar";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiquePageProps = {
  model: BoutiquePageViewModel;
};

export function BoutiquePage({ model }: BoutiquePageProps) {
  const hasActiveFilters = model.activeFilterLabels.length > 0;
  const isDiscoveryMode =
    model.activeFilterLabels.length === 0 && model.selectedSort === "featured";
  const productCount = model.totalProductCount;
  const productCountLabel = `${productCount} produit${productCount > 1 ? "s" : ""}`;
  const heroImage = model.heroImage;
  return (
    <div className="grid gap-6  md:px-4 md:pt-4 sm:max-[899px]:landscape:gap-3 min-[700px]:gap-7 md:max-[1199px]:gap-5 desktop:box-border desktop:h-full desktop:min-h-0 desktop:grid-rows-[auto_minmax(0,1fr)] desktop:gap-6 desktop:overflow-hidden desktop:pt-5">
      <BoutiquePageHeader
        model={model}
        productCountLabel={productCountLabel}
        isDiscoveryMode={isDiscoveryMode}
        heroImage={heroImage || null}
      />

      <section className="grid gap-5 sm:max-[899px]:landscape:gap-2.5 md:max-[1199px]:gap-4 laptop:grid-cols-[minmax(0,1fr)_220px] desktop:h-full desktop:min-h-0 desktop:grid-cols-[minmax(0,1fr)_240px] desktop:items-start desktop:overflow-hidden wide:grid-cols-[240px_minmax(0,1fr)_250px] ultrawide:grid-cols-[260px_minmax(0,1fr)_280px]">
        <BoutiqueSidebar model={model} />

        <div className="grid gap-4 px-2 md:px-0 sm:max-[899px]:landscape:gap-2.5 min-[700px]:gap-5 md:max-[1199px]:gap-4 desktop:h-full desktop:min-h-0 desktop:overflow-y-auto desktop:pb-10 desktop:pr-2">
          {isDiscoveryMode ? (
            <>
              <div className="sm:max-[1199px]:landscape:hidden">
                <BoutiqueMobileCategoryGrid
                  categories={model.categories}
                  resetHref={model.resetHref}
                />
              </div>
              <div className="sm:hidden ">
                <BoutiqueMobileFilters
                  model={model}
                  label="Filtres et tri"
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-control-border px-3 text-sm text-text-muted-strong transition-colors hover:border-control-border-strong hover:text-foreground"
                />
              </div>
            </>
          ) : null}

          {model.products.length > 0 ? (
            <BoutiqueProductsLoadMore
              initialProducts={model.products}
              initialNextCursor={model.pagination.nextCursor}
              initialHasMore={model.pagination.hasMore}
              pageSize={model.pagination.pageSize}
              filters={model.apiFilters}
            />
          ) : (
            <BoutiqueEmptyState hasActiveFilters={hasActiveFilters} resetHref={model.resetHref} />
          )}
        </div>

        <BoutiqueMarketAside href={model.resetHref} />
      </section>
    </div>
  );
}

// features/storefront/catalog/boutique-page/components/boutique-page.tsx

import { BoutiqueEmptyState } from "./boutique-empty-state";
import { BoutiqueMarketAside } from "./aside/boutique-market-aside";
import { BoutiqueListingActionsBar } from "./header/boutique-listing-actions-bar";
import { BoutiqueMobileCategoryGrid } from "./header/boutique-mobile-category-grid";
import { BoutiquePageHeader } from "./header/boutique-page-header";
import { BoutiquePagination } from "./products/boutique-pagination";
import { BoutiqueProductGrid } from "./products/boutique-product-grid";
import { BoutiqueSidebar } from "./sidebar/boutique-sidebar";
import { BOUTIQUE_REASSURANCE_ITEMS } from "../data/boutique-reassurance-items";
import { boutiqueCopyConfig } from "../config/boutique-copy.config";
import type { BoutiquePageViewModel } from "../types";

type BoutiquePageProps = {
  model: BoutiquePageViewModel;
  initialFavoriteProductIds: readonly string[];
};

export function BoutiquePage({ model, initialFavoriteProductIds }: BoutiquePageProps) {
  const hasActiveFilters = model.activeFilterLabels.length > 0;

  const hasDiscoveryBlockingFilter =
    model.searchQuery.trim().length > 0 ||
    model.selectedCategorySlugs.length > 0 ||
    model.selectedAvailabilityStatus !== null ||
    model.selectedMaxPriceCents !== null ||
    model.selectedMinPriceCents !== null ||
    model.selectedSort !== "featured";

  const isDiscoveryMode = !hasDiscoveryBlockingFilter;
  const shouldShowMobileCategoryDiscovery = isDiscoveryMode && model.categories.length > 0;
  const activeCategoryName = model.categories.find((category) => category.isActive)?.name ?? null;

  const productCount = model.totalProductCount;
  const productCountLabel = `${productCount} produit${productCount > 1 ? "s" : ""}`;

  return (
    <section
      data-testid="boutique-page"
      data-motion-surface="page-layout"
      className="flex w-full flex-col   bg-background"
    >
      <BoutiquePageHeader
        productCountLabel={productCountLabel}
        activeCategoryName={activeCategoryName}
      />

      <div
        data-testid="boutique-shop-layout"
        className="grid grid-cols-1 items-start py-4 gap-4 w-full tablet:grid-cols-[minmax(0,1fr)_210px] laptop:grid-cols-[minmax(0,1fr)_240px] laptop:gap-6 laptop:w-[min(100%-2rem,82rem)] laptop:mx-auto desktop:grid-cols-[minmax(0,1fr)_260px] desktop:gap-7 wide:grid-cols-[250px_minmax(0,1fr)_260px] wide:gap-8 wide:w-[min(100%-4rem,106rem)] wide:pb-3 tablet:px-3 wide:px-0"
      >
        <BoutiqueSidebar model={model} />

        <main
          data-testid="boutique-catalog-panel"
          data-motion-surface="catalog-panel"
          className="relative z-10 -mt-4 rounded-t-xl bg-background  pt-3 grid min-w-0 gap-3.5 tablet:static tablet:z-auto tablet:mt-0 tablet:rounded-none   tablet:pt-0 tablet:gap-4 laptop:gap-4 desktop:gap-5"
        >
          <BoutiqueListingActionsBar model={model} />

          {shouldShowMobileCategoryDiscovery ? (
            <div className="block desktop:hidden">
              <BoutiqueMobileCategoryGrid
                categories={model.categories}
                resetHref={model.resetHref}
              />
            </div>
          ) : null}

          {model.products.length > 0 ? (
            <div className="grid min-w-0 gap-4 ">
              <BoutiqueProductGrid
                products={model.products}
                initialFavoriteProductIds={initialFavoriteProductIds}
              />

              <BoutiquePagination pagination={model.pagination} />
            </div>
          ) : (
            <BoutiqueEmptyState hasActiveFilters={hasActiveFilters} resetHref={model.resetHref} />
          )}
        </main>

        <BoutiqueMarketAside />
      </div>

      <section
        aria-label={boutiqueCopyConfig.engagements.ariaLabel}
        className="border-y border-surface-border-subtle bg-background-secondary py-3 tablet:py-3.5"
      >
        <ul className="m-0 list-none p-0 px-4 tablet:px-6 laptop:px-0 laptop:w-[min(100%-2rem,82rem)] laptop:mx-auto wide:w-[min(100%-4rem,106rem)] grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-4 desktop:gap-0 desktop:divide-x desktop:divide-surface-border-subtle desktop:*:px-4 desktop:[&>*:first-child]:pl-0 desktop:[&>*:last-child]:pr-0">
          {BOUTIQUE_REASSURANCE_ITEMS.map((item) => {
            const { Icon } = item;
            return (
              <li key={item.title} className="flex items-start gap-2.5">
                <Icon className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="m-0 text-sm font-semibold leading-snug text-foreground">
                    {item.title}
                  </p>
                  <p className="m-0 mt-0.5 text-xs leading-relaxed text-text-muted-strong">
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
}

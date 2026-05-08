// features/storefront/catalog/boutique-page/components/boutique-page.tsx

import { BoutiqueEmptyState } from "./boutique-empty-state";
import { BoutiqueMarketAside } from "./aside/boutique-market-aside";
import { BoutiqueListingActionsBar } from "./header/boutique-listing-actions-bar";
import { BoutiqueMobileCategoryGrid } from "./header/boutique-mobile-category-grid";
import { BoutiquePageHeader } from "./header/boutique-page-header";
import { BoutiquePagination } from "./products/boutique-pagination";
import { BoutiqueProductGrid } from "./products/boutique-product-grid";
import { BoutiqueSidebar } from "./sidebar/boutique-sidebar";
import type { BoutiquePageViewModel } from "../types";

type BoutiquePageProps = {
  model: BoutiquePageViewModel;
  initialFavoriteProductIds: readonly string[];
};

const BOUTIQUE_REASSURANCE_ITEMS = [
  "Fait main à Saint-Étienne",
  "Matières responsables et sans cuir",
  "Pièces uniques en petites séries",
  "Sur-mesure sur demande",
] as const;

export function BoutiquePage({ model, initialFavoriteProductIds }: BoutiquePageProps) {
  const hasActiveFilters = model.activeFilterLabels.length > 0;

  const hasDiscoveryBlockingFilter =
    model.searchQuery.trim().length > 0 ||
    model.selectedCategorySlug.trim().length > 0 ||
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
    <section className="boutique-page-layout" data-testid="boutique-page">
      <BoutiquePageHeader
        productCountLabel={productCountLabel}
        activeCategoryName={activeCategoryName}
      />

      <div className="boutique-shop-layout">
        <BoutiqueSidebar model={model} />

        <main className="boutique-catalog-panel " data-testid="boutique-catalog-panel">
          <BoutiqueListingActionsBar model={model} />

          {shouldShowMobileCategoryDiscovery ? (
            <div className="boutique-mobile-discovery-shell ">
              <BoutiqueMobileCategoryGrid
                categories={model.categories}
                resetHref={model.resetHref}
              />
            </div>
          ) : null}

          {model.products.length > 0 ? (
            <div className="boutique-catalog-content">
              <BoutiqueProductGrid
                products={model.products}
                initialFavoriteProductIds={initialFavoriteProductIds}
              />

              <BoutiquePagination pagination={model.pagination} />
            </div>
          ) : (
            <BoutiqueEmptyState hasActiveFilters={hasActiveFilters} resetHref={model.resetHref} />
          )}

          <section className="boutique-reassurance-band" aria-label="Engagements Creatyss">
            <ul className="boutique-reassurance-band-list">
              {BOUTIQUE_REASSURANCE_ITEMS.map((item) => (
                <li key={item} className="boutique-reassurance-band-item">
                  <span className="boutique-reassurance-band-icon" aria-hidden="true">
                    ✦
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </main>

        <BoutiqueMarketAside href={model.resetHref} />
      </div>
    </section>
  );
}

import { BoutiqueActiveFilters } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-active-filters";
import { BoutiqueMobileFilters } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-mobile-filters";
import { BoutiqueSortForm } from "@/features/storefront/catalog/boutique-page/components/form/boutique-sort-form";
import { BoutiqueFiltersDrawer } from "@/features/storefront/catalog/boutique-page/components/sidebar/boutique-filters-drawer";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";
import { BoutiqueViewToggle } from "./boutique-view-toggle";

type BoutiqueListingActionsBarProps = {
  model: BoutiquePageViewModel;
};

export function BoutiqueListingActionsBar({ model }: BoutiqueListingActionsBarProps) {
  return (
    <div className="boutique-listing-actions">
      <div className="boutique-listing-actions-row">
        <div className="boutique-listing-actions-primary">
          <BoutiqueMobileFilters
            model={model}
            label="Filtres"
            className="boutique-control-button laptop:hidden"
          />

          <BoutiqueFiltersDrawer
            model={model}
            label="Filtres"
            className="boutique-control-button-desktop"
          />

          <BoutiqueSortForm
            searchQuery={model.searchQuery}
            selectedCategorySlug={model.selectedCategorySlug}
            selectedAvailabilityStatus={model.selectedAvailabilityStatus}
            selectedMinPriceCents={model.selectedMinPriceCents}
            selectedMaxPriceCents={model.selectedMaxPriceCents}
            selectedSort={model.selectedSort}
          />
        </div>

        <BoutiqueViewToggle />
      </div>

      <BoutiqueActiveFilters labels={model.activeFilterLabels} resetHref={model.resetHref} />
    </div>
  );
}

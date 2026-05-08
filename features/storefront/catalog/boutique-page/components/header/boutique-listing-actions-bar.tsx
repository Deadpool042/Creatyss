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
  const creationCountLabel = `${model.totalProductCount} création${
    model.totalProductCount > 1 ? "s" : ""
  }`;

  return (
    <div className="boutique-listing-actions">
      <div className="boutique-listing-actions-row">
        <div className="boutique-listing-actions-primary">
          <BoutiqueMobileFilters
            model={model}
            label="Filtres"
            className="boutique-control-button boutique-filter-trigger-mobile"
          />

          <BoutiqueFiltersDrawer
            model={model}
            label="Filtres"
            className="boutique-control-button boutique-filter-trigger-tablet"
          />

          <span className="boutique-listing-actions-count">{creationCountLabel}</span>

          <div className="boutique-filter-shortcuts" aria-label="Accès rapides aux filtres">
            <BoutiqueFiltersDrawer
              model={model}
              label="Catégories"
              className="boutique-filter-shortcut"
            />
            <BoutiqueFiltersDrawer
              model={model}
              label="Disponibilité"
              className="boutique-filter-shortcut"
            />
            <BoutiqueFiltersDrawer model={model} label="Prix" className="boutique-filter-shortcut" />
          </div>
        </div>

        <div className="boutique-listing-actions-secondary">
          <div className="boutique-sort-cluster">
            <span className="boutique-sort-label">Trier par :</span>
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
      </div>

      <BoutiqueActiveFilters labels={model.activeFilterLabels} resetHref={model.resetHref} />
    </div>
  );
}

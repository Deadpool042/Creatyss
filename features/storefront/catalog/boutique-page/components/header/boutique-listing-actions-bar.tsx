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
    <div className="grid gap-1.5 px-1.5 pb-1 min-[700px]:gap-2.5 min-[700px]:px-0 min-[700px]:pt-3">
      <div className="grid gap-1.5 px-1 min-[700px]:flex min-[700px]:items-center min-[700px]:justify-between min-[700px]:px-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5 min-[700px]:gap-2">
          <BoutiqueMobileFilters
            model={model}
            label="Filtres"
            className="inline-flex h-8 items-center rounded-lg border border-control-border bg-control-surface px-2.5 text-xs text-text-muted-strong transition-colors hover:border-control-border-strong hover:text-foreground laptop:hidden"
          />
          <BoutiqueFiltersDrawer
            model={model}
            label="Filtres"
            className="hidden laptop:inline-flex laptop:h-9 laptop:items-center laptop:rounded-lg laptop:border laptop:border-control-border laptop:bg-control-surface laptop:px-3 laptop:text-sm laptop:text-text-muted-strong laptop:transition-colors laptop:hover:border-control-border-strong laptop:hover:text-foreground wide:hidden"
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

        <BoutiqueViewToggle className="justify-self-end min-[700px]:ml-0 min-[700px]:justify-self-auto" />
      </div>

      <BoutiqueActiveFilters labels={model.activeFilterLabels} resetHref={model.resetHref} />
    </div>
  );
}

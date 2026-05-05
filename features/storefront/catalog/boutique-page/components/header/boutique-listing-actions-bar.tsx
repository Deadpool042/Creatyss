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
    <div className="grid gap-2 md:gap-3 md:px-0 md:pt-3">
      <div
        className={[
          "mx-4 flex items-center justify-between gap-2",
          "rounded-xl border border-surface-border-subtle bg-surface-panel/55 px-3 py-2.5 shadow-sm",
          "md:mx-0 md:rounded-none md:border-0 md:bg-transparent md:px-2 md:py-0 md:shadow-none",
        ].join(" ")}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <BoutiqueMobileFilters
            model={model}
            label="Filtres"
            className="inline-flex h-8 items-center rounded-md border border-control-border bg-control-surface px-2.5 text-xs text-text-muted-strong transition-colors hover:border-brand hover:text-brand laptop:hidden"
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

        <BoutiqueViewToggle />
      </div>

      <BoutiqueActiveFilters labels={model.activeFilterLabels} resetHref={model.resetHref} />
    </div>
  );
}

import { cn } from "@/lib/utils";
import { BoutiqueActiveFilters } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-active-filters";
import { BoutiqueMobileFilters } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-mobile-filters";
import { BoutiqueSortForm } from "@/features/storefront/catalog/boutique-page/components/form/boutique-sort-form";
import { BoutiqueFiltersDrawer } from "@/features/storefront/catalog/boutique-page/components/sidebar/boutique-filters-drawer";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

const FILTER_TRIGGER_BUTTON_CLASS =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-surface-border-subtle bg-control-surface px-2.5 text-xs font-medium leading-none text-text-muted-strong transition-colors hover:border-control-border-strong hover:bg-control-surface-hover hover:text-foreground active:translate-y-px [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-brand";

type BoutiqueListingActionsBarProps = {
  model: BoutiquePageViewModel;
};

export function BoutiqueListingActionsBar({ model }: BoutiqueListingActionsBarProps) {
  const creationCountLabel = `${model.totalProductCount} création${
    model.totalProductCount > 1 ? "s" : ""
  }`;

  return (
    <div className="grid gap-1.5 px-2 pt-0.5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 min-w-0">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <BoutiqueMobileFilters
            model={model}
            label="Filtres"
            className={cn(FILTER_TRIGGER_BUTTON_CLASS, "tablet:hidden")}
            triggerTestId="boutique-filter-trigger-mobile"
          />

          <BoutiqueFiltersDrawer
            model={model}
            label="Filtres"
            className={cn(
              FILTER_TRIGGER_BUTTON_CLASS,
              "hidden tablet:inline-flex tablet:h-9 tablet:rounded-lg tablet:px-3 tablet:text-sm wide:hidden"
            )}
            triggerTestId="boutique-filter-trigger-tablet"
          />

          <span
            data-testid="boutique-listing-actions-count"
            className="inline-flex items-center min-h-8 text-[0.8125rem] font-medium whitespace-nowrap text-text-muted-strong"
          >
            {creationCountLabel}
          </span>

          <div
            data-testid="boutique-filter-shortcuts"
            aria-label="Accès rapides aux filtres"
            className="hidden min-w-0 items-center gap-2 tablet:inline-flex wide:hidden"
          >
            <BoutiqueFiltersDrawer
              model={model}
              label="Catégories"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-surface-border-subtle bg-control-surface px-3 text-sm font-medium text-text-muted-strong transition-colors hover:border-control-border-strong hover:bg-control-surface-hover hover:text-foreground"
              triggerTestId="boutique-filter-shortcut-category"
            />
            <BoutiqueFiltersDrawer
              model={model}
              label="Disponibilité"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-surface-border-subtle bg-control-surface px-3 text-sm font-medium text-text-muted-strong transition-colors hover:border-control-border-strong hover:bg-control-surface-hover hover:text-foreground"
              triggerTestId="boutique-filter-shortcut-availability"
            />
            <BoutiqueFiltersDrawer
              model={model}
              label="Prix"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-surface-border-subtle bg-control-surface px-3 text-sm font-medium text-text-muted-strong transition-colors hover:border-control-border-strong hover:bg-control-surface-hover hover:text-foreground"
              triggerTestId="boutique-filter-shortcut-price"
            />
          </div>
        </div>

        <div className="ml-auto flex min-w-0 items-center justify-end gap-2">
          <div className="inline-flex min-w-0 items-center gap-1.5">
            <span className="hidden tablet:inline text-[0.8125rem] font-medium whitespace-nowrap text-text-muted-strong">
              Trier par :
            </span>
            <BoutiqueSortForm
              searchQuery={model.searchQuery}
              selectedCategorySlug={model.selectedCategorySlug}
              selectedAvailabilityStatus={model.selectedAvailabilityStatus}
              selectedMinPriceCents={model.selectedMinPriceCents}
              selectedMaxPriceCents={model.selectedMaxPriceCents}
              selectedSort={model.selectedSort}
            />
          </div>
        </div>
      </div>

      <BoutiqueActiveFilters labels={model.activeFilterLabels} resetHref={model.resetHref} />
    </div>
  );
}

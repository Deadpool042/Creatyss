import { cn } from "@/lib/utils";
import { BoutiqueActiveFilters } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-active-filters";
import { BoutiqueMobileFilters } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-mobile-filters";
import { BoutiqueSortForm } from "@/features/storefront/catalog/boutique-page/components/form/boutique-sort-form";
import { BoutiqueFiltersDrawer } from "@/features/storefront/catalog/boutique-page/components/sidebar/boutique-filters-drawer";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

const FILTER_TRIGGER_BUTTON_CLASS =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-surface-border-subtle bg-control-surface px-2.5 text-xs font-medium leading-none text-text-muted-strong transition-colors hover:border-control-border-strong hover:bg-control-surface-hover hover:text-foreground active:translate-y-px [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-brand ";

type BoutiqueListingActionsBarProps = {
  model: BoutiquePageViewModel;
};

export function BoutiqueListingActionsBar({ model }: BoutiqueListingActionsBarProps) {
  const creationCountLabel = `${model.totalProductCount} création${
    model.totalProductCount > 1 ? "s" : ""
  }`;

  return (
    <div className="grid gap-1.5  p-2 pt-0.5 ">
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
        </div>

        <div className="ml-auto flex min-w-0 items-center justify-end gap-2">
          <div
            data-testid="boutique-filter-shortcuts"
            className="hidden tablet:flex wide:hidden items-center gap-1.5"
          >
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-surface-border-subtle bg-control-surface px-2.5 text-xs font-medium text-text-muted-strong transition-colors hover:border-control-border-strong hover:bg-control-surface-hover hover:text-foreground"
            >
              Catégories
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-surface-border-subtle bg-control-surface px-2.5 text-xs font-medium text-text-muted-strong transition-colors hover:border-control-border-strong hover:bg-control-surface-hover hover:text-foreground"
            >
              Disponibilité
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-surface-border-subtle bg-control-surface px-2.5 text-xs font-medium text-text-muted-strong transition-colors hover:border-control-border-strong hover:bg-control-surface-hover hover:text-foreground"
            >
              Prix
            </button>
          </div>

          <div
            role="group"
            aria-label="Changer la vue"
            className="inline-flex items-center gap-1 rounded-md border border-surface-border-subtle bg-control-surface p-0.5 desktop:hidden"
          >
            <button
              type="button"
              aria-label="Vue grille"
              className="inline-flex h-7 items-center rounded px-2 text-[0.7rem] font-medium text-foreground"
            >
              Grille
            </button>
            <button
              type="button"
              aria-label="Vue liste"
              className="inline-flex h-7 items-center rounded px-2 text-[0.7rem] font-medium text-text-muted-strong"
            >
              Liste
            </button>
          </div>

          <div className="inline-flex min-w-0 items-center gap-1.5">
            <span className="hidden tablet:inline text-[0.8125rem] font-medium whitespace-nowrap text-text-muted-strong">
              Trier par :
            </span>
            <BoutiqueSortForm
              searchQuery={model.searchQuery}
              selectedCategorySlugs={model.selectedCategorySlugs}
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

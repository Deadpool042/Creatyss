import Image from "next/image";

import { BoutiqueActiveFilters } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-active-filters";
import { BoutiqueMobileFilters } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-mobile-filters";
import { BoutiqueQuickFilters } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-quick-filters";
import { BoutiqueSortForm } from "@/features/storefront/catalog/boutique-page/components/form/boutique-sort-form";
import { BoutiqueFiltersDrawer } from "@/features/storefront/catalog/boutique-page/components/sidebar/boutique-filters-drawer";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueListingHeaderProps = {
  model: BoutiquePageViewModel;
  productCountLabel: string;
  isDiscoveryMode: boolean;
  heroImage: BoutiquePageViewModel["heroImage"];
};

export function BoutiqueListingHeader({
  model,
  productCountLabel,
  isDiscoveryMode,
  heroImage,
}: BoutiqueListingHeaderProps) {
  return (
    <>
      <div className={isDiscoveryMode ? "hidden" : "grid gap-3 sm:hidden"}>
        <div className="grid gap-2 px-2 py-2">
          <p className="m-0 text-[10px] uppercase tracking-[0.18em] text-brand/90">
            Collection Creatyss
          </p>

          <div className="flex items-start justify-between gap-3">
            <div className="grid gap-1">
              <h1 className="m-0">Boutique</h1>
              <p className="m-0 text-xs text-text-muted-strong">{productCountLabel}</p>
            </div>

            <BoutiqueMobileFilters
              model={model}
              label="Filtres et tri"
              className="inline-flex h-9 items-center rounded-lg border border-control-border bg-control-surface px-3 text-sm text-text-muted-strong transition-colors hover:border-control-border-strong hover:text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="relative isolate hidden overflow-hidden sm:grid sm:gap-3 md:gap-2.5 laptop:gap-2 desktop:gap-2 desktop:px-0 desktop:py-0">
        {heroImage ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[48%] overflow-hidden desktop:w-[44%]">
            <Image
              alt=""
              aria-hidden="true"
              className="object-cover object-center opacity-42 saturate-[0.94] contrast-[0.99] dark:hidden"
              fill
              priority
              sizes="(min-width: 1200px) 40vw, 45vw"
              src={heroImage.lightSrc}
            />

            <Image
              alt=""
              aria-hidden="true"
              className="hidden object-cover object-center opacity-40 saturate-[0.9] contrast-[0.96] dark:block"
              fill
              priority
              sizes="(min-width: 1200px) 40vw, 45vw"
              src={heroImage.darkSrc}
            />
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-0 z-0 bg-linear-to-r from-background/82 via-background/64 to-background/32 dark:from-background/90 dark:via-background/78 dark:to-background/52" />

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-3 md:gap-2.5 laptop:gap-2 desktop:items-center desktop:gap-2">
          <div className="grid gap-1.5 py-1 sm:pl-0 laptop:gap-1 desktop:gap-0.5">
            <p className="m-0 text-[10px] uppercase tracking-[0.18em] text-brand/90">
              Collection Creatyss
            </p>
            <h1 className="m-0">Boutique</h1>

            <p className="m-0 hidden max-w-[56ch] text-sm text-text-muted-strong sm:block desktop:text-[13px] desktop:leading-relaxed">
              Des pièces uniques faites main, pensées pour durer et sublimer vos looks du quotidien.
            </p>

            <p className="m-0 text-xs text-text-muted-strong desktop:text-[11px] desktop:tracking-[0.01em]">
              {productCountLabel}
            </p>
          </div>

          <div className="flex items-center pt-2 gap-1.5 md:gap-1.5 laptop:gap-2 desktop:gap-2">
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
        </div>
      </div>

      <div className="block">
        <BoutiqueQuickFilters filters={model.quickFilters} />
      </div>

      <BoutiqueActiveFilters labels={model.activeFilterLabels} resetHref={model.resetHref} />
    </>
  );
}

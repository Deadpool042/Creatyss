import type { ReactElement } from "react";

import { BoutiquePriceFilterForm } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-price-filter-form";
import { buildBoutiqueUrl } from "@/features/storefront/catalog/boutique-page/model/build-boutique-url";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";
import { CustomLink } from "@/components/shared";

type BoutiqueFiltersContentProps = {
  model: BoutiquePageViewModel;
  className?: string;
  wrapLink?: (link: ReactElement, key: string) => ReactElement;
};

export function BoutiqueFiltersContent({
  model,
  className = "grid gap-4",
  wrapLink,
}: BoutiqueFiltersContentProps) {
  const withWrapper = (link: ReactElement, key: string) => (wrapLink ? wrapLink(link, key) : link);

  const filterLinkClassName = (isActive: boolean) =>
    [
      "group flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-sm no-underline transition-colors hover:no-underline",
      isActive
        ? "border-brand/40 bg-surface-panel/62 text-foreground"
        : "border-transparent text-text-muted-strong hover:border-control-border hover:bg-surface-panel/38 hover:text-foreground",
    ].join(" ");

  const selectedCategoryLabel =
    model.selectedCategorySlug === ""
      ? "Tous les produits"
      : (model.filterCategories.find((category) => category.isActive)?.name ?? "Tous les produits");

  const selectedAvailabilityLabel =
    model.selectedAvailabilityStatus === null
      ? "Toutes les disponibilités"
      : (model.availabilityOptions.find((option) => option.id === model.selectedAvailabilityStatus)
          ?.label ?? "Toutes les disponibilités");

  return (
    <div className={className}>
      <section className="grid gap-2.5">
        <div className="grid gap-0.5">
          <p className="m-0 text-xs font-semibold uppercase tracking-widest text-text-muted-strong">
            Catégories
          </p>
          <p className="m-0 text-[10px] tracking-wide text-text-muted-strong/60">
            {selectedCategoryLabel}
          </p>
        </div>

        <div className="grid gap-1">
          {withWrapper(
            <CustomLink
              href={buildBoutiqueUrl({
                q: model.searchQuery,
                availability: model.selectedAvailabilityStatus,
                minPrice: model.selectedMinPriceCents,
                maxPrice: model.selectedMaxPriceCents,
                sort: model.selectedSort,
              })}
              aria-current={model.selectedCategorySlug === "" ? "page" : undefined}
              className={filterLinkClassName(model.selectedCategorySlug === "")}
            >
              <span className="truncate">Tous les produits</span>
              <span
                aria-hidden="true"
                className={
                  model.selectedCategorySlug === ""
                    ? "h-1.5 w-1.5 rounded-full bg-brand"
                    : "h-1.5 w-1.5 rounded-full bg-transparent"
                }
              />
            </CustomLink>,
            "category-all"
          )}

          {model.filterCategories.map((category) =>
            withWrapper(
              <CustomLink
                key={category.id}
                href={category.href}
                aria-current={category.isActive ? "page" : undefined}
                className={filterLinkClassName(category.isActive)}
              >
                <span className="truncate">{category.name}</span>
                <span
                  aria-hidden="true"
                  className={
                    category.isActive
                      ? "h-1.5 w-1.5 rounded-full bg-brand"
                      : "h-1.5 w-1.5 rounded-full bg-transparent"
                  }
                />
              </CustomLink>,
              `category-${category.id}`
            )
          )}
        </div>
      </section>

      <section className="grid gap-2.5 border-t border-shell-border/70 pt-5">
        <div className="grid gap-0.5">
          <p className="m-0 text-xs font-semibold uppercase tracking-widest text-text-muted-strong">
            Disponibilité
          </p>
          <p className="m-0 text-[10px] tracking-wide text-text-muted-strong/60">
            {selectedAvailabilityLabel}
          </p>
        </div>

        <div className="grid gap-1">
          {withWrapper(
            <CustomLink
              href={buildBoutiqueUrl({
                q: model.searchQuery,
                category: model.selectedCategorySlug,
                availability: null,
                minPrice: model.selectedMinPriceCents,
                maxPrice: model.selectedMaxPriceCents,
                sort: model.selectedSort,
              })}
              aria-current={model.selectedAvailabilityStatus === null ? "page" : undefined}
              className={filterLinkClassName(model.selectedAvailabilityStatus === null)}
            >
              <span className="truncate">Toutes les disponibilités</span>
              <span className="rounded-full border border-control-border/70 bg-surface-panel/30 px-1.5 py-0.5 font-medium tabular-nums text-[10px] text-text-muted-strong">
                {model.totalProductCount}
              </span>
            </CustomLink>,
            "availability-all"
          )}

          {model.availabilityOptions.map((option) =>
            withWrapper(
              <CustomLink
                key={option.id}
                href={buildBoutiqueUrl({
                  q: model.searchQuery,
                  category: model.selectedCategorySlug,
                  availability: option.id,
                  minPrice: model.selectedMinPriceCents,
                  maxPrice: model.selectedMaxPriceCents,
                  sort: model.selectedSort,
                })}
                aria-current={model.selectedAvailabilityStatus === option.id ? "page" : undefined}
                className={filterLinkClassName(model.selectedAvailabilityStatus === option.id)}
              >
                <span className="truncate">{option.label}</span>
                {option.count !== null ? (
                  <span className="rounded-full border border-control-border/70 bg-surface-panel/30 px-1.5 py-0.5 font-medium tabular-nums text-[10px] text-text-muted-strong">
                    {option.count}
                  </span>
                ) : null}
              </CustomLink>,
              `availability-${option.id}`
            )
          )}
        </div>
      </section>

      <BoutiquePriceFilterForm
        searchQuery={model.searchQuery}
        selectedCategorySlug={model.selectedCategorySlug}
        selectedAvailabilityStatus={model.selectedAvailabilityStatus}
        selectedSort={model.selectedSort}
        selectedMinPriceCents={model.selectedMinPriceCents}
        selectedMaxPriceCents={model.selectedMaxPriceCents}
      />
    </div>
  );
}

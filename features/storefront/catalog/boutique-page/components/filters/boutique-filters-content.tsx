"use client";

import type { ReactElement } from "react";
import { Check } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BoutiquePriceFilterForm } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-price-filter-form";
import { buildBoutiqueUrl } from "@/features/storefront/catalog/boutique-page/model/build-boutique-url";
import type {
  BoutiqueCategoryItem,
  BoutiquePageViewModel,
} from "@/features/storefront/catalog/boutique-page/types";
import { CustomLink } from "@/components/shared";
import { cn } from "@/lib/utils";

type WrapLinkFn = (link: ReactElement, key: string) => ReactElement;

type CategoryGroup = {
  parent: BoutiqueCategoryItem;
  children: BoutiqueCategoryItem[];
};

type CategoryVisualState = {
  isActive: boolean;
  isIncluded: boolean;
  containsActiveChild: boolean;
};

function buildCategoryGroups(categories: BoutiqueCategoryItem[]): CategoryGroup[] {
  const roots = categories.filter((c) => c.parentId === null);
  return roots.map((parent) => ({
    parent,
    children: categories.filter((c) => c.parentId === parent.id),
  }));
}

function buildCategoryHref(
  categorySlug: string | null,
  model: BoutiquePageViewModel
): string {
  return buildBoutiqueUrl({
    q: model.searchQuery,
    category: categorySlug,
    availability: model.selectedAvailabilityStatus,
    minPrice: model.selectedMinPriceCents,
    maxPrice: model.selectedMaxPriceCents,
    sort: model.selectedSort,
  });
}

function buildCategoryToggleHref(
  category: BoutiqueCategoryItem,
  model: BoutiquePageViewModel
): string {
  return buildCategoryHref(category.isActive ? null : category.slug, model);
}

type BoutiqueFiltersContentProps = {
  model: BoutiquePageViewModel;
  className?: string | undefined;
  wrapLink?: WrapLinkFn | undefined;
};

type FilterOptionProps = {
  href: string;
  isActive: boolean;
  isIncluded?: boolean | undefined;
  containsActiveChild?: boolean | undefined;
  label: string;
  count?: number | null | undefined;
  wrapLink?: WrapLinkFn | undefined;
  linkKey: string;
};

function FilterOption({
  href,
  isActive,
  isIncluded,
  containsActiveChild,
  label,
  count,
  wrapLink,
  linkKey,
}: FilterOptionProps) {
  const link = (
    <CustomLink
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded py-1.5 pr-0.5 text-[0.8rem] no-underline transition-colors hover:no-underline",
        isActive
          ? "text-foreground"
          : containsActiveChild
            ? "text-foreground/88"
            : "text-text-muted-strong hover:text-foreground"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border transition-colors",
          isActive
            ? "border-brand bg-brand"
            : containsActiveChild
              ? "border-brand/35 bg-brand/8"
            : isIncluded
              ? "border-brand/40 bg-brand/15"
              : "border-control-border/60"
        )}
      >
        {isActive ? <Check className="size-2.5 stroke-3 text-white" /> : null}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count != null ? (
        <span className="shrink-0 text-[0.68rem] tabular-nums text-text-muted-strong/70">
          {count}
        </span>
      ) : null}
    </CustomLink>
  );

  return wrapLink ? wrapLink(link, linkKey) : link;
}

export function BoutiqueFiltersContent({
  model,
  className = "grid gap-1",
  wrapLink,
}: BoutiqueFiltersContentProps) {
  const hasActiveFilters = model.activeFilterLabels.length > 0;
  const categoryGroups = buildCategoryGroups(model.categories);

  return (
    <div className={className}>
      <div className="flex items-center justify-between py-1">
        <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-text-muted-strong">
          Filtres
        </p>
        {hasActiveFilters ? (
          <CustomLink
            href={model.resetHref}
            className="text-[0.68rem] text-text-muted-strong no-underline transition-colors hover:text-foreground"
          >
            Réinitialiser
          </CustomLink>
        ) : null}
      </div>

      <Accordion
        type="multiple"
        defaultValue={["categories", "availability", "price"]}
        className="w-full "
      >
        <AccordionItem value="categories">
          <AccordionTrigger className="py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-text-muted-strong hover:text-foreground hover:no-underline">
            Catégories
          </AccordionTrigger>
          <AccordionContent className="[&_a]:no-underline [&_a]:hover:no-underline overflow-x-auto">
            <div className="grid pb-1">
              <FilterOption
                href={buildCategoryHref(null, model)}
                isActive={model.selectedCategorySlug === ""}
                label="Tous les produits"
                wrapLink={wrapLink}
                linkKey="category-all"
              />
              {categoryGroups.map(({ parent, children }) => {
                const visualState: CategoryVisualState = {
                  isActive: parent.isActive,
                  isIncluded: false,
                  containsActiveChild: children.some((child) => child.isActive),
                };

                return (
                  <div key={parent.id} className="grid">
                    <FilterOption
                      href={buildCategoryToggleHref(parent, model)}
                      isActive={visualState.isActive}
                      isIncluded={visualState.isIncluded}
                      containsActiveChild={visualState.containsActiveChild}
                      label={parent.name}
                      wrapLink={wrapLink}
                      linkKey={`category-${parent.id}`}
                    />
                    {children.length > 0 ? (
                      <div className="grid pl-4">
                        {children.map((child) => {
                          const childVisualState: CategoryVisualState = {
                            isActive: child.isActive,
                            isIncluded: !child.isActive && parent.isActive,
                            containsActiveChild: false,
                          };

                          return (
                            <FilterOption
                              key={child.id}
                              href={buildCategoryToggleHref(child, model)}
                              isActive={childVisualState.isActive}
                              isIncluded={childVisualState.isIncluded}
                              containsActiveChild={childVisualState.containsActiveChild}
                              label={child.name}
                              wrapLink={wrapLink}
                              linkKey={`category-${child.id}`}
                            />
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger className="py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-text-muted-strong hover:text-foreground hover:no-underline">
            Disponibilité
          </AccordionTrigger>
          <AccordionContent className="[&_a]:no-underline [&_a]:hover:no-underline">
            <div className="grid pb-1">
              <FilterOption
                href={buildBoutiqueUrl({
                  q: model.searchQuery,
                  category: model.selectedCategorySlug,
                  availability: null,
                  minPrice: model.selectedMinPriceCents,
                  maxPrice: model.selectedMaxPriceCents,
                  sort: model.selectedSort,
                })}
                isActive={model.selectedAvailabilityStatus === null}
                label="Toutes les disponibilités"
                count={model.totalProductCount}
                wrapLink={wrapLink}
                linkKey="availability-all"
              />
              {model.availabilityOptions.map((option) => (
                <FilterOption
                  key={`availability-${option.id}`}
                  href={buildBoutiqueUrl({
                    q: model.searchQuery,
                    category: model.selectedCategorySlug,
                    availability: option.id,
                    minPrice: model.selectedMinPriceCents,
                    maxPrice: model.selectedMaxPriceCents,
                    sort: model.selectedSort,
                  })}
                  isActive={model.selectedAvailabilityStatus === option.id}
                  label={option.label}
                  count={option.count}
                  wrapLink={wrapLink}
                  linkKey={`availability-${option.id}`}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-b-0">
          <AccordionTrigger className="py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-text-muted-strong hover:text-foreground hover:no-underline">
            Prix
          </AccordionTrigger>
          <AccordionContent className="[&_a]:no-underline [&_a]:hover:no-underline">
            <BoutiquePriceFilterForm
              searchQuery={model.searchQuery}
              selectedCategorySlug={model.selectedCategorySlug}
              selectedAvailabilityStatus={model.selectedAvailabilityStatus}
              selectedSort={model.selectedSort}
              selectedMinPriceCents={model.selectedMinPriceCents}
              selectedMaxPriceCents={model.selectedMaxPriceCents}
              className="grid gap-2 pb-1"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

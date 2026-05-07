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

function buildCategoryHref(categorySlug: string | null, model: BoutiquePageViewModel): string {
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

function buildSidebarCategories(categoryGroups: CategoryGroup[]): BoutiqueCategoryItem[] {
  return categoryGroups.flatMap(({ parent, children }) => {
    if (children.length === 0) {
      return [parent];
    }

    if (parent.isActive) {
      return [parent, ...children];
    }

    return children;
  });
}

function formatPriceLabel(valueInCents: number | null, fallback: string): string {
  if (valueInCents === null) {
    return fallback;
  }

  return `${(valueInCents / 100).toLocaleString("fr-FR")} €`;
}

type BoutiqueFiltersContentProps = {
  model: BoutiquePageViewModel;
  className?: string | undefined;
  wrapLink?: WrapLinkFn | undefined;
  variant?: "default" | "sidebar";
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
        "flex items-center gap-2 rounded py-1.5 pr-0.5 text-[0.875rem] no-underline transition-colors hover:no-underline",
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
        <span className="shrink-0 text-[0.8125rem] tabular-nums text-text-muted-strong/70">
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
  variant = "default",
}: BoutiqueFiltersContentProps) {
  const hasActiveFilters = model.activeFilterLabels.length > 0;
  const categoryGroups = buildCategoryGroups(model.categories);
  const sidebarCategories = buildSidebarCategories(categoryGroups);
  const isSidebar = variant === "sidebar";
  const sidebarMinPriceLabel = formatPriceLabel(model.selectedMinPriceCents, "25 €");
  const sidebarMaxPriceLabel = formatPriceLabel(model.selectedMaxPriceCents, "350 €+");
  const shouldShowReset = isSidebar || hasActiveFilters;

  return (
    <div className={cn(className, isSidebar && "boutique-sidebar-filters-content")}>
      <div
        className={cn(
          "flex items-center justify-between py-1",
          isSidebar && "boutique-sidebar-filters-header"
        )}
      >
        <p
          className={cn(
            "m-0 text-[0.75rem] font-semibold uppercase tracking-widest text-text-muted-strong",
            isSidebar && "boutique-sidebar-filters-title"
          )}
        >
          Filtres
        </p>
        {shouldShowReset ? (
          <CustomLink
            href={model.resetHref}
            className={cn(
              "text-[0.8125rem] text-text-muted-strong no-underline transition-colors hover:text-foreground",
              isSidebar && "boutique-sidebar-filters-reset"
            )}
            data-inactive={!hasActiveFilters ? "true" : undefined}
          >
            Réinitialiser
          </CustomLink>
        ) : null}
      </div>

      <Accordion
        type="multiple"
        defaultValue={["categories", "availability", "price"]}
        className={cn("w-full", isSidebar && "boutique-sidebar-filter-list")}
      >
        <AccordionItem
          className={cn(isSidebar && "boutique-sidebar-filter-section")}
          value="categories"
        >
          <AccordionTrigger
            className={cn(
              "py-2 text-[0.75rem] font-semibold uppercase tracking-widest text-text-muted-strong hover:text-foreground hover:no-underline",
              isSidebar && "boutique-sidebar-filter-section-title"
            )}
          >
            Catégories
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              "[&_a]:no-underline [&_a]:hover:no-underline overflow-x-auto",
              isSidebar && "boutique-sidebar-filter-section-content boutique-sidebar-category-list"
            )}
          >
            <div className="grid pb-1">
              <FilterOption
                href={buildCategoryHref(null, model)}
                isActive={model.selectedCategorySlug === ""}
                label="Tous les produits"
                wrapLink={wrapLink}
                linkKey="category-all"
              />
              {isSidebar
                ? sidebarCategories.map((category) => (
                    <FilterOption
                      key={category.id}
                      href={buildCategoryToggleHref(category, model)}
                      isActive={category.isActive}
                      label={category.name}
                      wrapLink={wrapLink}
                      linkKey={`sidebar-category-${category.id}`}
                    />
                  ))
                : categoryGroups.map(({ parent, children }) => {
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

        <AccordionItem
          className={cn(isSidebar && "boutique-sidebar-filter-section")}
          value="availability"
        >
          <AccordionTrigger
            className={cn(
              "py-2 text-[0.75rem] font-semibold uppercase tracking-widest text-text-muted-strong hover:text-foreground hover:no-underline",
              isSidebar && "boutique-sidebar-filter-section-title"
            )}
          >
            Disponibilité
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              "[&_a]:no-underline [&_a]:hover:no-underline",
              isSidebar && "boutique-sidebar-filter-section-content"
            )}
          >
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

        <AccordionItem
          value="price"
          className={cn("border-b-0", isSidebar && "boutique-sidebar-filter-section")}
        >
          <AccordionTrigger
            className={cn(
              "py-2 text-[0.75rem] font-semibold uppercase tracking-widest text-text-muted-strong hover:text-foreground hover:no-underline",
              isSidebar && "boutique-sidebar-filter-section-title"
            )}
          >
            Gamme de prix
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              "[&_a]:no-underline [&_a]:hover:no-underline",
              isSidebar && "boutique-sidebar-filter-section-content"
            )}
          >
            {isSidebar ? (
              <div className="boutique-sidebar-price-range" aria-label="Repère visuel des prix">
                <div className="boutique-sidebar-price-range-track" aria-hidden="true">
                  <span className="boutique-sidebar-price-range-fill" />
                  <span className="boutique-sidebar-price-range-thumb" />
                </div>
                <div className="boutique-sidebar-price-range-values">
                  <span>{sidebarMinPriceLabel}</span>
                  <span>{sidebarMaxPriceLabel}</span>
                </div>
                <p className="boutique-sidebar-filter-note">
                  Repère visuel. Le filtrage réel reste piloté par les montants ci-dessous.
                </p>
              </div>
            ) : null}
            <BoutiquePriceFilterForm
              searchQuery={model.searchQuery}
              selectedCategorySlug={model.selectedCategorySlug}
              selectedAvailabilityStatus={model.selectedAvailabilityStatus}
              selectedSort={model.selectedSort}
              selectedMinPriceCents={model.selectedMinPriceCents}
              selectedMaxPriceCents={model.selectedMaxPriceCents}
              className={cn(
                "grid gap-2 pb-1",
                isSidebar && "boutique-sidebar-price-section"
              )}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  );
}

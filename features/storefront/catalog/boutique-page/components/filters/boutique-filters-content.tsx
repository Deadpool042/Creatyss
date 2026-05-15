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

import {
  COLOR_DOT_BG,
  FILTER_PREVIEW_COLORS,
  FILTER_PREVIEW_MATERIALS,
} from "./boutique-filter-preview.constants";

function buildCategoryGroups(categories: BoutiqueCategoryItem[]): CategoryGroup[] {
  const roots = categories.filter((c) => c.parentId === null);
  return roots.map((parent) => ({
    parent,
    children: categories.filter((c) => c.parentId === parent.id),
  }));
}

function buildSidebarCategoryGroups(categories: BoutiqueCategoryItem[]): CategoryGroup[] {
  return buildCategoryGroups(categories).map(({ parent, children }) => ({
    parent,
    children: children.filter((child) => child.isActive),
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
  variant: "sidebar" | "drawer";
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
        "flex items-center gap-2 rounded px-1 py-1 text-[0.875rem] no-underline transition-colors hover:bg-brand/[0.04] hover:no-underline",
        isActive
          ? "bg-brand/[0.04] font-medium text-foreground"
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
  variant,
}: BoutiqueFiltersContentProps) {
  const hasActiveFilters = model.activeFilterLabels.length > 0;
  const categoryGroups = buildCategoryGroups(model.categories);
  const isSidebar = variant === "sidebar";
  const isDrawer = variant === "drawer";
  const visibleCategoryGroups = isSidebar
    ? buildSidebarCategoryGroups(model.categories)
    : categoryGroups;
  const sidebarMinPriceLabel = formatPriceLabel(model.selectedMinPriceCents, "25 €");
  const sidebarMaxPriceLabel = formatPriceLabel(model.selectedMaxPriceCents, "350 €+");
  const shouldShowReset = isSidebar || isDrawer || hasActiveFilters;

  return (
    <div
      className={className}
    >
      <div
        className={cn(
          "flex items-center justify-between py-1",
          isSidebar && "pt-[0.05rem] pb-2 border-b border-surface-border-subtle"
        )}
      >
        <p
          className={cn(
            "m-0 text-[0.75rem] font-semibold uppercase tracking-widest text-text-muted-strong",
            isSidebar && "text-foreground tracking-[0.22em]"
          )}
        >
          Filtres
        </p>
        {shouldShowReset ? (
          <CustomLink
            href={model.resetHref}
            className={cn(
              "text-[0.8125rem] text-text-muted-strong no-underline transition-colors hover:text-foreground",
              isSidebar && "text-[0.6875rem] text-text-muted-soft underline-offset-4 data-[inactive=true]:text-text-muted-soft/50 data-[inactive=true]:pointer-events-none",
              isDrawer && "text-xs text-brand underline-offset-1 data-[inactive=true]:text-text-muted-strong/74 data-[inactive=true]:pointer-events-none"
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
        className={cn(
          "w-full",
          isSidebar && "grid",
          isDrawer && "grid gap-0.5"
        )}
      >
        <AccordionItem
          className={cn(
            isSidebar && "border-b border-surface-border-subtle pb-[0.35rem] last:border-b-0 last:pb-0",
            isDrawer && "border-b-surface-border-subtle/72"
          )}
          value="categories"
        >
          <AccordionTrigger
            className={cn(
              isSidebar ? "py-1.5" : "py-2", "text-[0.75rem] font-semibold uppercase tracking-widest text-text-muted-strong hover:text-foreground hover:no-underline",
              isSidebar && "tracking-[0.16em]",
              isDrawer && "py-[0.45rem]"
            )}
          >
            Catégories
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              "[&_a]:no-underline [&_a]:hover:no-underline overflow-x-auto",
              isSidebar && "pb-[0.2rem] overflow-x-visible",
              isDrawer && "pb-0.5 max-h-[min(13.5rem,34dvh)] overflow-y-auto pr-1"
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
              {visibleCategoryGroups.map(({ parent, children }) => {
                const visualState: CategoryVisualState = {
                  isActive: parent.isActive,
                  isIncluded: false,
                  containsActiveChild: children.some((child) => child.isActive),
                };

                return (
                  <div
                    key={parent.id}
                    className={cn("grid", isSidebar && "gap-[0.02rem]")}
                  >
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
                      <div
                        className={cn(
                          "grid pl-4",
                          isSidebar && "gap-0 pl-[0.65rem]"
                        )}
                      >
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
          className={cn(
            isSidebar && "border-b border-surface-border-subtle pb-[0.35rem] last:border-b-0 last:pb-0",
            isDrawer && "border-b-surface-border-subtle/72"
          )}
          value="availability"
        >
          <AccordionTrigger
            className={cn(
              isSidebar ? "py-1.5" : "py-2", "text-[0.75rem] font-semibold uppercase tracking-widest text-text-muted-strong hover:text-foreground hover:no-underline",
              isSidebar && "tracking-[0.16em]",
              isDrawer && "py-[0.45rem]"
            )}
          >
            Disponibilité
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              "[&_a]:no-underline [&_a]:hover:no-underline",
              isSidebar && "pb-[0.2rem]",
              isDrawer && "pb-0.5"
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
          className={cn(
            "border-b-0",
            isSidebar && "border-b border-surface-border-subtle pb-[0.35rem] last:border-b-0 last:pb-0",
            isDrawer && "border-b-0"
          )}
        >
          <AccordionTrigger
            className={cn(
              isSidebar ? "py-1.5" : "py-2", "text-[0.75rem] font-semibold uppercase tracking-widest text-text-muted-strong hover:text-foreground hover:no-underline",
              isSidebar && "tracking-[0.16em]",
              isDrawer && "py-[0.45rem]"
            )}
          >
            Prix
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              "[&_a]:no-underline [&_a]:hover:no-underline",
              isSidebar && "pb-[0.2rem]"
            )}
          >
            {isSidebar ? (
              <div className="grid gap-1.5 pb-[0.05rem]">
                <div className="relative h-[0.0625rem] rounded-full bg-surface-border-subtle" aria-hidden="true">
                  <span className="absolute top-1/2 left-0 h-[0.0625rem] w-[58%] -translate-y-1/2 rounded-full bg-brand" />
                </div>
                <div className="flex items-center justify-between gap-2 text-[0.71875rem] leading-[1.2] text-foreground">
                  <span>{sidebarMinPriceLabel}</span>
                  <span>{sidebarMaxPriceLabel}</span>
                </div>
                <p className="mt-[0.12rem] text-[0.625rem] leading-[1.35] tracking-[0.02em] text-text-muted-strong">Repère indicatif.</p>
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
                isSidebar && "gap-1.5 border-t-0 pb-[0.05rem]"
              )}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {!isSidebar ? (
        <div
          className={cn(
            "grid gap-[0.55rem] border-t border-surface-border-subtle/62 pt-[0.55rem]",
            isDrawer && "gap-1.5 border-t border-dashed border-surface-border-subtle/72 pt-[0.6rem]"
          )}
        >
          <section
            className="grid gap-[0.3rem]"
            aria-labelledby="boutique-preview-colors"
          >
            <p id="boutique-preview-colors" className="m-0 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-text-muted-strong">
              Couleurs
            </p>
            <ul className="grid grid-cols-2 gap-x-[0.6rem] gap-y-[0.35rem] m-0 p-0 list-none" aria-label="Palette indicative">
              {FILTER_PREVIEW_COLORS.map((color) => (
                <li key={color.name} className="inline-flex items-center gap-[0.4rem] text-xs leading-[1.2] text-text-muted-strong">
                  <span
                    aria-hidden="true"
                    className="size-[0.6rem] shrink-0 rounded-full border border-surface-border-subtle/72"
                    style={{ background: COLOR_DOT_BG[color.token] ?? COLOR_DOT_BG.default }}
                  />
                  <span>{color.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <section
            className="grid gap-[0.3rem]"
            aria-labelledby="boutique-preview-materials"
          >
            <p id="boutique-preview-materials" className="m-0 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-text-muted-strong">
              Matières
            </p>
            <ul className="grid gap-[0.2rem] m-0 p-0 list-none" aria-label="Matières indicatives">
              {FILTER_PREVIEW_MATERIALS.map((material) => (
                <li key={material} className="text-xs leading-[1.25] text-text-muted-strong">
                  {material}
                </li>
              ))}
            </ul>
          </section>

          <p className="m-0 text-[0.67rem] leading-[1.3] text-text-muted-strong/74">
            Indication visuelle. Ces éléments n&apos;activent pas de filtre.
          </p>
        </div>
      ) : null}

    </div>
  );
}

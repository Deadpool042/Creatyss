"use client";

import type { ReactElement } from "react";
import { Check, X } from "lucide-react";

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
import { buildCategoryGroups } from "@/features/storefront/catalog/boutique-page/model/category-group.utils";
import {
  COLOR_DOT_BG,
  FILTER_PREVIEW_COLORS,
  FILTER_PREVIEW_MATERIALS,
  selectFeaturedColors,
} from "./boutique-filter-preview.constants";
import { Popover as PopoverPrimitive } from "radix-ui";

type WrapLinkFn = (link: ReactElement, key: string) => ReactElement;

type CategoryVisualState = {
  isActive: boolean;
  isIncluded: boolean;
  containsActiveChild: boolean;
};

function buildCategoryHref(categorySlugs: string[], model: BoutiquePageViewModel): string {
  return buildBoutiqueUrl({
    q: model.searchQuery,
    categories: categorySlugs,
    availability: model.selectedAvailabilityStatus,
    minPrice: model.selectedMinPriceCents,
    maxPrice: model.selectedMaxPriceCents,
    sort: model.selectedSort,
  });
}

function buildCategoryToggleHref(
  category: BoutiqueCategoryItem,
  model: BoutiquePageViewModel,
  childSlugs: string[] = [],
  parentSlug?: string
): string {
  const current = model.selectedCategorySlugs;
  const isActive = current.includes(category.slug);
  const childSet = new Set(childSlugs);
  if (isActive) {
    return buildCategoryHref(
      current.filter((s) => s !== category.slug && !childSet.has(s)),
      model
    );
  }
  // Cliquer un enfant quand le parent est actif → remplacer le parent par l'enfant (affinage)
  if (parentSlug !== undefined && current.includes(parentSlug)) {
    return buildCategoryHref([...current.filter((s) => s !== parentSlug), category.slug], model);
  }
  return buildCategoryHref([...current.filter((s) => !childSet.has(s)), category.slug], model);
}

type BoutiqueFiltersContentProps = {
  model: BoutiquePageViewModel;
  className?: string | undefined;
  wrapLink?: WrapLinkFn | undefined;
  variant: "sidebar" | "drawer";
  onPriceMinChange?: (value: string) => void;
  onPriceMaxChange?: (value: string) => void;
};

type FilterOptionProps = {
  id?: string | undefined;
  href: string;
  isActive: boolean;
  isIncluded?: boolean | undefined;
  containsActiveChild?: boolean | undefined;
  label: string;
  count?: number | null | undefined;
  wrapLink?: WrapLinkFn | undefined;
  linkKey: string;
  kind?: "checkbox" | "radio";
};

function FilterOption({
  id,
  href,
  isActive,
  isIncluded,
  containsActiveChild,
  label,
  count,
  wrapLink,
  linkKey,
  kind = "checkbox",
}: FilterOptionProps) {
  const isRadio = kind === "radio";

  const indicator = isRadio ? (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border shadow-control transition-shadow",
        isActive ? "border-brand" : "border-control-border"
      )}
    >
      {isActive ? <span className="size-1.5 rounded-full bg-brand" /> : null}
    </span>
  ) : (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border shadow-control transition-shadow",
        isActive
          ? "border-brand bg-brand"
          : containsActiveChild
            ? "border-brand/60 bg-brand/20"
            : isIncluded
              ? "border-brand/50 bg-brand/15"
              : "border-control-border"
      )}
    >
      {isActive ? (
        <Check className="size-2.5 stroke-3 text-white" />
      ) : containsActiveChild ? (
        <span className="block h-0.5 w-2 rounded-full bg-brand/70" />
      ) : isIncluded ? (
        <span className="size-1 rounded-full bg-brand/65" />
      ) : null}
    </span>
  );

  const link = (
    <CustomLink
      id={id}
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded px-1 py-1 text-[0.875rem] no-underline transition-colors hover:bg-surface-subtle hover:no-underline",
        isActive
          ? "bg-brand/4 font-medium text-foreground"
          : containsActiveChild
            ? "text-foreground/88"
            : "text-text-muted-strong hover:text-foreground"
      )}
    >
      {indicator}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count != null ? (
        <span
          aria-hidden="true"
          className="shrink-0 text-[0.8125rem] tabular-nums text-text-muted-strong/70"
        >
          {count}
        </span>
      ) : null}
    </CustomLink>
  );

  return wrapLink ? wrapLink(link, linkKey) : link;
}

function ColorSwatch({
  color,
}: {
  color: { token: string; name: string; manufacturerReference: string };
}) {
  return (
    <li className="flex min-w-0 items-center gap-2">
      <span
        aria-hidden="true"
        className="size-3 shrink-0 rounded-full ring-1 ring-surface-border-subtle"
        style={{ background: COLOR_DOT_BG[color.token] ?? COLOR_DOT_BG.default }}
      />
      <span className="min-w-0">
        <span className="block truncate text-xs leading-tight text-text-muted-strong">
          {color.name}
        </span>
        <span className="block text-[0.68rem] leading-tight text-text-muted-strong">
          {color.manufacturerReference}
        </span>
      </span>
    </li>
  );
}

function ColorSwatches() {
  const featured = selectFeaturedColors(FILTER_PREVIEW_COLORS);
  const remaining = FILTER_PREVIEW_COLORS.length - featured.length;

  return (
    <PopoverPrimitive.Root>
      <div className="grid gap-1.5">
        <ul
          className="grid grid-cols-2 gap-x-2 gap-y-1.5 m-0 p-0 list-none"
          aria-label="Nuancier Sylvertex indicatif"
        >
          {featured.map((color) => (
            <ColorSwatch key={color.token} color={color} />
          ))}
        </ul>

        {remaining > 0 ? (
          <PopoverPrimitive.Trigger asChild>
            <button
              type="button"
              className="w-fit text-[0.6875rem] text-brand underline-offset-2 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
            >
              Voir les {remaining} autres coloris →
            </button>
          </PopoverPrimitive.Trigger>
        ) : null}
      </div>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="top"
          align="start"
          sideOffset={8}
          avoidCollisions
          collisionPadding={12}
          className={cn(
            "z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-surface-border-subtle bg-surface-floating/96 shadow-overlay backdrop-blur-xl p-0 outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
            "data-[side=bottom]:slide-out-to-top-1 data-[side=top]:slide-out-to-bottom-1",
            "duration-150 ease-out"
          )}
        >
          <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
            <div>
              <p className="m-0 text-[0.8125rem] font-semibold leading-snug text-foreground">
                Nuancier Sylvertex
              </p>
              <p className="m-0 mt-0.5 text-[0.6875rem] text-text-muted-strong">
                {FILTER_PREVIEW_COLORS.length} coloris — aperçu indicatif
              </p>
            </div>
            <PopoverPrimitive.Close className="inline-flex size-7 items-center justify-center rounded-full text-text-muted-strong transition-colors hover:bg-surface-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring">
              <X className="size-3.5" aria-hidden="true" />
              <span className="sr-only">Fermer</span>
            </PopoverPrimitive.Close>
          </div>

          <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 overflow-y-auto m-0 px-4 pb-4 pt-1 list-none max-h-[min(24rem,55dvh)]">
            {FILTER_PREVIEW_COLORS.map((color) => (
              <ColorSwatch key={color.token} color={color} />
            ))}
          </ul>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export function BoutiqueFiltersContent({
  model,
  className = "grid gap-1",
  wrapLink,
  onPriceMinChange,
  onPriceMaxChange,
  variant,
}: BoutiqueFiltersContentProps) {
  const hasActiveFilters = model.activeFilterLabels.length > 0;
  const categoryGroups = buildCategoryGroups(model.categories);
  const isSidebar = variant === "sidebar";
  const isDrawer = variant === "drawer";
  const showPreview = isDrawer || model.selectedCategorySlugs.length > 0;
  const shouldShowReset = isSidebar || isDrawer || hasActiveFilters;

  return (
    <div className={className}>
      <div
        className={cn(
          "flex items-center justify-between py-1",
          isSidebar && "pt-[0.05rem] pb-2 border-b border-surface-border-subtle"
        )}
      >
        <p
          className={cn(
            "m-0 text-[0.75rem] font-semibold uppercase tracking-wider text-text-muted-strong",
            isSidebar && "text-foreground tracking-[0.11em]"
          )}
        >
          Filtres
        </p>
        {shouldShowReset ? (
          <CustomLink
            href={model.resetHref}
            className={cn(
              "text-[0.8125rem] text-text-muted-strong no-underline transition-colors hover:text-foreground",
              isSidebar &&
                "text-[0.6875rem] text-text-muted-soft underline-offset-4 data-[inactive=true]:text-text-muted-soft/50 data-[inactive=true]:pointer-events-none",
              isDrawer &&
                "text-xs text-brand underline-offset-1 data-[inactive=true]:text-text-muted-strong/74 data-[inactive=true]:pointer-events-none"
            )}
            data-inactive={!hasActiveFilters ? "true" : undefined}
            aria-disabled={!hasActiveFilters ? "true" : undefined}
            tabIndex={!hasActiveFilters ? -1 : undefined}
          >
            Réinitialiser
          </CustomLink>
        ) : null}
      </div>

      <Accordion
        type="multiple"
        defaultValue={["categories", "availability", "price"]}
        className={cn("w-full", isSidebar && "grid", isDrawer && "grid gap-0.5")}
      >
        <AccordionItem
          className={cn(
            isSidebar &&
              "border-b border-surface-border-subtle pb-[0.35rem] last:border-b-0 last:pb-0",
            isDrawer && "border-b border-surface-border-subtle/72"
          )}
          value="categories"
        >
          <AccordionTrigger
            className={cn(
              isSidebar ? "py-1.5" : "py-2",
              "text-[0.75rem] font-semibold uppercase tracking-wider text-text-muted-strong hover:text-foreground hover:no-underline",
              isSidebar && "tracking-[0.11em]",
              isDrawer && "py-[0.45rem]"
            )}
          >
            <span className="flex items-center gap-1.5">
              Catégories
              {model.selectedCategorySlugs.length > 0 ? (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[0.625rem] font-semibold tabular-nums leading-none text-white">
                  {model.selectedCategorySlugs.length}
                </span>
              ) : null}
            </span>
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              "[&_a]:no-underline [&_a]:hover:no-underline overflow-x-auto",
              isSidebar && "pb-[0.2rem] overflow-x-visible px-0.5",
              isDrawer && "max-h-[min(13.5rem,34dvh)] overflow-y-auto px-1 pb-1"
            )}
          >
            <div className="grid pb-1">
              <FilterOption
                id="boutique-filter-category-all"
                href={buildCategoryHref([], model)}
                isActive={model.selectedCategorySlugs.length === 0}
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
                  <div key={parent.id} className={cn("grid", isSidebar && "gap-[0.02rem]")}>
                    <FilterOption
                      id={`boutique-filter-category-${parent.slug}`}
                      href={buildCategoryToggleHref(
                        parent,
                        model,
                        children.map((c) => c.slug)
                      )}
                      isActive={visualState.isActive}
                      isIncluded={visualState.isIncluded}
                      containsActiveChild={visualState.containsActiveChild}
                      label={parent.name}
                      wrapLink={wrapLink}
                      linkKey={`category-${parent.id}`}
                    />
                    {children.length > 0 ? (
                      <div className={cn("grid pl-4", isSidebar && "gap-0 pl-[0.65rem]")}>
                        {children.map((child) => {
                          const childVisualState: CategoryVisualState = {
                            isActive: child.isActive,
                            isIncluded: !child.isActive && parent.isActive,
                            containsActiveChild: false,
                          };

                          return (
                            <FilterOption
                              key={child.id}
                              id={`boutique-filter-category-${child.slug}`}
                              href={buildCategoryToggleHref(child, model, [], parent.slug)}
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
            isSidebar &&
              "border-b border-surface-border-subtle pb-[0.35rem] last:border-b-0 last:pb-0",
            isDrawer && "border-b border-surface-border-subtle/72"
          )}
          value="availability"
        >
          <AccordionTrigger
            className={cn(
              isSidebar ? "py-1.5" : "py-2",
              "text-[0.75rem] font-semibold uppercase tracking-wider text-text-muted-strong hover:text-foreground hover:no-underline",
              isSidebar && "tracking-[0.11em]",
              isDrawer && "py-[0.45rem]"
            )}
          >
            <span className="flex items-center gap-1.5">
              Disponibilité
              {model.selectedAvailabilityStatus !== null ? (
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-brand" />
              ) : null}
            </span>
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              "[&_a]:no-underline [&_a]:hover:no-underline",
              isSidebar && "pb-[0.2rem] px-0.5",
              isDrawer && "pb-0.5 px-0.5"
            )}
          >
            {isSidebar ? (
              <p className="mb-0.5 px-1 text-[0.6875rem] leading-[1.3] text-text-muted-soft">
                Un seul statut à la fois.
              </p>
            ) : null}
            <div className="grid pb-1">
              <FilterOption
                href={buildBoutiqueUrl({
                  q: model.searchQuery,
                  categories: model.selectedCategorySlugs,
                  availability: null,
                  minPrice: model.selectedMinPriceCents,
                  maxPrice: model.selectedMaxPriceCents,
                  sort: model.selectedSort,
                })}
                isActive={model.selectedAvailabilityStatus === null}
                label="Toutes les disponibilités"
                wrapLink={wrapLink}
                linkKey="availability-all"
                kind="radio"
              />
              {model.availabilityOptions.map((option) => (
                <FilterOption
                  key={`availability-${option.id}`}
                  href={buildBoutiqueUrl({
                    q: model.searchQuery,
                    categories: model.selectedCategorySlugs,
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
                  kind="radio"
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="price"
          className={cn(
            "border-b-0",
            isSidebar &&
              "border-b border-surface-border-subtle pb-[0.35rem] last:border-b-0 last:pb-0",
            isDrawer && "border-b-0"
          )}
        >
          <AccordionTrigger
            className={cn(
              isSidebar ? "py-1.5" : "py-2",
              "text-[0.75rem] font-semibold uppercase tracking-wider text-text-muted-strong hover:text-foreground hover:no-underline",
              isSidebar && "tracking-[0.11em]",
              isDrawer && "py-[0.45rem]"
            )}
          >
            <span className="flex items-center gap-1.5">
              Prix
              {model.selectedMinPriceCents !== null || model.selectedMaxPriceCents !== null ? (
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-brand" />
              ) : null}
            </span>
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              "[&_a]:no-underline [&_a]:hover:no-underline",
              isSidebar && "pb-[0.2rem] px-0.5"
            )}
          >
            <BoutiquePriceFilterForm
              searchQuery={model.searchQuery}
              selectedCategorySlugs={model.selectedCategorySlugs}
              selectedAvailabilityStatus={model.selectedAvailabilityStatus}
              selectedSort={model.selectedSort}
              selectedMinPriceCents={model.selectedMinPriceCents}
              selectedMaxPriceCents={model.selectedMaxPriceCents}
              className={cn("grid gap-2 pb-1", isSidebar && "gap-1.5 border-t-0 pb-[0.05rem]")}
              {...(onPriceMinChange ? { onMinChange: onPriceMinChange } : {})}
              {...(onPriceMaxChange ? { onMaxChange: onPriceMaxChange } : {})}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {showPreview ? (
        <div
          className={cn(
            "grid gap-[0.55rem] border-t border-surface-border-subtle/62 pt-[0.55rem]",
            isSidebar && "gap-1.5 border-t border-surface-border-subtle pt-2",
            isDrawer && "gap-1.5 border-t border-dashed border-surface-border-subtle/72 pt-[0.6rem]"
          )}
        >
          <section className="grid gap-[0.3rem]" aria-labelledby="boutique-preview-colors">
            <p
              id="boutique-preview-colors"
              className="m-0 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-text-muted-strong"
            >
              Couleurs
            </p>
            <ColorSwatches />
          </section>

          <section className="grid gap-[0.3rem]" aria-labelledby="boutique-preview-materials">
            <p
              id="boutique-preview-materials"
              className="m-0 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-text-muted-strong"
            >
              Matières
            </p>
            <ul className="grid gap-[0.2rem] m-0 p-0 list-none" aria-label="Matières indicatives">
              {FILTER_PREVIEW_MATERIALS.map((material) => (
                <li key={material} className="text-xs leading-tight text-text-muted-strong">
                  {material}
                </li>
              ))}
            </ul>
          </section>

          <p className="m-0 text-[0.6875rem] leading-[1.3] text-text-muted-soft">
            Nuancier Sylvertex indicatif — ces éléments n&apos;activent pas de filtre.
          </p>
        </div>
      ) : null}
    </div>
  );
}

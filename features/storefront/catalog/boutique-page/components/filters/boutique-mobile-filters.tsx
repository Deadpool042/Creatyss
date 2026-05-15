"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Settings2Icon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useBoutiqueFilterCount } from "@/features/storefront/catalog/boutique-page/hooks/use-boutique-filter-count";
import { normalizeAvailabilityParam } from "@/features/storefront/catalog/boutique-page/model/availability-filter.utils";
import { buildBoutiqueUrl } from "@/features/storefront/catalog/boutique-page/model/build-boutique-url";
import {
  centsToEurosInputValue,
  eurosInputToCents,
} from "@/features/storefront/catalog/boutique-page/model/price-input-utils";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";
import { cn } from "@/lib/utils";

type BoutiqueMobileFiltersProps = {
  model: BoutiquePageViewModel;
  label?: string;
  className?: string;
  triggerTestId?: string;
};

type BoutiqueFilterOptionProps = {
  inputId: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  type: "radio";
  indicator?: "dot" | "square";
  helperText?: string;
};


function BoutiqueFilterOption({
  inputId,
  name,
  value,
  label,
  checked,
  onChange,
  type,
  indicator = "dot",
  helperText,
}: BoutiqueFilterOptionProps) {
  return (
    <label
      htmlFor={inputId}
      className="group grid w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-0.5 rounded-lg p-1.5 text-sm text-text-muted-strong transition-colors hover:bg-surface-panel/20 hover:text-foreground active:bg-surface-panel/30 focus-within:bg-surface-panel/20 focus-within:outline-none data-[checked=true]:text-foreground"
      data-checked={checked ? "true" : "false"}
    >
      <input
        id={inputId}
        checked={checked}
        className="sr-only"
        name={name}
        onChange={onChange}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onChange();
          }
        }}
        type={type}
        value={value}
      />

      <span
        aria-hidden="true"
        className={cn(
          "grid size-4 shrink-0 mt-0.5 place-items-center border border-control-border/70 bg-transparent transition-colors group-focus-within:ring-[2px] group-focus-within:ring-focus-ring/50 group-data-[checked=true]:border-brand",
          indicator === "square" ? "rounded-sm" : "rounded-full"
        )}
      >
        {checked && indicator === "dot" ? <span className="size-1.5 rounded-full bg-brand" /> : null}

        {checked && indicator === "square" ? (
          <span className="text-brand text-[0.625rem] leading-none">✓</span>
        ) : null}
      </span>

      <span className="pr-1 text-sm leading-[1.35] group-data-[checked=true]:font-medium">{label}</span>

      {helperText ? <span className="col-start-2 m-0 text-[0.6875rem] leading-[1.35] text-text-muted-strong">{helperText}</span> : null}
    </label>
  );
}

export function BoutiqueMobileFilters({
  model,
  label = "Filtres",
  className,
  triggerTestId,
}: BoutiqueMobileFiltersProps) {
  const router = useRouter();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(model.selectedCategorySlug);
  const [selectedAvailability, setSelectedAvailability] = useState<
    "" | BoutiquePageViewModel["availabilityOptions"][number]["id"]
  >(
    normalizeAvailabilityParam(searchParams.get("availability")) ||
      (model.onlyAvailable ? "in-stock" : "")
  );
  const [selectedMinPriceEuros, setSelectedMinPriceEuros] = useState(
    centsToEurosInputValue(model.selectedMinPriceCents)
  );
  const [selectedMaxPriceEuros, setSelectedMaxPriceEuros] = useState(
    centsToEurosInputValue(model.selectedMaxPriceCents)
  );

  const { count: resultCount, countFetchFailed } = useBoutiqueFilterCount({
    searchQuery: model.searchQuery,
    selectedSort: model.selectedSort,
    selectedCategorySlug,
    selectedAvailability,
    selectedMinPriceEuros,
    selectedMaxPriceEuros,
    initialCount: model.totalProductCount,
  });

  const resultLabel = countFetchFailed
    ? "Voir les résultats"
    : `Voir ${resultCount} résultat${resultCount > 1 ? "s" : ""}`;

  const applyFilters = (params: {
    categorySlug: string;
    availability: "" | BoutiquePageViewModel["availabilityOptions"][number]["id"];
    minPriceEuros: string;
    maxPriceEuros: string;
  }) => {
    const nextUrl = buildBoutiqueUrl({
      q: model.searchQuery,
      category: params.categorySlug,
      availability: params.availability === "" ? null : params.availability,
      minPrice: eurosInputToCents(params.minPriceEuros),
      maxPrice: eurosInputToCents(params.maxPriceEuros),
      sort: model.selectedSort,
    });

    setIsOpen(false);
    router.push(nextUrl);
  };

  const submitCurrentFilters = () => {
    applyFilters({
      categorySlug: selectedCategorySlug,
      availability: selectedAvailability,
      minPriceEuros: selectedMinPriceEuros,
      maxPriceEuros: selectedMaxPriceEuros,
    });
  };

  return (
    <Drawer direction="bottom" modal open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button type="button" className={className} data-testid={triggerTestId}>
          <Settings2Icon aria-hidden="true" />
          {label}
        </button>
      </DrawerTrigger>

      <DrawerContent
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          closeButtonRef.current?.focus();
        }}
        className="max-h-[86dvh] rounded-t-2xl border-shell-border/70 bg-surface-floating/92 shadow-floating p-0 backdrop-blur-[20px]"
      >
        <DrawerHeader className="flex items-center justify-between border-b border-shell-border/70 px-4 py-3">
          <div className="grid gap-0.5">
            <DrawerTitle>Filtres</DrawerTitle>
            <DrawerDescription className="sr-only">
              Filtrez les produits par catégorie, disponibilité et tarif.
            </DrawerDescription>
          </div>

          <DrawerClose asChild>
            <Button
              ref={closeButtonRef}
              aria-label="Fermer les filtres"
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <form
          action="/boutique"
          method="get"
          onSubmit={(event) => {
            event.preventDefault();
            submitCurrentFilters();
          }}
          className="grid gap-3 overflow-y-auto px-4 pt-[0.65rem] pb-3"
        >
          <input type="hidden" name="q" value={model.searchQuery} />
          <input type="hidden" name="sort" value={model.selectedSort} />

          <section className="grid gap-1.5">
            <p className="m-0 text-xs font-semibold tracking-[0.08em] uppercase text-text-muted-strong">
              Catégories
            </p>

            <div className="grid max-h-[clamp(7.25rem,24dvh,11rem)] grid-cols-1 gap-0.5 overflow-y-auto pr-1">
              <BoutiqueFilterOption
                inputId="boutique-filter-category-all"
                name="category"
                value=""
                label="Tous les produits"
                checked={selectedCategorySlug === ""}
                onChange={() => setSelectedCategorySlug("")}
                type="radio"
                indicator="dot"
              />

              {model.filterCategories.map((category) => (
                <BoutiqueFilterOption
                  key={category.id}
                  inputId={`boutique-filter-category-${category.slug}`}
                  name="category"
                  value={category.slug}
                  label={category.name}
                  checked={selectedCategorySlug === category.slug}
                  onChange={() => setSelectedCategorySlug(category.slug)}
                  type="radio"
                  indicator="dot"
                />
              ))}
            </div>

            <p className="-mt-[0.05rem] text-[0.6875rem] leading-[1.3] text-text-muted-strong/76">
              Disponibilité et prix se règlent plus bas.
            </p>
          </section>

          <fieldset className="grid gap-1.5 border-t border-shell-border/60 pt-[0.65rem]">
            <legend className="m-0 text-xs font-semibold tracking-[0.08em] uppercase text-text-muted-strong">
              Disponibilité
            </legend>

            <p className="m-0 text-[0.6875rem] leading-[1.35] text-text-muted-strong">
              Choisissez un seul statut de disponibilité.
            </p>

            <div role="radiogroup" aria-label="Disponibilité" className="grid gap-0.5">
              <BoutiqueFilterOption
                inputId="boutique-filter-availability-all"
                name="availability-selection"
                value=""
                label="Toutes les disponibilités"
                checked={selectedAvailability === ""}
                onChange={() => setSelectedAvailability("")}
                type="radio"
                indicator="dot"
              />

              {model.availabilityOptions.map((option) => (
                <BoutiqueFilterOption
                  key={option.id}
                  inputId={`boutique-filter-availability-${option.id}`}
                  name="availability-selection"
                  value={option.id}
                  label={option.label}
                  checked={selectedAvailability === option.id}
                  onChange={() => setSelectedAvailability(option.id)}
                  type="radio"
                  indicator="dot"
                />
              ))}
            </div>
          </fieldset>

          <section className="grid gap-1.5 border-t border-shell-border/60 pt-[0.65rem]">
            <p className="m-0 text-xs font-semibold tracking-[0.08em] uppercase text-text-muted-strong">
              Prix
            </p>

            <div className="grid grid-cols-2 gap-2">
              <label
                className="grid gap-1 text-xs text-text-muted-strong"
                htmlFor="boutique-filter-min-price"
              >
                Prix minimum
                <input
                  id="boutique-filter-min-price"
                  type="text"
                  inputMode="numeric"
                  placeholder="Min"
                  value={selectedMinPriceEuros}
                  onChange={(event) => setSelectedMinPriceEuros(event.currentTarget.value)}
                  className="h-9 rounded-lg border border-control-border bg-control-surface px-[0.625rem] text-sm text-foreground outline-none transition-colors hover:border-control-border-strong hover:bg-control-surface-hover focus-visible:border-focus-ring focus-visible:ring-2 focus-visible:ring-focus-ring/50"
                />
              </label>

              <label
                className="grid gap-1 text-xs text-text-muted-strong"
                htmlFor="boutique-filter-max-price"
              >
                Prix maximum
                <input
                  id="boutique-filter-max-price"
                  type="text"
                  inputMode="numeric"
                  placeholder="Max"
                  value={selectedMaxPriceEuros}
                  onChange={(event) => setSelectedMaxPriceEuros(event.currentTarget.value)}
                  className="h-9 rounded-lg border border-control-border bg-control-surface px-[0.625rem] text-sm text-foreground outline-none transition-colors hover:border-control-border-strong hover:bg-control-surface-hover focus-visible:border-focus-ring focus-visible:ring-2 focus-visible:ring-focus-ring/50"
                />
              </label>
            </div>
          </section>

          {selectedAvailability !== "" ? (
            <input type="hidden" name="availability" value={selectedAvailability} />
          ) : null}

          {eurosInputToCents(selectedMinPriceEuros) !== null ? (
            <input
              type="hidden"
              name="minPrice"
              value={String(eurosInputToCents(selectedMinPriceEuros))}
            />
          ) : null}

          {eurosInputToCents(selectedMaxPriceEuros) !== null ? (
            <input
              type="hidden"
              name="maxPrice"
              value={String(eurosInputToCents(selectedMaxPriceEuros))}
            />
          ) : null}

          <div className="sticky bottom-0 z-10 grid gap-1.5 border-t border-shell-border/70 bg-surface-floating/96 pt-2 pb-3 backdrop-blur-[12px]">
            <Button type="submit" className="h-10" aria-live="polite">
              {resultLabel}
            </Button>

            <button
              type="button"
              onClick={() => {
                const nextCategory = "";
                const nextAvailability = "";
                const nextMinPrice = "";
                const nextMaxPrice = "";

                setSelectedCategorySlug(nextCategory);
                setSelectedAvailability(nextAvailability);
                setSelectedMinPriceEuros(nextMinPrice);
                setSelectedMaxPriceEuros(nextMaxPrice);

                requestAnimationFrame(() => {
                  applyFilters({
                    categorySlug: nextCategory,
                    availability: nextAvailability,
                    minPriceEuros: nextMinPrice,
                    maxPriceEuros: nextMaxPrice,
                  });
                });
              }}
              className="inline-flex h-8 items-center justify-center text-xs text-text-muted-strong underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

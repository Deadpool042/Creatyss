"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBoutiqueFilterCount } from "@/features/storefront/catalog/boutique-page/hooks/use-boutique-filter-count";
import {
  centsToEurosInputValue,
  eurosInputToCents,
} from "@/features/storefront/catalog/boutique-page/model/price-input-utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueMobileFiltersProps = {
  model: BoutiquePageViewModel;
  label?: string;
  className?: string;
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

function normalizeAvailabilityParam(
  value: string | null
): "" | BoutiquePageViewModel["availabilityOptions"][number]["id"] {
  if (value === null) {
    return "";
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "available" || normalized === "in-stock") {
    return "in-stock";
  }

  if (normalized === "made-to-order") {
    return "made-to-order";
  }

  if (normalized === "unavailable") {
    return "unavailable";
  }

  return "";
}

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
      className={[
        "group grid w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-0.5 rounded-lg px-1.5 py-1.5 text-sm transition-colors",
        "hover:bg-surface-panel/20 active:bg-surface-panel/30",
        "focus-within:bg-surface-panel/20 focus-within:outline-none",
        checked ? "text-foreground" : "text-text-muted-strong hover:text-foreground",
      ].join(" ")}
    >
      <input
        id={inputId}
        checked={checked}
        className="sr-only"
        name={name}
        onChange={onChange}
        type={type}
        value={value}
      />

      <span
        aria-hidden="true"
        className={[
          "mt-0.5 grid shrink-0 place-items-center border transition-colors",
          "group-focus-within:ring-2 group-focus-within:ring-focus-ring/50",
          indicator === "square" ? "size-4 rounded-[5px]" : "size-4 rounded-full",
          checked
            ? "border-brand"
            : "border-control-border/70 bg-transparent group-hover:border-control-border-strong",
        ].join(" ")}
      >
        {checked && indicator === "dot" ? (
          <span className="size-1.5 rounded-full bg-brand" />
        ) : null}

        {checked && indicator === "square" ? (
          <span className="text-[0.62rem] leading-none text-brand">✓</span>
        ) : null}
      </span>

      <span
        className={[
          "line-clamp-2 whitespace-normal wrap-break-word pr-1 text-sm",
          checked ? "font-medium text-foreground" : "font-normal text-text-muted-strong",
        ].join(" ")}
      >
        {label}
      </span>

      {helperText ? (
        <span className="col-start-2 m-0 text-[11px] leading-snug text-text-muted-strong">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}

export function BoutiqueMobileFilters({
  model,
  label = "Filtres",
  className,
}: BoutiqueMobileFiltersProps) {
  const searchParams = useSearchParams();
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

  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <button type="button" className={className}>
          {label}
        </button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[86dvh] rounded-t-[1.75rem] border-shell-border/70 bg-surface-floating/92 px-0 pb-0 pt-0 shadow-floating backdrop-blur-xl">
        <DrawerHeader className="flex-row items-center justify-between border-b border-shell-border/70 px-4 py-3">
          <div className="grid gap-0.5">
            <DrawerTitle>Filtres</DrawerTitle>
            <DrawerDescription className="sr-only">
              Filtrez les produits par catégorie et disponibilité.
            </DrawerDescription>
          </div>

          <DrawerClose asChild>
            <Button aria-label="Fermer les filtres" size="icon-sm" type="button" variant="ghost">
              <XIcon />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <form action="/boutique" method="get" className="grid gap-3.5 overflow-y-auto px-4 py-3">
          <input type="hidden" name="q" value={model.searchQuery} />
          <input type="hidden" name="sort" value={model.selectedSort} />

          <section className="grid gap-2">
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-text-muted-strong">
              Catégories
            </p>

            <div className="grid max-h-[30dvh] grid-cols-1 gap-0.5 overflow-y-auto pr-1">
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
          </section>

          <fieldset className="grid gap-2 border-t border-shell-border/60 pt-3">
            <legend className="m-0 text-xs font-semibold uppercase tracking-wide text-text-muted-strong">
              Disponibilité
            </legend>

            <p className="m-0 text-[11px] text-text-muted-strong">
              Choisissez un seul statut de disponibilité
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

          <section className="grid gap-2 border-t border-shell-border/60 pt-3">
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-text-muted-strong">
              Tarif
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
                  className="h-9 rounded-lg border border-control-border bg-control-surface px-2.5 text-sm text-foreground shadow-control outline-none transition-all hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50"
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
                  className="h-9 rounded-lg border border-control-border bg-control-surface px-2.5 text-sm text-foreground shadow-control outline-none transition-all hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50"
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

          <div className="sticky bottom-0 z-10 grid gap-1.5 border-t border-shell-border/70 bg-surface-floating/96 pb-3 pt-2 backdrop-blur-md">
            <Button type="submit" className="h-10" aria-live="polite">
              {resultLabel}
            </Button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategorySlug("");
                setSelectedAvailability("");
                setSelectedMinPriceEuros("");
                setSelectedMaxPriceEuros("");
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

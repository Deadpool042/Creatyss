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
import { buildBoutiqueUrl } from "@/features/storefront/catalog/boutique-page/model/build-boutique-url";
import {
  centsToEurosInputValue,
  eurosInputToCents,
} from "@/features/storefront/catalog/boutique-page/model/price-input-utils";
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
      className="boutique-filter-option"
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
        className={[
          "boutique-filter-option-indicator",
          indicator === "square"
            ? "boutique-filter-option-indicator-square"
            : "boutique-filter-option-indicator-dot",
        ].join(" ")}
      >
        {checked && indicator === "dot" ? <span className="boutique-filter-option-dot" /> : null}

        {checked && indicator === "square" ? (
          <span className="boutique-filter-option-check">✓</span>
        ) : null}
      </span>

      <span className="boutique-filter-option-label">{label}</span>

      {helperText ? <span className="boutique-filter-option-helper">{helperText}</span> : null}
    </label>
  );
}

export function BoutiqueMobileFilters({
  model,
  label = "Filtres",
  className,
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
        <button type="button" className={className}>
          <Settings2Icon aria-hidden="true" />
          {label}
        </button>
      </DrawerTrigger>

      <DrawerContent
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          closeButtonRef.current?.focus();
        }}
        className="boutique-mobile-filters-drawer"
      >
        <DrawerHeader className="boutique-mobile-filters-header">
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
          className="boutique-mobile-filters-form"
        >
          <input type="hidden" name="q" value={model.searchQuery} />
          <input type="hidden" name="sort" value={model.selectedSort} />

          <section className="boutique-mobile-filters-section">
            <p className="boutique-mobile-filters-section-title">Catégories</p>

            <div className="boutique-mobile-filters-scroll-list">
              <BoutiqueFilterOption
                inputId="boutique-filter-category-all"
                name="category"
                value=""
                label="Tous les produits"
                checked={selectedCategorySlug === ""}
                onChange={() => {
                  const nextCategory = "";
                  setSelectedCategorySlug(nextCategory);

                  requestAnimationFrame(() => {
                    applyFilters({
                      categorySlug: nextCategory,
                      availability: selectedAvailability,
                      minPriceEuros: selectedMinPriceEuros,
                      maxPriceEuros: selectedMaxPriceEuros,
                    });
                  });
                }}
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
                  onChange={() => {
                    const nextCategory = category.slug;
                    setSelectedCategorySlug(nextCategory);

                    requestAnimationFrame(() => {
                      applyFilters({
                        categorySlug: nextCategory,
                        availability: selectedAvailability,
                        minPriceEuros: selectedMinPriceEuros,
                        maxPriceEuros: selectedMaxPriceEuros,
                      });
                    });
                  }}
                  type="radio"
                  indicator="dot"
                />
              ))}
            </div>
          </section>

          <fieldset className="boutique-mobile-filters-section boutique-mobile-filters-section-bordered">
            <legend className="boutique-mobile-filters-section-title">Disponibilité</legend>

            <p className="boutique-mobile-filters-helper">
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

          <section className="boutique-mobile-filters-section boutique-mobile-filters-section-bordered">
            <p className="boutique-mobile-filters-section-title">Tarif</p>

            <div className="boutique-mobile-filters-price-grid">
              <label
                className="boutique-mobile-filters-price-label"
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
                  className="boutique-mobile-filters-price-input"
                />
              </label>

              <label
                className="boutique-mobile-filters-price-label"
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
                  className="boutique-mobile-filters-price-input"
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

          <div className="boutique-mobile-filters-footer">
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
              className="boutique-mobile-filters-reset"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

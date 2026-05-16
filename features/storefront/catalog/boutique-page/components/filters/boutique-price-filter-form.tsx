"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { buildBoutiqueUrl } from "@/features/storefront/catalog/boutique-page/model/build-boutique-url";
import {
  centsToEurosInputValue,
  eurosInputToCents,
} from "@/features/storefront/catalog/boutique-page/model/price-input-utils";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";
import { cn } from "@/lib/utils";

type BoutiquePriceFilterFormProps = {
  searchQuery: BoutiquePageViewModel["searchQuery"];
  selectedCategorySlugs: BoutiquePageViewModel["selectedCategorySlugs"];
  selectedAvailabilityStatus: BoutiquePageViewModel["selectedAvailabilityStatus"];
  selectedSort: BoutiquePageViewModel["selectedSort"];
  selectedMinPriceCents: BoutiquePageViewModel["selectedMinPriceCents"];
  selectedMaxPriceCents: BoutiquePageViewModel["selectedMaxPriceCents"];
  className?: string;
  onMinChange?: (value: string) => void;
  onMaxChange?: (value: string) => void;
};

export function BoutiquePriceFilterForm({
  searchQuery,
  selectedCategorySlugs,
  selectedAvailabilityStatus,
  selectedSort,
  selectedMinPriceCents,
  selectedMaxPriceCents,
  className = "grid gap-2 border-t border-shell-border/70 pt-4",
  onMinChange,
  onMaxChange,
}: BoutiquePriceFilterFormProps) {
  const [minPriceEuros, setMinPriceEuros] = useState(centsToEurosInputValue(selectedMinPriceCents));
  const [maxPriceEuros, setMaxPriceEuros] = useState(centsToEurosInputValue(selectedMaxPriceCents));

  const minPriceCents = useMemo(() => eurosInputToCents(minPriceEuros), [minPriceEuros]);
  const maxPriceCents = useMemo(() => eurosInputToCents(maxPriceEuros), [maxPriceEuros]);

  const isMinInvalid = minPriceEuros.trim().length > 0 && minPriceCents === null;
  const isMaxInvalid = maxPriceEuros.trim().length > 0 && maxPriceCents === null;
  const isRangeInvalid =
    minPriceCents !== null && maxPriceCents !== null && minPriceCents > maxPriceCents;

  const clearPriceHref = buildBoutiqueUrl({
    q: searchQuery,
    categories: selectedCategorySlugs,
    availability: selectedAvailabilityStatus,
    sort: selectedSort,
  });

  const inputBase =
    "h-9 w-full min-w-0 rounded-lg border bg-control-surface px-2.5 text-sm text-foreground shadow-control outline-none transition-all hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:ring-3 focus-visible:ring-focus-ring/50";
  const inputDefault = "border-control-border hover:border-control-border-strong focus-visible:border-focus-ring";
  const inputError = "border-feedback-error focus-visible:border-feedback-error";

  return (
    <section className={className}>
      <form action="/boutique" method="get" className="grid min-w-0 w-full max-w-full gap-2">
        <input type="hidden" name="q" value={searchQuery} />
        {selectedCategorySlugs.map((slug) => (
          <input key={slug} type="hidden" name="category" value={slug} />
        ))}
        {selectedAvailabilityStatus ? (
          <input type="hidden" name="availability" value={selectedAvailabilityStatus} />
        ) : null}
        {selectedSort !== "featured" ? (
          <input type="hidden" name="sort" value={selectedSort} />
        ) : null}

        <p className="m-0 text-xs text-text-muted-strong">Montants en euros (entiers)</p>

        <div className="grid min-w-0 grid-cols-1 gap-2 min-[360px]:grid-cols-2">
          <label className="grid min-w-0 gap-1 text-xs text-text-muted-strong" htmlFor="boutique-price-min">
            Prix minimum
            <input
              id="boutique-price-min"
              type="text"
              inputMode="numeric"
              placeholder="Ex : 50"
              value={minPriceEuros}
              aria-invalid={isMinInvalid ? "true" : undefined}
              aria-describedby={isMinInvalid || isRangeInvalid ? "boutique-price-error" : undefined}
              onChange={(event) => {
                const v = event.currentTarget.value;
                setMinPriceEuros(v);
                onMinChange?.(v);
              }}
              className={cn(inputBase, isMinInvalid ? inputError : inputDefault)}
            />
          </label>

          <label className="grid min-w-0 gap-1 text-xs text-text-muted-strong" htmlFor="boutique-price-max">
            Prix maximum
            <input
              id="boutique-price-max"
              type="text"
              inputMode="numeric"
              placeholder="Ex : 200"
              value={maxPriceEuros}
              aria-invalid={isMaxInvalid ? "true" : undefined}
              aria-describedby={isMaxInvalid || isRangeInvalid ? "boutique-price-error" : undefined}
              onChange={(event) => {
                const v = event.currentTarget.value;
                setMaxPriceEuros(v);
                onMaxChange?.(v);
              }}
              className={cn(inputBase, isMaxInvalid ? inputError : inputDefault)}
            />
          </label>
        </div>

        {(isMinInvalid || isMaxInvalid) ? (
          <p id="boutique-price-error" role="alert" className="m-0 text-[0.6875rem] leading-snug text-feedback-error">
            Valeur invalide — saisissez un nombre entier.
          </p>
        ) : isRangeInvalid ? (
          <p id="boutique-price-error" role="alert" className="m-0 text-[0.6875rem] leading-snug text-feedback-error">
            Le minimum doit être inférieur au maximum.
          </p>
        ) : null}

        {minPriceCents !== null && !isRangeInvalid ? (
          <input type="hidden" name="minPrice" value={String(minPriceCents)} />
        ) : null}
        {maxPriceCents !== null && !isRangeInvalid ? (
          <input type="hidden" name="maxPrice" value={String(maxPriceCents)} />
        ) : null}

        <div className="grid min-w-0 grid-cols-1 gap-2">
          <Button
            type="submit"
            size="sm"
            className="h-8 w-full min-w-0 px-3 text-xs"
            disabled={isMinInvalid || isMaxInvalid || isRangeInvalid}
          >
            Appliquer
          </Button>
          <Link
            href={clearPriceHref}
            className="inline-flex h-8 w-full min-w-0 items-center justify-center rounded-md border border-control-border px-2 text-xs text-text-muted-strong transition-colors hover:border-control-border-strong hover:text-foreground"
          >
            Effacer le prix
          </Link>
        </div>
      </form>
    </section>
  );
}

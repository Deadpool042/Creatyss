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

type BoutiquePriceFilterFormProps = {
  searchQuery: BoutiquePageViewModel["searchQuery"];
  selectedCategorySlug: BoutiquePageViewModel["selectedCategorySlug"];
  selectedAvailabilityStatus: BoutiquePageViewModel["selectedAvailabilityStatus"];
  selectedSort: BoutiquePageViewModel["selectedSort"];
  selectedMinPriceCents: BoutiquePageViewModel["selectedMinPriceCents"];
  selectedMaxPriceCents: BoutiquePageViewModel["selectedMaxPriceCents"];
  className?: string;
};

export function BoutiquePriceFilterForm({
  searchQuery,
  selectedCategorySlug,
  selectedAvailabilityStatus,
  selectedSort,
  selectedMinPriceCents,
  selectedMaxPriceCents,
  className = "grid gap-2 border-t border-shell-border/70 pt-4",
}: BoutiquePriceFilterFormProps) {
  const [minPriceEuros, setMinPriceEuros] = useState(centsToEurosInputValue(selectedMinPriceCents));
  const [maxPriceEuros, setMaxPriceEuros] = useState(centsToEurosInputValue(selectedMaxPriceCents));

  const minPriceCents = useMemo(() => eurosInputToCents(minPriceEuros), [minPriceEuros]);
  const maxPriceCents = useMemo(() => eurosInputToCents(maxPriceEuros), [maxPriceEuros]);

  const clearPriceHref = buildBoutiqueUrl({
    q: searchQuery,
    category: selectedCategorySlug,
    availability: selectedAvailabilityStatus,
    sort: selectedSort,
  });

  return (
    <section className={className}>
      <p className="m-0 text-xs font-semibold uppercase tracking-widest text-text-muted-strong">
        Tarif
      </p>

      <form action="/boutique" method="get" className="grid min-w-0 w-full max-w-full gap-2.5">
        <input type="hidden" name="q" value={searchQuery} />
        {selectedCategorySlug !== "" ? (
          <input type="hidden" name="category" value={selectedCategorySlug} />
        ) : null}
        {selectedAvailabilityStatus ? (
          <input type="hidden" name="availability" value={selectedAvailabilityStatus} />
        ) : null}

        {selectedSort !== "featured" ? (
          <input type="hidden" name="sort" value={selectedSort} />
        ) : null}

        <p className="m-0 text-xs text-text-muted-strong">Montants entiers en euros</p>

        <div className="grid min-w-0 grid-cols-1 gap-2 min-[360px]:grid-cols-2">
          <label
            className="grid min-w-0 gap-1 text-xs text-text-muted-strong"
            htmlFor="boutique-price-min"
          >
            Prix minimum
            <input
              id="boutique-price-min"
              type="text"
              inputMode="numeric"
              placeholder="Min"
              value={minPriceEuros}
              onChange={(event) => setMinPriceEuros(event.currentTarget.value)}
              className="h-9 w-full min-w-0 rounded-lg border border-control-border bg-control-surface px-2.5 text-sm text-foreground shadow-control outline-none transition-all hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50"
            />
          </label>

          <label
            className="grid min-w-0 gap-1 text-xs text-text-muted-strong"
            htmlFor="boutique-price-max"
          >
            Prix maximum
            <input
              id="boutique-price-max"
              type="text"
              inputMode="numeric"
              placeholder="Max"
              value={maxPriceEuros}
              onChange={(event) => setMaxPriceEuros(event.currentTarget.value)}
              className="h-9 w-full min-w-0 rounded-lg border border-control-border bg-control-surface px-2.5 text-sm text-foreground shadow-control outline-none transition-all hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50"
            />
          </label>
        </div>

        {minPriceCents !== null ? (
          <input type="hidden" name="minPrice" value={String(minPriceCents)} />
        ) : null}
        {maxPriceCents !== null ? (
          <input type="hidden" name="maxPrice" value={String(maxPriceCents)} />
        ) : null}

        <div className="grid min-w-0 grid-cols-1 gap-2">
          <Button type="submit" size="sm" className="h-8 w-full min-w-0 px-3 text-xs">
            Appliquer
          </Button>
          <Link
            href={clearPriceHref}
            className="inline-flex h-8 w-full min-w-0 items-center justify-center rounded-md border border-control-border px-2 text-xs text-text-muted-strong transition-colors hover:border-control-border-strong hover:text-foreground"
          >
            Effacer le tarif
          </Link>
        </div>
      </form>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueSortFormProps = {
  searchQuery: BoutiquePageViewModel["searchQuery"];
  selectedCategorySlug: BoutiquePageViewModel["selectedCategorySlug"];
  selectedAvailabilityStatus: BoutiquePageViewModel["selectedAvailabilityStatus"];
  selectedMinPriceCents: BoutiquePageViewModel["selectedMinPriceCents"];
  selectedMaxPriceCents: BoutiquePageViewModel["selectedMaxPriceCents"];
  selectedSort: BoutiquePageViewModel["selectedSort"];
};

export function BoutiqueSortForm({
  searchQuery,
  selectedCategorySlug,
  selectedAvailabilityStatus,
  selectedMinPriceCents,
  selectedMaxPriceCents,
  selectedSort,
}: BoutiqueSortFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action="/boutique" method="get" className="flex min-w-0 items-center gap-2">
      <input type="hidden" name="q" value={searchQuery} />
      <input type="hidden" name="category" value={selectedCategorySlug} />

      {selectedAvailabilityStatus ? (
        <input type="hidden" name="availability" value={selectedAvailabilityStatus} />
      ) : null}

      {selectedMinPriceCents !== null ? (
        <input type="hidden" name="minPrice" value={String(selectedMinPriceCents)} />
      ) : null}

      {selectedMaxPriceCents !== null ? (
        <input type="hidden" name="maxPrice" value={String(selectedMaxPriceCents)} />
      ) : null}

      <span className="hidden text-xs text-text-muted-strong xl:inline">Trier</span>

      <select
        className="h-8 min-w-0 max-w-40 rounded-md border border-control-border bg-control-surface px-2 text-xs text-text-muted-strong transition-colors hover:border-brand hover:text-brand sm:max-w-44 md:max-w-48"
        defaultValue={selectedSort}
        name="sort"
        onChange={() => formRef.current?.requestSubmit()}
      >
        <option value="featured">Mise en avant</option>
        <option value="newest">Nouveautés</option>
        <option value="name">Nom</option>
        <option value="price-asc">Prix croissant</option>
        <option value="price-desc">Prix décroissant</option>
      </select>

      <Button
        size="sm"
        type="submit"
        aria-label="Appliquer le tri"
        className="hidden h-8 rounded-md px-2.5 laptop:inline-flex"
      >
        <span className="desktop:hidden">OK</span>
        <span className="hidden desktop:inline">Appliquer</span>
      </Button>
    </form>
  );
}

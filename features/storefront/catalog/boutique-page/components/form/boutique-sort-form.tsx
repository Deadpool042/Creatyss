"use client";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueSortFormProps = {
  searchQuery: string;
  selectedCategorySlugs: string[];
  selectedAvailabilityStatus: BoutiquePageViewModel["selectedAvailabilityStatus"];
  selectedMinPriceCents: number | null;
  selectedMaxPriceCents: number | null;
  selectedSort: BoutiquePageViewModel["selectedSort"];
};

const SORT_OPTIONS: ReadonlyArray<{
  value: BoutiquePageViewModel["selectedSort"];
  label: string;
}> = [
  { value: "featured", label: "Mise en avant" },
  { value: "newest", label: "Nouveautés" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
];

export function BoutiqueSortForm({
  searchQuery,
  selectedCategorySlugs,
  selectedAvailabilityStatus,
  selectedMinPriceCents,
  selectedMaxPriceCents,
  selectedSort,
}: BoutiqueSortFormProps) {
  return (
    <form action="/boutique" method="get" className="min-w-0">
      <input type="hidden" name="q" value={searchQuery} />
      {selectedCategorySlugs.map((slug) => (
        <input key={slug} type="hidden" name="category" value={slug} />
      ))}

      {selectedAvailabilityStatus ? (
        <input type="hidden" name="availability" value={selectedAvailabilityStatus} />
      ) : null}

      {selectedMinPriceCents !== null ? (
        <input type="hidden" name="minPrice" value={String(selectedMinPriceCents)} />
      ) : null}

      {selectedMaxPriceCents !== null ? (
        <input type="hidden" name="maxPrice" value={String(selectedMaxPriceCents)} />
      ) : null}

      <label className="sr-only" htmlFor="boutique-sort">
        Trier les produits
      </label>

      <div className="relative inline-flex min-w-0 items-center">
        <select
          id="boutique-sort"
          name="sort"
          className="h-8 max-w-37 appearance-none rounded-md border border-control-border bg-control-surface py-0 pl-3 pr-8 text-xs font-medium leading-none text-foreground outline-none transition-colors hover:border-control-border-strong hover:bg-control-surface-hover focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-focus-ring/60 tablet:h-9 tablet:max-w-48 tablet:text-[0.8125rem]"
          defaultValue={selectedSort}
          aria-label="Trier les produits"
          onChange={(event) => {
            event.currentTarget.form?.requestSubmit();
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 size-1.5 -translate-y-1/2 rotate-45 border-b border-r border-text-muted-strong"
        />
      </div>
    </form>
  );
}

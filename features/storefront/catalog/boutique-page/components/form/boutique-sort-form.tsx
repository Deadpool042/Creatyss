"use client";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueSortFormProps = {
  searchQuery: string;
  selectedCategorySlug: string;
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
  selectedCategorySlug,
  selectedAvailabilityStatus,
  selectedMinPriceCents,
  selectedMaxPriceCents,
  selectedSort,
}: BoutiqueSortFormProps) {
  return (
    <form action="/boutique" method="get" className="boutique-sort-form">
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

      <label className="sr-only" htmlFor="boutique-sort">
        Trier les produits
      </label>

      <div className="boutique-sort-control">
        <select
          id="boutique-sort"
          name="sort"
          className="boutique-sort-select"
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
      </div>
    </form>
  );
}

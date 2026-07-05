import { SearchIcon } from "lucide-react";

import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueSearchFormProps = {
  searchQuery: string;
  selectedCategorySlugs: string[];
  selectedAvailabilityStatus: BoutiquePageViewModel["selectedAvailabilityStatus"];
  selectedMinPriceCents: number | null;
  selectedMaxPriceCents: number | null;
  selectedSort: BoutiquePageViewModel["selectedSort"];
};

export function BoutiqueSearchForm({
  searchQuery,
  selectedCategorySlugs,
  selectedAvailabilityStatus,
  selectedMinPriceCents,
  selectedMaxPriceCents,
  selectedSort,
}: BoutiqueSearchFormProps) {
  return (
    <form action="/boutique" method="get" className="min-w-0" role="search">
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

      <input type="hidden" name="sort" value={selectedSort} />

      <label className="sr-only" htmlFor="boutique-search">
        Rechercher une création
      </label>

      <div className="relative inline-flex min-w-0 items-center">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute left-2.5 size-4 text-text-muted-strong"
        />
        <input
          id="boutique-search"
          type="search"
          name="q"
          defaultValue={searchQuery}
          placeholder="Rechercher…"
          data-testid="boutique-search-input"
          className="h-8 w-36 min-w-0 rounded-md border border-control-border bg-control-surface py-0 pl-8 pr-3 text-xs font-medium leading-none text-foreground outline-none transition-colors placeholder:text-text-muted-strong hover:border-control-border-strong hover:bg-control-surface-hover focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-focus-ring/60 tablet:h-9 tablet:w-52 tablet:text-[0.8125rem]"
        />
      </div>
    </form>
  );
}

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
  return (
    <form
      action="/boutique"
      method="get"
      className="flex items-center gap-1.5 sm:max-[899px]:landscape:gap-1 min-[900px]:max-[1199px]:gap-1.5 desktop:gap-2"
    >
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

      <span className="text-xs text-text-muted-strong max-[1199px]:hidden">Trier</span>

      <select
        className="h-8 w-33 rounded-lg border border-control-border bg-control-surface px-2.5 py-1 text-xs text-foreground shadow-control outline-none transition-all hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50 sm:max-[899px]:landscape:h-7 sm:max-[899px]:landscape:w-31 sm:max-[899px]:landscape:px-2 sm:max-[899px]:landscape:text-[11px] md:w-36.5 min-[900px]:max-[1199px]:h-8 min-[900px]:max-[1199px]:w-35 min-[900px]:max-[1199px]:px-2.5 min-[900px]:max-[1199px]:text-xs desktop:h-9 desktop:w-auto desktop:px-3 desktop:text-sm"
        defaultValue={selectedSort}
        name="sort"
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
        className="h-8 px-2.5 text-xs sm:max-[899px]:landscape:h-7 sm:max-[899px]:landscape:px-2 sm:max-[899px]:landscape:text-[11px] min-[900px]:max-[1199px]:h-8 min-[900px]:max-[1199px]:px-2.5 desktop:h-9 desktop:px-3"
      >
        <span className="desktop:hidden">OK</span>
        <span className="hidden desktop:inline">Appliquer</span>
      </Button>
    </form>
  );
}

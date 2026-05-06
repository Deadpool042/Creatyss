import { Badge } from "@/components/ui/badge";
import { CustomLink } from "@/components/shared";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueActiveFiltersProps = {
  labels: BoutiquePageViewModel["activeFilterLabels"];
  resetHref: string;
};

function getClearActionLabel(item: BoutiquePageViewModel["activeFilterLabels"][number]): string {
  if (item.key === "q") {
    return "Effacer la recherche";
  }

  if (item.key === "category") {
    return "Effacer la catégorie";
  }

  if (item.key === "availability") {
    return "Effacer la disponibilité";
  }

  if (item.key === "minPrice" || item.key === "maxPrice" || item.key === "priceRange") {
    return "Effacer le filtre de prix";
  }

  if (item.key === "sort") {
    return "Revenir au tri par défaut";
  }

  return "Effacer ce filtre";
}

export function BoutiqueActiveFilters({ labels, resetHref }: BoutiqueActiveFiltersProps) {
  if (labels.length === 0) {
    return null;
  }

  return (
    <div className="boutique-active-filters">
      <div className="boutique-active-filters-list">
        <span className="boutique-active-filters-label">Filtres :</span>

        {labels.map((item, index) => (
          <div key={`${item.key}-${index}`} className="boutique-active-filter-item">
            <Badge variant="secondary" className="boutique-active-filter-badge truncate">
              {item.label}
            </Badge>

            <CustomLink
              href={item.clearHref}
              variant="muted"
              aria-label={getClearActionLabel(item)}
              title={getClearActionLabel(item)}
              className="boutique-active-filter-link"
            >
              <span className="boutique-active-filter-clear-mobile">Effacer</span>
              <span className="boutique-active-filter-clear-desktop">
                {getClearActionLabel(item)}
              </span>
            </CustomLink>
          </div>
        ))}

        <CustomLink
          className="boutique-active-filters-reset-desktop"
          href={resetHref}
          variant="muted"
          aria-label="Réinitialiser tous les filtres"
        >
          Réinitialiser
        </CustomLink>
      </div>

      <CustomLink
        className="boutique-active-filters-reset-mobile"
        href={resetHref}
        variant="muted"
        aria-label="Réinitialiser tous les filtres"
      >
        Réinitialiser
      </CustomLink>
    </div>
  );
}

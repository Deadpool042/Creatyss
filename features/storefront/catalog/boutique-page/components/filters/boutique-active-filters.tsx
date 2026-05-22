import { XIcon } from "lucide-react";

import { CustomLink } from "@/components/shared";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueActiveFiltersProps = {
  labels: BoutiquePageViewModel["activeFilterLabels"];
  resetHref: string;
};

function getClearActionLabel(item: BoutiquePageViewModel["activeFilterLabels"][number]): string {
  if (item.key === "q") return `Retirer la recherche : ${item.label}`;
  if (item.key === "category") return `Retirer la catégorie : ${item.label}`;
  if (item.key === "availability") return `Retirer le filtre disponibilité : ${item.label}`;
  if (item.key === "priceRange") return `Retirer le filtre prix`;
  if (item.key === "sort") return `Revenir au tri par défaut`;
  return `Retirer ce filtre`;
}

export function BoutiqueActiveFilters({ labels, resetHref }: BoutiqueActiveFiltersProps) {
  if (labels.length === 0) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Filtres actifs"
      className="flex min-w-0 flex-wrap items-center gap-1.5"
    >
      <span className="text-[0.75rem] font-medium text-text-muted-strong">Filtres :</span>

      {labels.map((item, index) => (
        <CustomLink
          key={`${item.key}-${index}`}
          href={item.clearHref}
          aria-label={getClearActionLabel(item)}
          className="group inline-flex max-w-56 items-center gap-1.5 rounded-full border border-control-border bg-surface-panel/80 py-[0.2rem] pl-2.5 pr-2 text-[0.8125rem] font-medium text-text-muted-strong no-underline shadow-control transition-all hover:border-control-border-strong hover:bg-surface-panel hover:text-foreground hover:shadow-control-hover active:scale-[0.97] active:shadow-control-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/70"
        >
          <span className="min-w-0 truncate">{item.label}</span>
          <XIcon
            aria-hidden="true"
            className="size-3 shrink-0 text-text-muted-soft transition-colors group-hover:text-foreground"
          />
        </CustomLink>
      ))}

      {labels.length > 1 ? (
        <CustomLink
          href={resetHref}
          aria-label="Réinitialiser tous les filtres"
          className="shrink-0 text-[0.75rem] text-text-muted-strong no-underline underline-offset-2 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/70"
        >
          Tout effacer
        </CustomLink>
      ) : null}
    </div>
  );
}

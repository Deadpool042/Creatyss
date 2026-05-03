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
    <div className="grid gap-1.5 px-0.5 pb-0.5 text-xs text-text-muted-strong min-[700px]:flex min-[700px]:items-center min-[700px]:gap-2">
      <div className="flex items-center gap-1.5 overflow-x-auto min-[700px]:flex-wrap min-[700px]:gap-2 min-[700px]:overflow-visible">
        <span className="shrink-0 text-text-muted-soft">Filtres :</span>

        {labels.map((item, index) => (
          <div key={`${item.key}-${index}`} className="inline-flex shrink-0 items-center gap-1">
            <Badge variant="secondary" className="max-w-52 truncate min-[700px]:max-w-55">
              {item.label}
            </Badge>
            <CustomLink
              href={item.clearHref}
              variant="muted"
              aria-label={getClearActionLabel(item)}
              title={getClearActionLabel(item)}
              className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              <span className="min-[560px]:hidden">Effacer</span>
              <span className="hidden min-[560px]:inline">{getClearActionLabel(item)}</span>
            </CustomLink>
          </div>
        ))}

        <CustomLink
          className="ml-0.5 hidden shrink-0 underline-offset-4 transition-colors hover:text-foreground hover:underline min-[700px]:inline"
          href={resetHref}
          variant="muted"
          aria-label="Reinitialiser tous les filtres"
        >
          Réinitialiser
        </CustomLink>
      </div>

      <CustomLink
        className="inline-flex w-fit items-center justify-center rounded-md border border-control-border/70 px-2 py-1 text-[11px] text-text-muted-strong underline-offset-4 transition-colors hover:border-control-border-strong hover:text-foreground hover:underline min-[700px]:hidden"
        href={resetHref}
        variant="muted"
        aria-label="Reinitialiser tous les filtres"
      >
        Réinitialiser
      </CustomLink>
    </div>
  );
}

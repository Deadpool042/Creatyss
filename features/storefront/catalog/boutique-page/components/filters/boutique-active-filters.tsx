import { Badge } from "@/components/ui/badge";
import { CustomLink } from "@/components/shared";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueActiveFiltersProps = {
  labels: BoutiquePageViewModel["activeFilterLabels"];
  resetHref: string;
};

function getClearActionLabel(label: string): string {
  if (label.startsWith("Recherche")) {
    return "Effacer la recherche";
  }

  if (label.startsWith("Catégorie")) {
    return "Effacer la catégorie";
  }

  if (label.startsWith("Prix")) {
    return "Effacer le filtre de prix";
  }

  if (label.startsWith("Tri")) {
    return "Revenir au tri par défaut";
  }

  if (label === "En stock" || label === "Sur commande" || label === "Rupture") {
    return "Effacer la disponibilité";
  }

  return "Effacer ce filtre";
}

export function BoutiqueActiveFilters({ labels, resetHref }: BoutiqueActiveFiltersProps) {
  if (labels.length === 0) {
    return null;
  }

  return (
    <div className="flex pl-2 pb-2 flex-wrap items-center gap-2 text-xs text-text-muted-strong">
      <span>Filtres :</span>

      {labels.map((item) => (
        <div key={item.label} className="inline-flex items-center gap-1">
          <Badge variant="secondary">{item.label}</Badge>
          {item.clearHref ? (
            <CustomLink
              href={item.clearHref}
              variant="muted"
              aria-label={getClearActionLabel(item.label)}
              title={getClearActionLabel(item.label)}
              className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              <span className="min-[560px]:hidden">Effacer</span>
              <span className="hidden min-[560px]:inline">{getClearActionLabel(item.label)}</span>
            </CustomLink>
          ) : null}
        </div>
      ))}

      <CustomLink
        className="ml-1 underline-offset-4 transition-colors hover:text-foreground hover:underline"
        href={resetHref}
        variant="muted"
        aria-label="Reinitialiser tous les filtres"
      >
        Réinitialiser
      </CustomLink>
    </div>
  );
}

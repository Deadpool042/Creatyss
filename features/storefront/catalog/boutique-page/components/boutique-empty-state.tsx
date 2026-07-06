import Link from "next/link";

import { StorefrontEmptyState } from "@/components/storefront/storefront-empty-state";

type BoutiqueEmptyStateProps = {
  hasActiveFilters: boolean;
  resetHref: string;
};

export function BoutiqueEmptyState({ hasActiveFilters, resetHref }: BoutiqueEmptyStateProps) {
  return (
    <section className="w-full px-1 pb-1">
      <StorefrontEmptyState
        eyebrow={hasActiveFilters ? "Aucun résultat" : "Catalogue vide"}
        title={
          hasActiveFilters ? "Aucun produit ne correspond à ces filtres" : "Aucun produit publié"
        }
        description={
          hasActiveFilters
            ? "Essayez une autre combinaison ou revenez à la liste complète."
            : "Les produits publics apparaîtront ici dès qu'ils seront publiés."
        }
        action={
          hasActiveFilters ? (
            <Link
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              href={resetHref}
              aria-label="Réinitialiser les filtres et voir tous les produits"
            >
              Voir tous les produits
            </Link>
          ) : null
        }
      />
    </section>
  );
}

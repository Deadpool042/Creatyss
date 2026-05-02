import Link from "next/link";

type BoutiqueEmptyStateProps = {
  hasActiveFilters: boolean;
  resetHref: string;
};

export function BoutiqueEmptyState({ hasActiveFilters, resetHref }: BoutiqueEmptyStateProps) {
  return (
    <section className="w-full  border-shell-border/70 px-1 pb-1 ">
      <div className="grid gap-4 rounded-lg border border-surface-border-subtle/70 bg-surface-panel/30 p-6">
        <p className="text-sm font-bold uppercase tracking-widest text-brand">
          {hasActiveFilters ? "Aucun résultat" : "Catalogue vide"}
        </p>

        <h2>
          {hasActiveFilters ? "Aucun produit ne correspond à ces filtres" : "Aucun produit publié"}
        </h2>

        <p className="leading-relaxed text-text-muted-strong">
          {hasActiveFilters
            ? "Essayez une autre combinaison ou revenez à la liste complète."
            : "Les produits publics apparaîtront ici dès qu'ils seront publiés."}
        </p>

        {hasActiveFilters ? (
          <Link
            className="text-sm text-text-muted-strong underline-offset-4 transition-colors hover:text-foreground hover:underline"
            href={resetHref}
          >
            Voir tous les produits
          </Link>
        ) : null}
      </div>
    </section>
  );
}

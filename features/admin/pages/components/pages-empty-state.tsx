export function PagesEmptyState() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="space-y-2">
        <h2 className="text-base font-medium">Aucune implémentation métier branchée</h2>
        <p className="text-sm text-muted-foreground">
          Le socle admin des pages est en place. Il reste à brancher les queries,
          actions, schémas et types sur le domaine content/pages.
        </p>
      </div>
    </div>
  );
}

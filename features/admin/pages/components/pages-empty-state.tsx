export function PagesEmptyState() {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-panel p-6">
      <div className="space-y-2">
        <h2 className="text-base font-medium">Aucune page pour le moment</h2>
        <p className="text-sm text-muted-foreground">
          Les pages de la boutique apparaîtront ici, y compris les pages légales
          système une fois leurs textes enregistrés dans les réglages.
        </p>
      </div>
    </div>
  );
}

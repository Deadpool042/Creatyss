import { LayoutGrid, List } from "lucide-react";

type BoutiqueViewToggleProps = {
  className?: string;
};

export function BoutiqueViewToggle({ className }: BoutiqueViewToggleProps) {
  return (
    <div
      className={[
        "inline-flex items-center gap-1 rounded-sm border border-control-border bg-control-surface p-0.5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="group"
      aria-label="Changer la vue des produits"
    >
      <button
        type="button"
        aria-pressed="true"
        aria-label="Vue grille"
        className="inline-flex h-7 items-center gap-1 rounded-sm bg-surface-panel px-2 text-xs font-medium text-foreground shadow-control md:gap-1.5 md:px-2.5 data-active:text-brand"
      >
        <LayoutGrid aria-hidden="true" className="size-3.5" />
        <span className="hidden md:inline">Grille</span>
      </button>

      <button
        type="button"
        aria-pressed="false"
        aria-label="Vue liste bientôt disponible"
        aria-disabled="true"
        title="Vue liste bientôt disponible"
        className="inline-flex h-7 items-center gap-1 rounded-sm px-2 text-xs text-text-muted-strong opacity-70 md:gap-1.5 md:px-2.5"
      >
        <List aria-hidden="true" className="size-3.5" />
        <span className="hidden md:inline">Liste</span>
      </button>
    </div>
  );
}

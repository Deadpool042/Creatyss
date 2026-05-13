import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

type BoutiqueViewToggleProps = {
  className?: string;
};

const TOGGLE_BUTTON_CLASS =
  "inline-flex h-7 items-center justify-center gap-1.5 rounded-sm border-0 bg-transparent px-2 text-xs font-medium leading-none text-text-muted-strong transition-colors hover:text-foreground md:px-2.5 [&>svg]:size-3.5 [&>svg]:shrink-0";

export function BoutiqueViewToggle({ className }: BoutiqueViewToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center rounded-md border border-control-border bg-control-surface p-1",
        className
      )}
      role="group"
      aria-label="Changer la vue des produits"
    >
      <button
        type="button"
        aria-pressed="true"
        aria-label="Vue grille"
        data-state="active"
        className={cn(TOGGLE_BUTTON_CLASS, "bg-surface-panel text-foreground [&>svg]:text-brand")}
      >
        <LayoutGrid aria-hidden="true" />
        <span className="hidden md:inline">Grille</span>
      </button>

      <button
        type="button"
        aria-pressed="false"
        aria-disabled="true"
        aria-label="Vue liste bientôt disponible"
        title="Vue liste bientôt disponible"
        className={cn(TOGGLE_BUTTON_CLASS, "cursor-not-allowed opacity-55")}
      >
        <List aria-hidden="true" />
        <span className="hidden md:inline">Liste</span>
      </button>
    </div>
  );
}

import { LayoutGrid, List } from "lucide-react";

type BoutiqueViewToggleProps = {
  className?: string;
};

export function BoutiqueViewToggle({ className }: BoutiqueViewToggleProps) {
  return (
    <div
      className={["boutique-view-toggle", className].filter(Boolean).join(" ")}
      role="group"
      aria-label="Changer la vue des produits"
    >
      <button
        type="button"
        aria-pressed="true"
        aria-label="Vue grille"
        data-state="active"
        className="boutique-view-toggle-button"
      >
        <LayoutGrid aria-hidden="true" />
        <span className="boutique-view-toggle-label">Grille</span>
      </button>

      <button
        type="button"
        aria-pressed="false"
        aria-disabled="true"
        aria-label="Vue liste bientôt disponible"
        title="Vue liste bientôt disponible"
        className="boutique-view-toggle-button"
      >
        <List aria-hidden="true" />
        <span className="boutique-view-toggle-label">Liste</span>
      </button>
    </div>
  );
}

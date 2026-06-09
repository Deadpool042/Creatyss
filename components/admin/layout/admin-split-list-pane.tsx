import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminSplitListPaneProps = Readonly<{
  /** Titre court affiché dans le header compact */
  title: string;
  /** Nombre de résultats — affiché si fourni et resultLabel absent */
  resultCount?: number;
  /** Label personnalisé pour les résultats — remplace le formatage automatique */
  resultLabel?: string;
  /** Zone de contrôles (AdminPanelListControls ou autre) */
  controls?: ReactNode;
  /** Variante mobile sticky/basse des contrôles */
  mobileControls?: ReactNode;
  /** Vue d'ensemble canonique affichée sous le header compact */
  overview?: ReactNode;
  /** Items de liste — contenu feature-local */
  children: ReactNode;
  /** Passer true quand la liste est vide */
  isEmpty?: boolean;
  /** Affiché à la place des children quand isEmpty=true */
  emptyState?: ReactNode;
  className?: string;
}>;

function formatResultLabel(resultCount?: number, resultLabel?: string): string | null {
  if (resultLabel !== undefined) return resultLabel;
  if (typeof resultCount !== "number") return null;
  return `${resultCount} ${resultCount > 1 ? "résultats" : "résultat"}`;
}

export function AdminSplitListPane({
  title,
  resultCount,
  resultLabel,
  controls,
  mobileControls,
  overview,
  children,
  isEmpty = false,
  emptyState,
  className,
}: AdminSplitListPaneProps) {
  const resolvedResultLabel = formatResultLabel(resultCount, resultLabel);

  return (
    <section className={cn("flex min-h-0 flex-1 flex-col space-y-2", className)}>
      <div className="admin-split-list-pane-scroll min-h-0 flex-1 overflow-visible md:overflow-x-hidden md:overflow-y-auto">
        <div>
          <header className="relative z-10 h-fit py-1">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 border-b border-surface-border/70 bg-shell-surface/90 supports-backdrop-filter:bg-shell-surface/78 supports-backdrop-filter:backdrop-blur-xl"
            />
            <div className="relative safe-px-layout pt-0">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="truncate text-sm font-semibold tracking-tight text-foreground">
                  {title}
                </h2>
                {resolvedResultLabel !== null ? (
                  <p className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                    {resolvedResultLabel}
                  </p>
                ) : null}
              </div>
              {controls !== undefined ? <div>{controls}</div> : null}
            </div>
          </header>
        </div>

        <div className="flex min-h-full min-w-0 flex-col safe-px-layout space-y-4 pt-2">
          {overview !== undefined ? <div className="pb-2.5">{overview}</div> : null}
          <div className="-mt-px">{isEmpty && emptyState !== undefined ? emptyState : children}</div>
        </div>
      </div>

      {mobileControls !== undefined ? <div className="shrink-0">{mobileControls}</div> : null}
    </section>
  );
}

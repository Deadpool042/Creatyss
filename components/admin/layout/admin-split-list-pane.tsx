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
  children,
  isEmpty = false,
  emptyState,
  className,
}: AdminSplitListPaneProps) {
  const resolvedResultLabel = formatResultLabel(resultCount, resultLabel);

  return (
    <section className={cn("flex min-h-0 flex-1 flex-col ", className)}>
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
        <header className="sticky top-0 z-10 pb-2.5 pt-0">
          <div
            aria-hidden
            className="absolute inset-y-0 -left-4 -right-4 border-b border-surface-border/70 bg-shell-surface/90 supports-backdrop-filter:bg-shell-surface/78 supports-backdrop-filter:backdrop-blur-xl md:-left-5 md:-right-5 lg:-left-6 lg:-right-6"
          />
          <div className="relative pt-0">
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

        <div className="-mt-px">{isEmpty && emptyState !== undefined ? emptyState : children}</div>
      </div>
    </section>
  );
}

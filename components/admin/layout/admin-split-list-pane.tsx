import type { ReactNode } from "react";

import { AdminSplitListShell } from "./admin-split-list-shell";

type AdminSplitListPaneProps = Readonly<{
  /** Titre court affiché dans le header compact */
  title: string;
  /** Nombre de résultats — affiché si fourni et resultLabel absent */
  resultCount?: number;
  /** Label personnalisé pour les résultats — remplace le formatage automatique */
  resultLabel?: string;
  /** Zone de contrôles (AdminPanelListControls ou autre) */
  controls?: ReactNode;
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
  overview,
  children,
  isEmpty = false,
  emptyState,
  className,
}: AdminSplitListPaneProps) {
  const resolvedResultLabel = formatResultLabel(resultCount, resultLabel);

  return (
    <AdminSplitListShell
      {...(className !== undefined ? { className } : {})}
      scrollClassName="overflow-x-hidden overflow-y-auto"
      contentClassName="flex min-h-full min-w-0 flex-col safe-px-layout space-y-4 pt-2"
      header={
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
      }
    >
      {overview !== undefined ? <div className="pb-2.5">{overview}</div> : null}

      <div className="-mt-px">{isEmpty && emptyState !== undefined ? emptyState : children}</div>
    </AdminSplitListShell>
  );
}

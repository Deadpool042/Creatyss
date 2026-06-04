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

function formatResultLabel(
  resultCount?: number,
  resultLabel?: string,
): string | null {
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
    <section className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <header className="shrink-0 border-b border-surface-border px-3 py-2.5">
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
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {isEmpty && emptyState !== undefined ? emptyState : children}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type AdminSplitViewNavProps = {
  rootPath: string;
  overviewLabel?: string;
  detailLabel?: string;
};

/**
 * Barre de navigation compacte Overview / Détail pour les Split Views admin.
 *
 * - "Vue d'ensemble" → lien vers la route racine du module.
 * - "Détail" → actif quand une route détail est ouverte, désactivé sinon.
 *
 * Rendu server-safe via usePathname() (ce composant est client car il lit l'URL).
 */
export function AdminSplitViewNav({
  rootPath,
  overviewLabel = "Vue d'ensemble",
  detailLabel = "Détail",
}: AdminSplitViewNavProps) {
  const pathname = usePathname();
  const isDetailActive =
    pathname !== rootPath && pathname.startsWith(rootPath + "/");

  return (
    <div
      className="flex shrink-0 items-center gap-px rounded-lg border border-surface-border bg-surface-panel-soft p-0.5"
      role="tablist"
      aria-label="Basculer entre la vue d'ensemble et le détail"
    >
      <Link
        href={rootPath}
        role="tab"
        aria-selected={!isDetailActive}
        aria-current={!isDetailActive ? "page" : undefined}
        className={cn(
          "flex-1 rounded-md px-3 py-1.5 text-center text-xs font-medium transition-colors",
          !isDetailActive
            ? "bg-surface-panel text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {overviewLabel}
      </Link>

      {isDetailActive ? (
        <Link
          href={pathname}
          role="tab"
          aria-selected
          aria-current="page"
          className="flex-1 rounded-md bg-surface-panel px-3 py-1.5 text-center text-xs font-medium text-foreground shadow-sm transition-colors"
        >
          {detailLabel}
        </Link>
      ) : (
        <span
          role="tab"
          aria-selected={false}
          aria-disabled
          className="flex-1 cursor-not-allowed rounded-md px-3 py-1.5 text-center text-xs font-medium text-muted-foreground/50"
        >
          {detailLabel}
        </span>
      )}
    </div>
  );
}

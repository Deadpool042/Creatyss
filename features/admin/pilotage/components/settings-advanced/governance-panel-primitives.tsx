import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GovernanceStatItem = {
  label: string;
  value: number | string;
  accent?: string;
};

/**
 * Construit un GovernanceStatItem de façon compatible avec exactOptionalPropertyTypes.
 * Ne pas utiliser `{ ..., accent: condition ? "class" : undefined }` directement —
 * cela produit `accent: string | undefined` qui n'est pas assignable à `accent?: string`.
 */
export function makeStat(
  label: string,
  value: number | string,
  accent?: string
): GovernanceStatItem {
  if (accent === undefined) return { label, value };
  return { label, value, accent };
}

export type GovernanceDefaultItem = {
  name: string;
  secondary?: string;
};

// ─── Shell ────────────────────────────────────────────────────────────────────

/**
 * Wrapper racine d'un panneau de gouvernance.
 * Fournit le label de section et l'espacement vertical uniforme.
 */
export function GovernancePanelShell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60">
        {label}
      </p>
      {children}
    </div>
  );
}

// ─── Domain context ───────────────────────────────────────────────────────────

/**
 * Texte contextuel expliquant ce que le flag gouverne.
 * Accepte du JSX pour mettre en valeur les termes clés.
 */
export function GovernanceDomainContext({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-xs text-muted-foreground leading-relaxed">{children}</p>
  );
}

// ─── Stat grid ────────────────────────────────────────────────────────────────

/**
 * Grille de statistiques live — 3 colonnes par défaut.
 */
export function GovernanceStatGrid({
  stats,
  columns = 3,
}: {
  stats: GovernanceStatItem[];
  columns?: 2 | 3 | 4;
}) {
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns];

  return (
    <div className={cn("grid gap-2", colClass)}>
      {stats.map((s) => (
        <GovernanceStatCard key={s.label} {...s} />
      ))}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

export function GovernanceStatCard({ label, value, accent }: GovernanceStatItem) {
  return (
    <div className="rounded-xl border border-surface-border/60 bg-surface-panel/60 px-3 py-2.5">
      <p className={cn("text-base font-semibold", accent ?? "text-foreground")}>
        {value}
      </p>
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">
        {label}
      </p>
    </div>
  );
}

// ─── Default item ─────────────────────────────────────────────────────────────

/**
 * Ligne "élément par défaut" — icône étoile + nom + valeur secondaire optionnelle.
 * Utilisée pour mettre en avant la liste de prix par défaut, la langue principale, etc.
 */
export function GovernanceDefaultItem({
  name,
  secondary,
}: GovernanceDefaultItem) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-feedback-success-border/60 bg-feedback-success-surface/20 px-3 py-2.5">
      <Star className="size-3.5 shrink-0 text-feedback-success-foreground" />
      <p className="min-w-0 truncate text-xs font-medium text-foreground">
        {name}
      </p>
      {secondary !== undefined ? (
        <span className="ml-auto shrink-0 text-[11px] text-muted-foreground/60">
          {secondary}
        </span>
      ) : null}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

export function GovernanceEmptyState({ message }: { message: string }) {
  return (
    <p className="text-xs italic text-muted-foreground/60">{message}</p>
  );
}

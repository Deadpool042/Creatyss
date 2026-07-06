import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StorefrontEmptyStateProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

/**
 * Empty state partagé storefront (identité "atelier" — eyebrow + titre
 * serif). Remplace les markups ad hoc dupliqués sur panier, checkout,
 * favoris, catégories et blog (cf.
 * docs/roadmap/hygiene-composition-storefront/README.md, lot 2).
 */
export function StorefrontEmptyState({
  eyebrow,
  title,
  description,
  action,
  className,
}: StorefrontEmptyStateProps) {
  return (
    <div
      className={cn(
        "grid gap-4 rounded-lg border border-surface-border-subtle/70 bg-surface-panel/30 p-6 text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">{eyebrow}</p>
      ) : null}
      <h2 className="font-serif text-2xl font-normal tracking-tight text-foreground">{title}</h2>
      {description ? (
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      {action}
    </div>
  );
}

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Wrapper de section de pilotage générique (domaine `dashboarding`, cf.
 * `docs/roadmap/analyses-cockpit-analytique/lot-6-tracking-dashboarding-cadrage.md`).
 * Pattern répété à l'identique dans le cockpit Analyses — extrait ici pour
 * éviter la duplication, sans imposer ce style aux autres écrans de
 * pilotage qui ont leur propre langage visuel (ex. `/admin`).
 */
export function DashboardSection({
  eyebrow,
  isMock = false,
  title,
  children,
  className,
}: {
  eyebrow: string;
  isMock?: boolean;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm backdrop-blur-sm",
        className
      )}
    >
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
        {eyebrow}
        {isMock ? (
          <span className="ml-1.5 font-normal text-muted-foreground/40">(mock)</span>
        ) : null}
      </p>
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      {children}
    </section>
  );
}

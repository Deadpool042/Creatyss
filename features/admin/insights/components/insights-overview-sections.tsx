import Link from "next/link";
import { BarChart3, ChevronRight } from "lucide-react";

import type { AdminNavigationItem } from "@/features/admin/navigation";

type InsightsOverviewSectionsProps = Readonly<{
  cards: ReadonlyArray<AdminNavigationItem>;
}>;

export function InsightsOverviewSections({ cards }: InsightsOverviewSectionsProps) {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-2">
      <div className="divide-y divide-surface-border/50 overflow-hidden rounded-2xl border border-surface-border/60 bg-surface-panel/60 shadow-sm backdrop-blur-sm">
        {cards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="group flex items-center gap-3.5 px-4 py-3 transition-colors hover:bg-surface-subtle/50"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-subtle">
              <BarChart3 className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-foreground">{card.label}</p>
              <p className="mt-0.5 truncate text-xs leading-5 text-muted-foreground">
                Métriques commerce et trafic, selon le niveau activé sur engagement.analytics.
              </p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}

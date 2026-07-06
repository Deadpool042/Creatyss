import Link from "next/link";
import { Activity, ChevronRight, HeartPulse, Wrench, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AdminNavigationItem } from "@/features/admin/navigation";
import type { AdminSystemHealth } from "@/features/admin/maintenance/queries/get-admin-system-health.query";

type MaintenanceCardMeta = {
  description: string;
  icon: LucideIcon;
};

const MAINTENANCE_CARD_META: Record<string, MaintenanceCardMeta> = {
  "maintenance-logs": {
    description: "Tâches en arrière-plan : priorités, statuts d'exécution et reprise.",
    icon: Wrench,
  },
  "maintenance-monitoring": {
    description: "État de la base, de la file de jobs et des événements domaine.",
    icon: HeartPulse,
  },
  "maintenance-observability": {
    description: "Journal d'audit : actions récentes, niveaux critique et avertissement.",
    icon: Activity,
  },
};

type MaintenanceOverviewSectionsProps = Readonly<{
  health: AdminSystemHealth;
  cards: ReadonlyArray<AdminNavigationItem>;
}>;

export function MaintenanceOverviewSections({ health, cards }: MaintenanceOverviewSectionsProps) {
  const stats = [
    { label: "Jobs en attente", value: health.jobs.pending },
    { label: "Jobs échoués", value: health.jobs.failed, alert: true },
    { label: "Events échoués", value: health.events.failed, alert: true },
    { label: "Audit critiques", value: health.audit.critical, alert: true },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={cn(
              "rounded-2xl border border-surface-border/60 px-4 py-3 shadow-sm backdrop-blur-sm",
              s.alert && s.value > 0
                ? "bg-feedback-error-surface/30 border-feedback-error-border"
                : "bg-surface-panel/60"
            )}
          >
            <p
              className={cn(
                "text-2xl font-semibold tracking-tight",
                s.alert && s.value > 0 ? "text-feedback-error-foreground" : "text-foreground"
              )}
            >
              {s.value}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-3xl gap-2">
        <div className="divide-y divide-surface-border/50 overflow-hidden rounded-2xl border border-surface-border/60 bg-surface-panel/60 shadow-sm backdrop-blur-sm">
          {cards.map((card) => {
            const meta = MAINTENANCE_CARD_META[card.key] ?? { description: "", icon: Wrench };

            return (
              <Link
                key={card.key}
                href={card.href}
                className="group flex items-center gap-3.5 px-4 py-3 transition-colors hover:bg-surface-subtle/50"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-subtle">
                  <meta.icon className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-foreground">{card.label}</p>
                  {meta.description ? (
                    <p className="mt-0.5 truncate text-xs leading-5 text-muted-foreground">
                      {meta.description}
                    </p>
                  ) : null}
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import Link from "next/link";
import { Languages, Settings2 } from "lucide-react";

import { AdminSplitDetailPaneShell } from "@/components/admin/layout/admin-split-detail-pane-shell";
import {
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-section-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type LocalizationModuleShellProps = Readonly<{
  activeTab: "settings" | "translations";
  children: ReactNode;
}>;

const TAB_LINKS = [
  {
    key: "settings" as const,
    href: "/admin/settings/advanced/optional/localization/settings",
    label: "Reglages",
    description: "Locales, langue par defaut, configuration de base.",
    icon: Settings2,
  },
  {
    key: "translations" as const,
    href: "/admin/settings/advanced/optional/localization/translations",
    label: "Traductions",
    description: "Contenus traduits (accueil, fiche produit).",
    icon: Languages,
  },
] as const;

export function LocalizationModuleShell({
  activeTab,
  children,
}: LocalizationModuleShellProps) {
  return (
    <AdminSplitDetailPaneShell contentClassName="py-4 md:py-5 lg:py-6">
      <AdminSplitDetailSectionCard className="space-y-5 overflow-hidden p-0">
        <div className="border-b border-surface-border/30 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface-panel)_95%,white)_0%,color-mix(in_srgb,var(--surface-panel)_86%,var(--shell-surface))_100%)] px-5 py-5">
          <AdminSplitDetailSectionHeader
            eyebrow="Modules optionnels"
            title="Localisation"
            description="Module de langues pilote depuis le pilotage avance, avec configuration et traductions sous une URL canonique unique."
            action={
              <Badge
                variant="outline"
                className="border-feedback-success-border/60 bg-feedback-success-surface/40 text-feedback-success-foreground"
              >
                Module actif
              </Badge>
            }
          />

          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {TAB_LINKS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.key === activeTab;

              return (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={cn(
                    "rounded-2xl border px-4 py-3 transition-colors",
                    isActive
                      ? "border-foreground/15 bg-foreground text-background shadow-sm"
                      : "border-surface-border/60 bg-surface-panel/70 text-foreground hover:bg-surface-subtle/30"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border",
                        isActive
                          ? "border-white/15 bg-white/10 text-background"
                          : "border-surface-border/60 bg-surface text-muted-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{tab.label}</p>
                      <p
                        className={cn(
                          "mt-1 text-xs leading-5",
                          isActive ? "text-background/75" : "text-muted-foreground"
                        )}
                      >
                        {tab.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="px-5 pb-5">{children}</div>
      </AdminSplitDetailSectionCard>
    </AdminSplitDetailPaneShell>
  );
}

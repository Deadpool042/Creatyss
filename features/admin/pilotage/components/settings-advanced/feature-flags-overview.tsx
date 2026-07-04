import { Sparkles } from "lucide-react";

import { AdminOverviewHero } from "@/components/admin/layout/admin-overview-hero";
import { AdminSplitDetailOverviewGrid } from "@/components/admin/layout/admin-split-detail-overview-content";
import {
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-section-card";
import { AdminSplitDetailOverviewShell } from "@/components/admin/layout/admin-split-detail-overview-shell";
import { StatsCard } from "@/components/shared/display/stats-card";
import type { FeatureFlagsOverviewStats } from "@/features/admin/pilotage/view-models/settings-advanced/feature-flags-split-view.types";

type FeatureFlagsOverviewProps = Readonly<{
  stats: FeatureFlagsOverviewStats;
}>;

export function FeatureFlagsOverview({ stats }: FeatureFlagsOverviewProps) {
  const {
    totalCatalogCount,
    dbCreatedCount,
    missingDbCount,
    unmappedCount,
    activeCount,
    inactiveCount,
    draftCount,
  } = stats;

  return (
    <AdminSplitDetailOverviewShell
      title="Modules & fonctionnalités"
      contentWidth="fluid"
      hero={
        <AdminOverviewHero
          mobileHidden
          align="leading"
          eyebrow="Pilotage"
          icon={Sparkles}
          title="Activer et régler le niveau de chaque fonctionnalité"
          description="Ici, on active ou on ajuste le niveau des fonctionnalités du site. Les valeurs métier (prix, stock, livraison, etc.) se configurent dans les écrans dédiés, accessibles depuis chaque fonctionnalité."
          metrics={[
            {
              label: "Entrées",
              value: totalCatalogCount,
              hint: "Entrées recensées dans le catalogue.",
              toneClassName: "bg-surface-panel",
            },
            {
              label: "Créées en DB",
              value: dbCreatedCount,
              hint: "Flags déjà matérialisés en base.",
              toneClassName: "bg-surface-panel-soft",
            },
            {
              label: "Non créées",
              value: missingDbCount,
              hint: "Fonctionnalités cataloguées mais encore absentes en base.",
              toneClassName: "bg-surface-panel-soft",
            },
            {
              label: "Non cataloguées",
              value: unmappedCount,
              hint: "Flags présents en base mais non référencés.",
              toneClassName: "bg-surface-panel-soft",
            },
          ]}
        />
      }
    >
      <AdminSplitDetailOverviewGrid>
        <AdminSplitDetailSectionCard>
          <AdminSplitDetailSectionHeader
            eyebrow="Pilotage"
            title="Vue d'ensemble de la gouvernance"
            description="État global du catalogue de feature flags et de leur présence en base de données."
          />
          <div className="mt-5 space-y-2">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <StatsCard title="Entrées" value={totalCatalogCount} />
              <StatsCard title="Créées en DB" value={dbCreatedCount} />
              <StatsCard title="Non créées" value={missingDbCount} />
              <StatsCard title="Non cataloguées" value={unmappedCount} />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <StatsCard title="Actifs" value={activeCount} />
              <StatsCard title="Inactifs" value={inactiveCount} />
              <StatsCard title="Brouillons" value={draftCount} />
            </div>
          </div>
        </AdminSplitDetailSectionCard>

        <AdminSplitDetailSectionCard tone="secondary">
          <AdminSplitDetailSectionHeader
            eyebrow="Pilotage"
            title="Écarts à traiter"
            description="Points à surveiller entre le catalogue, la base et le runtime."
          />
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-surface-border-subtle bg-surface-panel-soft px-4 py-3">
              <p className="text-sm font-medium text-foreground">Flags non créés en base</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {missingDbCount} fonctionnalité{missingDbCount > 1 ? "s" : ""} cataloguée
                {missingDbCount > 1 ? "s" : ""} ne sont pas encore créées en base.
              </p>
            </div>
            <div className="rounded-xl border border-surface-border-subtle bg-surface-panel-soft px-4 py-3">
              <p className="text-sm font-medium text-foreground">Flags non catalogués</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {unmappedCount} flag{unmappedCount > 1 ? "s" : ""} existent en base mais ne sont pas
                référencés dans le catalogue.
              </p>
            </div>
            <div className="rounded-xl border border-surface-border-subtle bg-surface-panel-soft px-4 py-3">
              <p className="text-sm font-medium text-foreground">Couverture de création</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {dbCreatedCount}/{totalCatalogCount} entrées du catalogue sont déjà matérialisées en
                base.
              </p>
            </div>
          </div>
        </AdminSplitDetailSectionCard>
      </AdminSplitDetailOverviewGrid>
    </AdminSplitDetailOverviewShell>
  );
}

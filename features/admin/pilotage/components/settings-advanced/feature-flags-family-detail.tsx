"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-overview-content";
import type {
  FeatureFamilyDetailViewModel,
  FeatureModuleGroup,
} from "@/features/admin/pilotage/view-models/settings-advanced/feature-flags-split-view.types";
import { FeatureFlagEntry } from "./feature-flag-entry";

// ─── Props ────────────────────────────────────────────────────────────────────

type FeatureFlagsFamilyDetailProps = Readonly<{
  viewModel: FeatureFamilyDetailViewModel;
}>;

// ─── Module group list ────────────────────────────────────────────────────────

function ModuleGroupList({ group }: { group: FeatureModuleGroup }) {
  return (
    <div className="divide-y divide-surface-border/20">
      {group.flags.map((flag) => (
        <FeatureFlagEntry key={flag.key} flag={flag} />
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FeatureFlagsFamilyDetail({ viewModel }: FeatureFlagsFamilyDetailProps) {
  return (
    <div className="admin-split-detail-pane-content admin-split-detail-pane-column safe-px-layout py-0 md:py-4 lg:py-6">
      <AdminSplitDetailSectionCard className="overflow-hidden p-0">
        <div className="border-b border-surface-border/30 px-4 py-4">
          <AdminSplitDetailSectionHeader
            eyebrow="Pilotage"
            title={viewModel.label}
            description={viewModel.description}
            action={
              <span className="shrink-0 text-[11px] font-medium text-muted-foreground/70 tabular-nums">
              {viewModel.activeCount} / {viewModel.totalCount} actifs
              </span>
            }
          />

          {viewModel.moduleGroups.length > 1 && viewModel.moduleGroups[0] !== undefined ? (
            <Tabs defaultValue={viewModel.moduleGroups[0].module} className="mt-3 space-y-3">
              <TabsList className="inline-flex h-auto w-fit max-w-full flex-wrap gap-1 rounded-full border border-surface-border/60 bg-surface-panel-soft/80 p-1 shadow-none">
                {viewModel.moduleGroups.map((group) => (
                  <TabsTrigger key={group.module} value={group.module} className="rounded-full">
                    {group.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {viewModel.moduleGroups.map((group) => (
                <TabsContent key={group.module} value={group.module}>
                  <ModuleGroupList group={group} />
                </TabsContent>
              ))}
            </Tabs>
          ) : null}
        </div>

        {viewModel.moduleGroups.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">Aucune fonctionnalité dans cette famille.</p>
          </div>
        ) : null}

        {viewModel.moduleGroups.length === 1 && viewModel.moduleGroups[0] !== undefined ? (
          <ModuleGroupList group={viewModel.moduleGroups[0]} />
        ) : null}
      </AdminSplitDetailSectionCard>
    </div>
  );
}

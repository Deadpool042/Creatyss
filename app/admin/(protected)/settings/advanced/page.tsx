import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { FeatureFlagsPanel } from "./feature-flags-panel";
import { listAdminFeatureFlags } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";

export const dynamic = "force-dynamic";

export default async function AdminSettingsAdvancedPage() {
  let flags: Awaited<ReturnType<typeof listAdminFeatureFlags>> = [];

  try {
    flags = await listAdminFeatureFlags();
  } catch {
    // Table non disponible
  }

  return (
    <AdminPageShell
      scrollMode="area"
      title="Réglages avancés"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Réglages" },
        { label: "Avancé" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="form"
    >
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
            Pilotage
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            Feature Flags
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Activez ou désactivez des fonctionnalités sans redéploiement. Les flags contrôlent la
            navigation admin, les capacités métier et les modules optionnels.
          </p>
        </div>

        <FeatureFlagsPanel flags={flags} />
      </div>
    </AdminPageShell>
  );
}

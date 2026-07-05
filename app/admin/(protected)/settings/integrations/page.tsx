import Link from "next/link";
import { Plug } from "lucide-react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminFeatureDisabledState } from "@/components/admin/shared/admin-feature-disabled-state";
import { requireInternalAdminCapability } from "@/core/auth/admin/require-internal-admin-capability";
import { IntegrationsPanel } from "@/features/admin/settings/components/integrations-panel";
import { getAdminIntegrationsSnapshot } from "@/features/admin/settings/queries/get-admin-integrations-snapshot.query";
import { isIntegrationsFeatureActive } from "@/features/admin/settings/queries/is-integrations-feature-active.query";

export const dynamic = "force-dynamic";

export default async function AdminSettingsIntegrationsPage() {
  await requireInternalAdminCapability("admin.settings.advanced.read");

  const featureActive = await isIntegrationsFeatureActive();

  if (!featureActive) {
    return (
      <AdminPageShell
        scrollBehavior="page"
        title="Integrations externes"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Reglages", href: "/admin/settings" },
          { label: "Avance", href: "/admin/settings/advanced/overview" },
          { label: "Integrations externes" },
        ]}
        showTitleInContent={false}
        contentPreset="table"
      >
        <AdminFeatureDisabledState
          capabilityName="Intégrations externes"
          description="Cette capacité est pilotée dans les Réglages avancés. Activez le niveau requis sur platform.integrations pour ouvrir les intégrations."
          icon={Plug}
        />
      </AdminPageShell>
    );
  }

  const snapshot = await getAdminIntegrationsSnapshot();

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Integrations externes"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Reglages", href: "/admin/settings" },
        { label: "Avance", href: "/admin/settings/advanced/overview" },
        { label: "Integrations externes" },
      ]}
      showTitleInContent={false}
      contentPreset="table"
    >
      <div className="grid gap-6">
        <IntegrationsPanel snapshot={snapshot} />

        <section className="rounded-2xl border border-dashed border-surface-border/60 bg-surface-subtle/10 p-5">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Portee du lot</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cette page observe l&apos;etat reel de <code>Integration</code>,{" "}
            <code>IntegrationCredential</code> et <code>IntegrationSyncState</code>. Les prochains
            increments pourront ajouter les ecritures, la reprise operatoire et les adaptateurs
            provider, mais rien de cela n&apos;est ouvert ici.
          </p>
          <Link
            href="/admin/settings/advanced/overview"
            className="mt-4 inline-flex rounded-full border border-surface-border/60 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-subtle/30"
          >
            Revenir aux reglages avances
          </Link>
        </section>
      </div>
    </AdminPageShell>
  );
}

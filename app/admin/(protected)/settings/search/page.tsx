import Link from "next/link";
import { Search } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminFeatureDisabledState } from "@/components/admin/shared/admin-feature-disabled-state";
import { requireInternalAdminCapability } from "@/core/auth/admin/require-internal-admin-capability";
import { SearchDocumentsPanel } from "@/features/admin/settings/components/search-documents-panel";
import { isSearchFeatureActive } from "@/features/admin/settings/queries/is-search-feature-active.query";
import { listAdminSearchDocuments } from "@/features/admin/settings/queries/list-admin-search-documents.query";

export const dynamic = "force-dynamic";

export default async function AdminSettingsSearchPage() {
  await requireInternalAdminCapability("admin.settings.advanced.read");

  const featureActive = await isSearchFeatureActive();
  const searchHeader = (
    <AdminPageHeader
      eyebrow="Réglages avancés"
      title="Recherche indexée"
      description="État de l'index plein texte alimenté par les mutations produit, selon le niveau activé sur satellite.search."
    />
  );

  if (!featureActive) {
    return (
      <AdminPageShell
        scrollBehavior="page"
        title="Recherche indexee"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Reglages", href: "/admin/settings" },
          { label: "Avance", href: "/admin/settings/advanced/overview" },
          { label: "Recherche indexee" },
        ]}
        showTitleInContent={false}
        contentPreset="table"
        header={searchHeader}
      >
        <AdminFeatureDisabledState
          capabilityName="Recherche indexée"
          description="Cette capacité est pilotée dans les Réglages avancés. Activez le niveau requis sur satellite.search pour ouvrir l'index de recherche."
          icon={Search}
        />
      </AdminPageShell>
    );
  }

  const snapshot = await listAdminSearchDocuments();

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Recherche indexee"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Reglages", href: "/admin/settings" },
        { label: "Avance", href: "/admin/settings/advanced/overview" },
        { label: "Recherche indexee" },
      ]}
      showTitleInContent={false}
      contentPreset="table"
      header={searchHeader}
    >
      <div className="grid gap-6">
        <SearchDocumentsPanel snapshot={snapshot} />

        <section className="rounded-2xl border border-dashed border-surface-border/60 bg-surface-subtle/10 p-5">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Portee du lot</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cette page observe l&apos;etat reel de <code>SearchDocument</code>. L&apos;index est
            alimente automatiquement par les mutations produit (creation, edition, archivage) et la
            recherche plein texte du storefront (<code>/boutique?q=</code>) le consomme lorsque
            cette capacite est active. Pour indexer les produits anterieurs a l&apos;activation :{" "}
            <code>pnpm exec tsx scripts/backfill-search-documents.ts</code>.
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

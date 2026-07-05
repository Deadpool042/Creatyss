import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { requireInternalAdminCapability } from "@/core/auth/admin/require-internal-admin-capability";
import { SearchDocumentsPanel } from "@/features/admin/settings/components/search-documents-panel";
import { isSearchFeatureActive } from "@/features/admin/settings/queries/is-search-feature-active.query";
import { listAdminSearchDocuments } from "@/features/admin/settings/queries/list-admin-search-documents.query";

export const dynamic = "force-dynamic";

export default async function AdminSettingsSearchPage() {
  await requireInternalAdminCapability("admin.settings.advanced.read");

  const featureActive = await isSearchFeatureActive();

  if (!featureActive) {
    notFound();
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
    >
      <div className="grid gap-6">
        <SearchDocumentsPanel snapshot={snapshot} />

        <section className="rounded-2xl border border-dashed border-surface-border/60 bg-surface-subtle/10 p-5">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Portee du lot
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cette page observe l&apos;etat reel de <code>SearchDocument</code>. Les prochains
            increments pourront brancher des producteurs d&apos;index, des rebuilds ou une
            recherche storefront, mais rien de cela n&apos;est active ici.
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

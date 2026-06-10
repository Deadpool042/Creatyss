import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { StoreConfigForm } from "@/features/admin/settings/components/store-config-form";
import { getAdminStoreConfig } from "@/features/admin/settings/queries/get-admin-store-config.query";

export default async function AdminSettingsStorePage() {
  await requireAdminCapability("admin.settings.store.read");
  const store = await getAdminStoreConfig();

  if (!store) {
    return (
      <AdminPageShell
        scrollBehavior="page"
        title="Boutique"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Réglages" },
          { label: "Boutique" },
        ]}
        showBreadcrumbsInContent={false}
        showTitleInContent={false}
        contentPreset="form"
      >
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground">Boutique introuvable.</p>
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Boutique"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Réglages" },
        { label: "Boutique" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="form"
    >
      <div className="space-y-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
            Réglages
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            Configuration boutique
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Statut opérationnel, mode production et domaines d'accès.
          </p>
        </div>

        <StoreConfigForm store={store} />
      </div>
    </AdminPageShell>
  );
}

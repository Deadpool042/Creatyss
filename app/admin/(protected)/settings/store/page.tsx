import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { StoreConfigForm } from "@/features/admin/settings/components/store-config-form";
import { getAdminStoreConfig } from "@/features/admin/settings/queries/get-admin-store-config.query";

export default async function AdminSettingsStorePage() {
  const store = await getAdminStoreConfig();

  if (!store) {
    return (
      <AdminPageShell
        scrollMode="area"
        title="Boutique"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Réglages" },
          { label: "Boutique" },
        ]}
        showBreadcrumbsInContent={false}
        showTitleInContent={false}
      >
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="text-sm text-muted-foreground">Boutique introuvable.</p>
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      scrollMode="area"
      title="Boutique"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Réglages" },
        { label: "Boutique" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-8">
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

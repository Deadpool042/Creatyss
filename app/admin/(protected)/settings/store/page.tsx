import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { StoreConfigForm } from "@/features/admin/settings/components/store-config-form";
import { getAdminStoreConfig } from "@/features/admin/settings/queries/get-admin-store-config.query";

const storeHeader = (
  <AdminPageHeader
    eyebrow="Réglages"
    title="Configuration boutique"
    description="Statut opérationnel, mode production et domaines d'accès."
  />
);

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
        showTitleInContent={false}
        contentPreset="form"
        header={storeHeader}
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
      showTitleInContent={false}
      contentPreset="form"
      header={storeHeader}
    >
      <div className="space-y-8">
        <StoreConfigForm store={store} />
      </div>
    </AdminPageShell>
  );
}

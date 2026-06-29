import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { StoreSettingsForm } from "@/features/admin/settings/components/store-settings-form";
import { StoreLogoSection } from "@/features/admin/settings/components/store-logo-section";
import { getAdminStoreSettings } from "@/features/admin/settings/queries/get-admin-store-settings.query";

export default async function AdminSettingsGeneralPage() {
  await requireAdminCapability("admin.settings.general.read");
  const store = await getAdminStoreSettings();

  if (!store) {
    return (
      <AdminPageShell
        scrollBehavior="page"
        title="Réglages généraux"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Réglages" },
          { label: "Général" },
        ]}
        showBreadcrumbsInContent={false}
        showTitleInContent={false}
        contentPreset="form"
      >
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Boutique introuvable — vérifier la base de données.
          </p>
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Réglages généraux"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Réglages" },
        { label: "Général" },
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
            {store.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Identité, support et paramètres régionaux de la boutique.
          </p>
        </div>

        <div className="divide-y divide-surface-border/40">
          <StoreLogoSection logoUrl={store.logoUrl} storeName={store.name} />
        </div>

        <StoreSettingsForm store={store} />
      </div>
    </AdminPageShell>
  );
}

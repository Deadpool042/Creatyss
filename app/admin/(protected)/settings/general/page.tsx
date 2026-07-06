import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
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
        showTitleInContent={false}
        contentPreset="form"
        header={
          <AdminPageHeader
            eyebrow="Réglages"
            title="Réglages généraux"
            description="Identité, support et paramètres régionaux de la boutique."
          />
        }
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
      showTitleInContent={false}
      contentPreset="form"
      header={
        <AdminPageHeader
          eyebrow="Réglages"
          title={store.name}
          description="Identité, support et paramètres régionaux de la boutique."
        />
      }
    >
      <div className="space-y-8">
        <div className="divide-y divide-surface-border/40">
          <StoreLogoSection logoUrl={store.logoUrl} storeName={store.name} />
        </div>

        <StoreSettingsForm store={store} />
      </div>
    </AdminPageShell>
  );
}

import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { OrderSettingsForm } from "@/features/admin/settings/components/order-settings-form";
import { getAdminOrderSettings } from "@/features/admin/settings/queries/get-admin-order-settings.query";

export default async function AdminSettingsOrdersPage() {
  await requireAdminCapability("admin.settings.orders.read");
  const settings = await getAdminOrderSettings();

  if (!settings) {
    return (
      <AdminPageShell
        scrollBehavior="page"
        title="Commandes"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Réglages" }, { label: "Commandes" }]}
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
      title="Commandes"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Réglages" }, { label: "Commandes" }]}
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
            Réglages des commandes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Numérotation des commandes et paramètres de traitement.
          </p>
        </div>

        <OrderSettingsForm settings={settings} />
      </div>
    </AdminPageShell>
  );
}

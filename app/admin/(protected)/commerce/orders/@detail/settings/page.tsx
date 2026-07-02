import { AdminSplitPaneShell } from "@/components/admin/layout/admin-split-pane-shell";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { OrderSettingsForm } from "@/features/admin/settings/components/order-settings-form";
import { getAdminOrderSettings } from "@/features/admin/settings/queries/get-admin-order-settings.query";

export default async function OrdersSettingsDetailPage() {
  await requireAdminCapability("admin.settings.orders.read");
  const settings = await getAdminOrderSettings();

  if (!settings) {
    return (
      <AdminSplitPaneShell title="Configuration commandes">
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground">Boutique introuvable.</p>
        </div>
      </AdminSplitPaneShell>
    );
  }

  return (
    <AdminSplitPaneShell title="Configuration commandes">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
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
      </div>
    </AdminSplitPaneShell>
  );
}

import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { ShippingRouteNav } from "@/features/admin/commerce/shipping/shared/components/shipping-route-nav";
import { ShippingSettingsForm } from "@/features/admin/settings/components/shipping-settings-form";
import { getAdminShippingSettings } from "@/features/admin/settings/queries/get-admin-shipping-settings.query";

export default async function AdminCommerceShippingSettingsPage() {
  await requireAdminCapability("admin.settings.shipping.read");
  const settings = await getAdminShippingSettings();

  if (!settings) {
    return (
      <AdminPageShell
        scrollBehavior="page"
        title="Livraison"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Livraisons", href: "/admin/commerce/shipping" },
          { label: "Configuration" },
        ]}
        showBreadcrumbsInContent={false}
        showTitleInContent={false}
        contentPreset="form"
      >
        <ShippingRouteNav />
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground">Boutique introuvable.</p>
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Livraison"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Livraisons", href: "/admin/commerce/shipping" },
        { label: "Configuration" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="form"
    >
      <ShippingRouteNav />
      <div className="space-y-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
            Réglages
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            Réglages de livraison
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Frais de livraison standard et seuil de livraison offerte.
          </p>
        </div>

        <ShippingSettingsForm settings={settings} />
      </div>
    </AdminPageShell>
  );
}

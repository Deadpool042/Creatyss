import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { ShippingRouteNav } from "@/features/admin/commerce/shipping/shared/components/shipping-route-nav";
import { ShippingSettingsForm } from "@/features/admin/settings/components/shipping-settings-form";
import { ShippingZonesManager } from "@/features/admin/settings/components/shipping-zones-manager";
import { getAdminShippingSettings } from "@/features/admin/settings/queries/get-admin-shipping-settings.query";
import { listAdminShippingZones } from "@/features/admin/settings/queries/list-admin-shipping-zones.query";

function getShippingZoneErrorMessage(code: string): string {
  switch (code) {
    case "duplicate_code":
      return "Une zone ou méthode avec ce code existe déjà.";
    case "invalid_input":
      return "Formulaire invalide — vérifiez les champs.";
    case "missing_store":
    case "not_found":
    case "zone_not_found":
      return "Zone ou méthode introuvable.";
    case "invalid_transition":
      return "Cette transition de statut n'est pas autorisée.";
    default:
      return "L'opération a échoué.";
  }
}

type AdminCommerceShippingSettingsPageProps = Readonly<{
  searchParams: Promise<{
    sz_created?: string;
    sz_updated?: string;
    sz_error?: string;
    sm_created?: string;
    sm_updated?: string;
    sm_error?: string;
  }>;
}>;

export default async function AdminCommerceShippingSettingsPage({
  searchParams,
}: AdminCommerceShippingSettingsPageProps) {
  await requireAdminCapability("admin.settings.shipping.read");
  const [settings, zonesData, resolvedSearchParams] = await Promise.all([
    getAdminShippingSettings(),
    listAdminShippingZones(),
    searchParams,
  ]);

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

  const zoneOrMethodError = resolvedSearchParams.sz_error ?? resolvedSearchParams.sm_error;
  const zoneOrMethodCreated = resolvedSearchParams.sz_created ?? resolvedSearchParams.sm_created;
  const zoneOrMethodUpdated = resolvedSearchParams.sz_updated ?? resolvedSearchParams.sm_updated;

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

        {zoneOrMethodCreated ? (
          <div className="rounded-xl border border-feedback-success-border bg-feedback-success-surface/60 px-4 py-2.5 text-sm text-feedback-success-foreground">
            Créé avec succès.
          </div>
        ) : null}
        {zoneOrMethodUpdated ? (
          <div className="rounded-xl border border-feedback-success-border bg-feedback-success-surface/60 px-4 py-2.5 text-sm text-feedback-success-foreground">
            Mis à jour.
          </div>
        ) : null}
        {zoneOrMethodError ? (
          <div className="rounded-xl border border-feedback-error-border bg-feedback-error-surface/60 px-4 py-2.5 text-sm text-feedback-error-foreground">
            {getShippingZoneErrorMessage(zoneOrMethodError)}
          </div>
        ) : null}

        <ShippingSettingsForm settings={settings} />

        {zonesData ? <ShippingZonesManager data={zonesData} /> : null}
      </div>
    </AdminPageShell>
  );
}

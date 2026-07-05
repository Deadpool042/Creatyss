import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { CatalogRouteNav } from "@/features/admin/catalog/components/catalog-route-nav";
import { listAdminFeatureFlags } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { CatalogSettingsHub } from "@/features/admin/settings/components/catalog-settings-hub";

export const dynamic = "force-dynamic";

const RELATED_FLAG_KEY = "catalog.products.related";

export default async function AdminCatalogSettingsPage() {
  await requireAdminCapability("admin.settings.catalog.read");

  const [
    flags,
    pricingPriceLists,
    pricingScheduledPricing,
    mediaOptimization,
    mediaGeneration,
    mediaAutomation,
    relatedStorefront,
    relatedManage,
  ] = await Promise.all([
    listAdminFeatureFlags().catch((): Awaited<ReturnType<typeof listAdminFeatureFlags>> => [] as const),
    meetsFeatureLevel("catalog.products.pricing", "price-lists").catch(() => false),
    meetsFeatureLevel("catalog.products.pricing", "scheduled-pricing").catch(() => false),
    meetsFeatureLevel("catalog.products.media", "optimization").catch(() => false),
    meetsFeatureLevel("catalog.products.media", "generation").catch(() => false),
    meetsFeatureLevel("catalog.products.media", "automation").catch(() => false),
    meetsFeatureLevel("catalog.products.related", "storefront").catch(() => false),
    meetsFeatureLevel("catalog.products.related", "manage").catch(() => false),
  ]);

  const relatedFlag = flags.find((f) => f.key === RELATED_FLAG_KEY) ?? null;

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Configuration catalogue"
      contentPreset="table"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Catalogue", href: "/admin/catalog/overview" },
        { label: "Configuration" },
      ]}
    >
      <CatalogRouteNav />
      <CatalogSettingsHub
        relatedFlag={relatedFlag}
        pricing={{
          priceLists: pricingPriceLists,
          scheduledPricing: pricingScheduledPricing,
        }}
        media={{
          optimization: mediaOptimization,
          generation: mediaGeneration,
          automation: mediaAutomation,
        }}
        relatedProducts={{
          storefront: relatedStorefront,
          manage: relatedManage,
        }}
      />
    </AdminPageShell>
  );
}

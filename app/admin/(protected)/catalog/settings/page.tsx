import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { listAdminFeatureFlags } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import { CatalogRelatedProductsSection } from "@/features/admin/settings/components/catalog-related-products-section";

export const dynamic = "force-dynamic";

const RELATED_FLAG_KEY = "catalog.products.related";

export default async function AdminCatalogSettingsPage() {
  await requireAdminCapability("admin.settings.catalog.read");

  let flags: Awaited<ReturnType<typeof listAdminFeatureFlags>> = [] as const;

  try {
    flags = await listAdminFeatureFlags();
  } catch {
    // Table non disponible — état fallback
  }

  const relatedFlag = flags.find((f) => f.key === RELATED_FLAG_KEY) ?? null;

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Configuration catalogue"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Catalogue", href: "/admin/catalog/overview" },
        { label: "Configuration" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <div className="space-y-4 px-1">
        <CatalogRelatedProductsSection flag={relatedFlag} />
      </div>
    </AdminPageShell>
  );
}

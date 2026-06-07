import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { listAdminFeatureFlags } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import { CatalogRelatedProductsSection } from "@/features/admin/settings/components/catalog-related-products-section";

export const dynamic = "force-dynamic";

const RELATED_FLAG_KEY = "catalog.products.related";

export default async function AdminSettingsCatalogPage() {
  let flags: Awaited<ReturnType<typeof listAdminFeatureFlags>> = [] as const;

  try {
    flags = await listAdminFeatureFlags();
  } catch {
    // Table non disponible — état fallback
  }

  const relatedFlag =
    flags.find((f) => f.key === RELATED_FLAG_KEY) ?? null;

  return (
    <AdminPageShell
      scrollMode="area"
      title="Catalogue"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Réglages" },
        { label: "Catalogue" },
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

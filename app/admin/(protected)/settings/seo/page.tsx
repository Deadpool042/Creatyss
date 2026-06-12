import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { getUploadsPublicPath } from "@/core/uploads";
import { listAdminMediaAssets, type AdminMediaListItem } from "@/features/admin/media";
import { SeoSettingsForm } from "@/features/admin/settings/components/seo-settings-form";
import { getAdminSeoSettings } from "@/features/admin/settings/queries/get-seo-settings.query";

export const dynamic = "force-dynamic";

export default async function AdminSettingsSeoPage() {
  await requireAdminCapability("admin.settings.seo.read");

  let seo = null;
  let assets: AdminMediaListItem[] = [];

  try {
    [seo, assets] = await Promise.all([getAdminSeoSettings(), listAdminMediaAssets()]);
  } catch {
    // DB non disponible ou table absente — état vide
  }

  const uploadsPublicPath = getUploadsPublicPath();

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="SEO"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Réglages" },
        { label: "SEO" },
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
            SEO global
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Métadonnées et paramètres d'indexation appliqués à la page d'accueil de la boutique.
          </p>
        </div>

        <SeoSettingsForm seo={seo} assets={assets} uploadsPublicPath={uploadsPublicPath} />
      </div>
    </AdminPageShell>
  );
}

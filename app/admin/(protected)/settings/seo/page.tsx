import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
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
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Réglages" }, { label: "SEO" }]}
      showTitleInContent={false}
      contentPreset="form"
      header={
        <AdminPageHeader
          eyebrow="Réglages"
          title="SEO global"
          description="Métadonnées et paramètres d'indexation appliqués à la page d'accueil de la boutique."
        />
      }
    >
      <div className="space-y-8">
        <SeoSettingsForm seo={seo} assets={assets} uploadsPublicPath={uploadsPublicPath} />
      </div>
    </AdminPageShell>
  );
}

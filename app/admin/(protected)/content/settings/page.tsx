import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { ContentRouteNav } from "@/features/admin/content/components/content-route-nav";
import { ContentSettingsHub } from "@/features/admin/settings/components/content-settings-hub";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export const dynamic = "force-dynamic";

export default async function AdminContentSettingsPage() {
  const [blogDraft, blogPublish] = await Promise.all([
    meetsFeatureLevel("content.blog", "draft").catch(() => false),
    meetsFeatureLevel("content.blog", "publish").catch(() => false),
  ]);

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Configuration contenu"
      contentPreset="table"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Contenu", href: "/admin/content/overview" },
        { label: "Configuration" },
      ]}
      showTitleInContent={false}
      header={
        <AdminPageHeader
          eyebrow="Contenu"
          title="Configuration contenu"
          description="Niveaux activés sur le blog : brouillons et publication."
        />
      }
    >
      <ContentRouteNav />
      <ContentSettingsHub blog={{ draft: blogDraft, publish: blogPublish }} />
    </AdminPageShell>
  );
}

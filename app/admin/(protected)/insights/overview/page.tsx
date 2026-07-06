import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { db } from "@/core/db";
import { adminNavigationItems } from "@/features/admin/navigation";
import {
  getAdminNavigationContext,
  hasAdminNavigationAccess,
} from "@/features/admin/navigation/server";
import { InsightsRouteNav } from "@/features/admin/insights/components/insights-route-nav";
import { InsightsOverviewSections } from "@/features/admin/insights/components/insights-overview-sections";

export default async function AdminInsightsOverviewPage() {
  const admin = await requireAuthenticatedAdmin();

  const navigationContext = await getAdminNavigationContext({
    db,
    admin: { id: admin.id, email: admin.email },
  });

  const cards = adminNavigationItems
    .filter((item) => item.group === "insights" && item.key !== "insights-overview")
    .filter((item) => hasAdminNavigationAccess(item, navigationContext))
    .sort((a, b) => a.order - b.order);

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Pilotage"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Pilotage" },
        { label: "Vue d'ensemble" },
      ]}
      showTitleInContent={false}
      contentPreset="overview"
      header={
        <AdminPageHeader
          eyebrow="Pilotage"
          title="Vue d'ensemble"
          description="Accédez aux analyses commerce et trafic activées sur votre boutique."
        />
      }
    >
      <InsightsRouteNav />
      <InsightsOverviewSections cards={cards} />
    </AdminPageShell>
  );
}

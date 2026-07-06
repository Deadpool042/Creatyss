import { BarChart3 } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminFeatureDisabledState } from "@/components/admin/shared/admin-feature-disabled-state";
import { AnalyticsOverviewSections } from "@/features/admin/insights/components/analytics-overview-sections";
import { InsightsRouteNav } from "@/features/admin/insights/components/insights-route-nav";
import { getCommerceAnalyticsInsights } from "@/features/admin/insights/queries/get-commerce-analytics-insights.query";
import { getCommerceAnalyticsRecommendations } from "@/features/admin/insights/queries/get-commerce-analytics-recommendations.query";
import { getDailyTrafficAnalytics } from "@/features/admin/insights/queries/get-daily-traffic-analytics.query";
import { isAnalyticsFeatureActive } from "@/features/admin/insights/queries/is-analytics-feature-active.query";
import { getMonthlyCommerceAnalytics } from "@/features/admin/insights/queries/get-monthly-commerce-analytics.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export default async function AdminInsightsAnalyticsPage() {
  const featureActive = await isAnalyticsFeatureActive();
  const analyticsHeader = (
    <AdminPageHeader
      eyebrow="Pilotage"
      title="Analytics"
      description="Lecture des métriques commerce et trafic, selon le niveau activé sur le module analytics."
    />
  );

  if (!featureActive) {
    return (
      <AdminPageShell
        scrollBehavior="page"
        title="Analytics"
        contentPreset="overview"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Pilotage" },
          { label: "Analytics" },
        ]}
        showTitleInContent={false}
        header={analyticsHeader}
      >
        <InsightsRouteNav />
        <AdminFeatureDisabledState
          capabilityName="Analytics"
          description="Cette capacité est pilotée dans les Réglages avancés. Activez le niveau requis sur engagement.analytics pour ouvrir les statistiques."
          icon={BarChart3}
        />
      </AdminPageShell>
    );
  }

  const [
    monthlyLevelMet,
    insightsLevelMet,
    recommendationsLevelMet,
    monthlyCommerceAnalytics,
    commerceInsights,
    commerceRecommendations,
    dailyTrafficAnalytics,
  ] = await Promise.all([
    meetsFeatureLevel("engagement.analytics", "read"),
    meetsFeatureLevel("engagement.analytics", "insights"),
    meetsFeatureLevel("engagement.analytics", "recommendations"),
    getMonthlyCommerceAnalytics(),
    getCommerceAnalyticsInsights(),
    getCommerceAnalyticsRecommendations(),
    getDailyTrafficAnalytics(),
  ]);

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Analytics"
      contentPreset="overview"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Pilotage" },
        { label: "Analytics" },
      ]}
      showTitleInContent={false}
      header={analyticsHeader}
    >
      <InsightsRouteNav />
      <AnalyticsOverviewSections
        monthly={monthlyLevelMet ? monthlyCommerceAnalytics : null}
        insights={insightsLevelMet ? commerceInsights : null}
        recommendations={recommendationsLevelMet ? commerceRecommendations : null}
        daily={monthlyLevelMet ? dailyTrafficAnalytics : null}
      />
    </AdminPageShell>
  );
}

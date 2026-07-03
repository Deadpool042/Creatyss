import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AnalyticsOverviewSections } from "@/features/admin/insights/components/analytics-overview-sections";
import { getCommerceAnalyticsInsights } from "@/features/admin/insights/queries/get-commerce-analytics-insights.query";
import { getCommerceAnalyticsRecommendations } from "@/features/admin/insights/queries/get-commerce-analytics-recommendations.query";
import { getDailyTrafficAnalytics } from "@/features/admin/insights/queries/get-daily-traffic-analytics.query";
import { isAnalyticsFeatureActive } from "@/features/admin/insights/queries/is-analytics-feature-active.query";
import { getMonthlyCommerceAnalytics } from "@/features/admin/insights/queries/get-monthly-commerce-analytics.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export default async function AdminInsightsAnalyticsPage() {
  const featureActive = await isAnalyticsFeatureActive();
  if (!featureActive) notFound();

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
        { label: "Insights" },
        { label: "Analytics" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AnalyticsOverviewSections
        monthly={monthlyLevelMet ? monthlyCommerceAnalytics : null}
        insights={insightsLevelMet ? commerceInsights : null}
        recommendations={recommendationsLevelMet ? commerceRecommendations : null}
        daily={monthlyLevelMet ? dailyTrafficAnalytics : null}
      />
    </AdminPageShell>
  );
}

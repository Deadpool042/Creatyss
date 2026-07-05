import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { MarketingSettingsHub } from "@/features/admin/settings/components/marketing-settings-hub";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export const dynamic = "force-dynamic";

export default async function AdminMarketingSettingsPage() {
  const [
    discountsSimple,
    discountsRules,
    discountsAutomation,
    newsletterBasic,
    newsletterSegmentation,
    automationsActive,
  ] = await Promise.all([
    meetsFeatureLevel("commerce.discounts", "simple").catch(() => false),
    meetsFeatureLevel("commerce.discounts", "rules").catch(() => false),
    meetsFeatureLevel("commerce.discounts", "automation").catch(() => false),
    meetsFeatureLevel("engagement.newsletter", "basic").catch(() => false),
    meetsFeatureLevel("engagement.newsletter", "segmentation").catch(() => false),
    meetsFeatureLevel("engagement.automations", "basic").catch(() => false),
  ]);

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Configuration marketing"
      contentPreset="table"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Marketing", href: "/admin/marketing/overview" },
        { label: "Configuration" },
      ]}
    >
      <MarketingSettingsHub
        discounts={{
          simple: discountsSimple,
          rules: discountsRules,
          automation: discountsAutomation,
        }}
        newsletter={{
          basic: newsletterBasic,
          segmentation: newsletterSegmentation,
        }}
        automationsActive={automationsActive}
      />
    </AdminPageShell>
  );
}

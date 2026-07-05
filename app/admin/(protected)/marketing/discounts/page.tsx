import { notFound } from "next/navigation";
import { Percent } from "lucide-react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { AdminDataTableFeedbackBanner } from "@/components/admin/tables/layout/admin-data-table-feedback-banner";
import { listDiscountTargetOptions } from "@/features/admin/marketing/discounts/queries/list-discount-target-options.query";
import { isDiscountsFeatureActive } from "@/features/admin/marketing/queries/is-discounts-feature-active.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { listAdminDiscounts } from "@/features/admin/marketing/discounts/queries/list-admin-discounts.query";
import { AdminDiscountsPanel } from "@/features/admin/marketing/discounts/components/admin-discounts-panel";

export const dynamic = "force-dynamic";

type AdminMarketingDiscountsPageProps = Readonly<{
  searchParams: Promise<{
    discount_created?: string;
    discount_error?: string;
  }>;
}>;

function getErrorMessage(code: string): string {
  switch (code) {
    case "duplicate_code":
      return "Ce code promo existe déjà.";
    case "automation_unavailable":
      return "Le niveau actuel n'autorise pas encore les remises automatiques.";
    case "rules_unavailable":
      return "Le niveau actuel n'autorise pas encore les remises avancées ciblées.";
    case "invalid_input":
      return "Formulaire invalide — vérifiez les champs.";
    case "missing_store":
      return "Aucune boutique trouvée.";
    default:
      return "La création de la remise a échoué.";
  }
}

export default async function AdminMarketingDiscountsPage({
  searchParams,
}: AdminMarketingDiscountsPageProps) {
  const featureActive = await isDiscountsFeatureActive();
  if (!featureActive) notFound();

  const simpleLevelMet = await meetsFeatureLevel("commerce.discounts", "simple");
  const rulesLevelMet = await meetsFeatureLevel("commerce.discounts", "rules");
  const automationLevelMet = await meetsFeatureLevel("commerce.discounts", "automation");

  if (!simpleLevelMet) {
    return (
      <AdminPageShell
        scrollBehavior="page"
        title="Codes promo"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Marketing", href: "/admin/marketing/overview" },
          { label: "Réductions" },
        ]}
        showTitleInContent={false}
      >
        <AdminComingSoon
          title="Codes promo"
          description="Créez des codes de réduction, planifiez des promotions automatiques et définissez les conditions d'application sur le catalogue ou le panier."
          docRef="docs/domains/satellites/discounts.md"
          requirements={["Niveau requis : simple", "Capability : marketing.discountsRead"]}
          icon={Percent}
        />
      </AdminPageShell>
    );
  }

  const [discounts, targetOptions, resolvedSearchParams] = await Promise.all([
    listAdminDiscounts(),
    listDiscountTargetOptions(),
    searchParams,
  ]);

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Codes promo"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Marketing", href: "/admin/marketing/overview" },
        { label: "Réductions" },
      ]}
      showTitleInContent={false}
      contentPreset="table"
    >
      <div className="grid gap-6">
        <AdminDataTableFeedbackBanner
          message={
            resolvedSearchParams.discount_created
              ? automationLevelMet
                ? "Remise créée."
                : "Code promo créé."
              : null
          }
        />
        <AdminDataTableFeedbackBanner
          message={
            resolvedSearchParams.discount_error
              ? getErrorMessage(resolvedSearchParams.discount_error)
              : null
          }
          tone="error"
        />

        <AdminDiscountsPanel
          discounts={discounts}
          automationEnabled={automationLevelMet}
          rulesEnabled={rulesLevelMet}
          products={targetOptions.products}
          variants={targetOptions.variants}
          categories={targetOptions.categories}
          errorMessage={
            resolvedSearchParams.discount_error
              ? getErrorMessage(resolvedSearchParams.discount_error)
              : null
          }
        />
      </div>
    </AdminPageShell>
  );
}

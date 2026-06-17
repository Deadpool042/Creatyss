import { notFound } from "next/navigation";
import { Percent } from "lucide-react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { AdminDataTableFeedbackBanner } from "@/components/admin/tables/layout/admin-data-table-feedback-banner";
import { listDiscountTargetOptions } from "@/features/admin/marketing/discounts/queries/list-discount-target-options.query";
import { isDiscountsFeatureActive } from "@/features/admin/marketing/queries/is-discounts-feature-active.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { listAdminDiscounts } from "@/features/admin/marketing/discounts/queries/list-admin-discounts.query";
import { AdminDiscountsList } from "@/features/admin/marketing/discounts/components/admin-discounts-list";
import { AdminDiscountCreateForm } from "@/features/admin/marketing/discounts/components/admin-discount-create-form";

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
        showBreadcrumbsInContent={false}
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
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="table"
    >
      <div className="grid gap-6">
        <AdminDataTableFeedbackBanner
          message={resolvedSearchParams.discount_created ? (automationLevelMet ? "Remise créée." : "Code promo créé.") : null}
        />
        <AdminDataTableFeedbackBanner
          message={
            resolvedSearchParams.discount_error
              ? getErrorMessage(resolvedSearchParams.discount_error)
              : null
          }
          tone="error"
        />

        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-foreground">
            {automationLevelMet ? "Nouvelle remise" : "Nouveau code promo"}
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">
            {automationLevelMet
              ? "Pourcentage ou montant fixe, applicable au panier ou à une sélection catalogue. Une remise peut rester manuelle ou devenir automatique au checkout."
              : "Pourcentage ou montant fixe, applicable au panier. Les remises automatiques et le ciblage catalogue nécessitent des niveaux supérieurs."}
          </p>
          <AdminDiscountCreateForm
            automationEnabled={automationLevelMet}
            rulesEnabled={rulesLevelMet}
            products={targetOptions.products}
            variants={targetOptions.variants}
            categories={targetOptions.categories}
          />
        </section>

        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
            Codes promo
          </h2>
          <AdminDiscountsList discounts={discounts} />
        </section>
      </div>
    </AdminPageShell>
  );
}

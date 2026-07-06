import { Percent } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminFeatureDisabledState } from "@/components/admin/shared/admin-feature-disabled-state";
import { AdminDataTableFeedbackBanner } from "@/components/admin/tables/layout/admin-data-table-feedback-banner";
import { CommerceRouteNav } from "@/features/admin/commerce/components/commerce-route-nav";
import { isTaxationFeatureActive } from "@/features/admin/commerce/taxation/queries/is-taxation-feature-active.query";
import { listAdminTaxRules } from "@/features/admin/commerce/taxation/queries/list-admin-tax-rules.query";
import { AdminTaxRulesPanel } from "@/features/admin/commerce/taxation/components/admin-tax-rules-panel";

export const dynamic = "force-dynamic";

type AdminCommerceTaxationPageProps = Readonly<{
  searchParams: Promise<{ tax_created?: string; tax_error?: string }>;
}>;

function getTaxErrorMessage(code: string): string {
  switch (code) {
    case "duplicate_code":
      return "Une règle avec ce code existe déjà.";
    case "invalid_input":
      return "Formulaire invalide — vérifiez les champs.";
    case "missing_store":
      return "Aucune boutique trouvée.";
    default:
      return "La création de la règle a échoué.";
  }
}

export default async function AdminCommerceTaxationPage({
  searchParams,
}: AdminCommerceTaxationPageProps) {
  const featureActive = await isTaxationFeatureActive();
  const taxationHeader = (
    <AdminPageHeader
      eyebrow="Commerce"
      title="TVA"
      description="Règles de taux par territoire de livraison, selon le niveau activé sur commerce.taxation."
    />
  );

  if (!featureActive) {
    return (
      <AdminPageShell
        scrollBehavior="page"
        title="TVA"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Commerce", href: "/admin/commerce/overview" },
          { label: "TVA" },
        ]}
        showTitleInContent={false}
        contentPreset="table"
        header={taxationHeader}
      >
        <CommerceRouteNav />
        <AdminFeatureDisabledState
          capabilityName="TVA"
          description="Cette capacité est pilotée dans les Réglages avancés. Activez le niveau requis sur commerce.taxation pour ouvrir les règles de TVA."
          icon={Percent}
        />
      </AdminPageShell>
    );
  }

  const [rules, resolvedSearchParams] = await Promise.all([listAdminTaxRules(), searchParams]);

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="TVA"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Commerce", href: "/admin/commerce/overview" },
        { label: "TVA" },
      ]}
      showTitleInContent={false}
      contentPreset="table"
      header={taxationHeader}
    >
      <CommerceRouteNav />
      <div className="grid gap-6">
        <AdminDataTableFeedbackBanner
          message={resolvedSearchParams.tax_created ? "Règle de TVA créée." : null}
        />
        <AdminDataTableFeedbackBanner
          message={
            resolvedSearchParams.tax_error
              ? getTaxErrorMessage(resolvedSearchParams.tax_error)
              : null
          }
          tone="error"
        />

        <AdminTaxRulesPanel
          rules={rules}
          errorMessage={
            resolvedSearchParams.tax_error
              ? getTaxErrorMessage(resolvedSearchParams.tax_error)
              : null
          }
        />
      </div>
    </AdminPageShell>
  );
}

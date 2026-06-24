import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { isTaxationFeatureActive } from "@/features/admin/commerce/taxation/queries/is-taxation-feature-active.query";
import { listAdminTaxRules } from "@/features/admin/commerce/taxation/queries/list-admin-tax-rules.query";
import { AdminTaxRulesList } from "@/features/admin/commerce/taxation/components/admin-tax-rules-list";
import { AdminTaxRuleCreateForm } from "@/features/admin/commerce/taxation/components/admin-tax-rule-create-form";
import { AdminTaxRulesImport } from "@/features/admin/commerce/taxation/components/admin-tax-rules-import";

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
  if (!featureActive) notFound();

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
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="table"
    >
      <div className="grid gap-6">
        {resolvedSearchParams.tax_created ? (
          <p className="rounded-lg border border-feedback-success-border bg-feedback-success-surface px-3 py-2 text-sm text-feedback-success-foreground">
            Règle de TVA créée.
          </p>
        ) : null}
        {resolvedSearchParams.tax_error ? (
          <p className="rounded-lg border border-feedback-error-border bg-feedback-error-surface px-3 py-2 text-sm text-feedback-error-foreground">
            {getTaxErrorMessage(resolvedSearchParams.tax_error)}
          </p>
        ) : null}

        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-foreground">
            Nouvelle règle
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Taux standard par territoire (scope boutique, prix TTC). Les taux réduits par catégorie
            viendront ultérieurement.
          </p>
          <AdminTaxRuleCreateForm />
        </section>

        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-foreground">Import CSV</h2>
          <AdminTaxRulesImport />
        </section>

        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-foreground">
            Règles de TVA
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Taux appliqués par territoire de livraison. Guyane et Mayotte sont exonérées (traitées
            automatiquement). Les taux doivent être validés par votre expert-comptable.
          </p>
          <AdminTaxRulesList rules={rules} />
        </section>
      </div>
    </AdminPageShell>
  );
}

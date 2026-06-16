import { notFound } from "next/navigation";
import { Percent } from "lucide-react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
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

  const [discounts, resolvedSearchParams] = await Promise.all([listAdminDiscounts(), searchParams]);

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
        {resolvedSearchParams.discount_created ? (
          <p className="rounded-lg border border-feedback-success-border bg-feedback-success-surface px-3 py-2 text-sm text-feedback-success-foreground">
            {automationLevelMet ? "Remise créée." : "Code promo créé."}
          </p>
        ) : null}
        {resolvedSearchParams.discount_error ? (
          <p className="rounded-lg border border-feedback-error-border bg-feedback-error-surface px-3 py-2 text-sm text-feedback-error-foreground">
            {getErrorMessage(resolvedSearchParams.discount_error)}
          </p>
        ) : null}

        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-foreground">
            {automationLevelMet ? "Nouvelle remise" : "Nouveau code promo"}
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">
            {automationLevelMet
              ? "Pourcentage ou montant fixe, applicable au total de la commande. Une remise peut rester manuelle ou devenir automatique au checkout."
              : "Pourcentage ou montant fixe, applicable au total de la commande. Le code n'a d'effet au checkout qu'à partir du niveau « rules »."}
          </p>
          <AdminDiscountCreateForm automationEnabled={automationLevelMet} />
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

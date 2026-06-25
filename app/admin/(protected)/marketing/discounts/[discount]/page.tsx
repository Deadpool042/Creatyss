import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminDataTableFeedbackBanner } from "@/components/admin/tables/layout/admin-data-table-feedback-banner";
import { Badge } from "@/components/ui/badge";
import { AdminDiscountCodeCreateForm } from "@/features/admin/marketing/discounts/components/admin-discount-code-create-form";
import { AdminDiscountCodesList } from "@/features/admin/marketing/discounts/components/admin-discount-codes-list";
import { AdminDiscountPriorityForm } from "@/features/admin/marketing/discounts/components/admin-discount-priority-form";
import { AdminDiscountRedemptionsTable } from "@/features/admin/marketing/discounts/components/admin-discount-redemptions-table";
import { getAdminDiscountDetail } from "@/features/admin/marketing/discounts/queries/get-admin-discount-detail.query";
import { listDiscountRedemptions } from "@/features/admin/marketing/discounts/queries/list-discount-redemptions.query";
import { ADMIN_DISCOUNTS_PATH } from "@/features/admin/marketing/discounts/shared/admin-discounts-routes";
import { isDiscountsFeatureActive } from "@/features/admin/marketing/queries/is-discounts-feature-active.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export const dynamic = "force-dynamic";

type AdminDiscountDetailPageProps = Readonly<{
  params: Promise<{
    discount: string;
  }>;
  searchParams: Promise<{
    code_created?: string;
    code_error?: string;
    page?: string;
  }>;
}>;

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDateTime(value: Date | null): string {
  return value === null ? "Non planifie" : dateFormatter.format(value);
}

function formatMoney(value: number, currencyCode: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}

function getDiscountStatusLabel(status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | "DRAFT"): string {
  switch (status) {
    case "ACTIVE":
      return "Actif";
    case "INACTIVE":
      return "Inactif";
    case "ARCHIVED":
      return "Archive";
    case "DRAFT":
    default:
      return "Brouillon";
  }
}

function getDiscountTypeLabel(type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING"): string {
  switch (type) {
    case "PERCENTAGE":
      return "Pourcentage";
    case "FIXED_AMOUNT":
      return "Montant fixe";
    case "FREE_SHIPPING":
    default:
      return "Livraison offerte";
  }
}

function getScopeLabel(scopeType: string): string {
  switch (scopeType) {
    case "PRODUCT":
      return "Produits cibles";
    case "PRODUCT_VARIANT":
      return "Variantes cibles";
    case "CATEGORY":
      return "Categories cibles";
    case "ORDER":
    default:
      return "Commande complete";
  }
}

function getDiscountValueLabel(input: {
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  percentageValue: number | null;
  fixedAmountValue: number | null;
  currencyCode: string | null;
}): string {
  if (input.type === "PERCENTAGE") {
    return `${input.percentageValue ?? 0} %`;
  }

  if (input.type === "FIXED_AMOUNT") {
    return input.fixedAmountValue !== null && input.currencyCode !== null
      ? formatMoney(input.fixedAmountValue, input.currencyCode)
      : "Montant fixe";
  }

  return "Livraison offerte";
}

function getCodeErrorMessage(code: string): string {
  switch (code) {
    case "duplicate_code":
      return "Ce code secondaire existe deja pour cette remise.";
    case "invalid_input":
      return "Le formulaire code secondaire est invalide.";
    case "rules_unavailable":
      return "Le niveau actuel n'autorise pas les codes secondaires.";
    case "create_failed":
      return "La creation du code secondaire a echoue.";
    default:
      return "Une erreur est survenue lors de la gestion des codes secondaires.";
  }
}

function DetailMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-1 border-b border-surface-border-subtle px-5 py-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function DefinitionList({
  items,
}: {
  items: ReadonlyArray<{
    label: string;
    value: string;
  }>;
}) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="grid gap-1 rounded-2xl border border-surface-border/60 bg-surface-panel/40 p-4">
          <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{item.label}</dt>
          <dd className="text-sm text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function AdminDiscountDetailPage({
  params,
  searchParams,
}: AdminDiscountDetailPageProps) {
  const [{ discount: discountId }, resolvedSearchParams] = await Promise.all([params, searchParams]);

  const featureActive = await isDiscountsFeatureActive();
  if (!featureActive) {
    notFound();
  }

  const simpleLevelMet = await meetsFeatureLevel("commerce.discounts", "simple");
  if (!simpleLevelMet) {
    notFound();
  }

  const rulesLevelMet = await meetsFeatureLevel("commerce.discounts", "rules");
  const automationLevelMet = await meetsFeatureLevel("commerce.discounts", "automation");

  const pageNumberRaw = Number.parseInt(resolvedSearchParams.page ?? "1", 10);
  const pageNumber = Number.isFinite(pageNumberRaw) && pageNumberRaw > 0 ? pageNumberRaw : 1;

  const [discount, redemptions] = await Promise.all([
    getAdminDiscountDetail(discountId),
    listDiscountRedemptions(discountId, pageNumber),
  ]);

  if (discount === null) {
    notFound();
  }

  return (
    <AdminPageShell
      title={discount.name}
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Marketing", href: "/admin/marketing/overview" },
        { label: "Reductions", href: ADMIN_DISCOUNTS_PATH },
        { label: discount.code },
      ]}
      showBreadcrumbsInContent={false}
      contentPreset="detail"
    >
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Reductions"
          title={discount.name}
          description={
            discount.description ??
            "Vue detail de la remise : statut, valeur, limites, codes secondaires et historique d'utilisation."
          }
          mobileHidden={false}
        />

        <AdminDataTableFeedbackBanner
          message={resolvedSearchParams.code_created ? "Code secondaire cree." : null}
        />
        <AdminDataTableFeedbackBanner
          message={
            resolvedSearchParams.code_error
              ? getCodeErrorMessage(resolvedSearchParams.code_error)
              : null
          }
          tone="error"
        />

        <section className="overflow-hidden rounded-[28px] border border-surface-border bg-surface-panel shadow-card">
          <div className="grid gap-0 md:grid-cols-4">
            <DetailMetric label="Code principal" value={discount.code} />
            <DetailMetric label="Type" value={getDiscountTypeLabel(discount.type)} />
            <DetailMetric label="Valeur" value={getDiscountValueLabel(discount)} />
            <DetailMetric label="Utilisations" value={String(discount.redemptionsCount)} />
          </div>
        </section>

        <section className="rounded-[28px] border border-surface-border bg-surface-panel p-6 shadow-card">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge variant={discount.status === "ACTIVE" ? "secondary" : "outline"}>
              {getDiscountStatusLabel(discount.status)}
            </Badge>
            <Badge variant="outline">
              {discount.isAutomatic ? "Remise automatique" : "Code manuel"}
            </Badge>
            <Badge variant="outline">{getScopeLabel(discount.scopeType)}</Badge>
            {discount.codesCount > 0 ? (
              <Badge variant="outline">
                {discount.codesCount} code{discount.codesCount > 1 ? "s" : ""} secondaire
                {discount.codesCount > 1 ? "s" : ""}
              </Badge>
            ) : null}
          </div>

          <DefinitionList
            items={[
              { label: "Debut", value: formatDateTime(discount.startsAt) },
              { label: "Fin", value: formatDateTime(discount.endsAt) },
              {
                label: "Limite totale",
                value:
                  discount.maxRedemptions !== null ? String(discount.maxRedemptions) : "Illimitee",
              },
              {
                label: "Limite par code",
                value:
                  discount.maxRedemptionsPerCode !== null
                    ? String(discount.maxRedemptionsPerCode)
                    : "Aucune",
              },
              {
                label: "Limite par client",
                value:
                  discount.maxRedemptionsPerUser !== null
                    ? String(discount.maxRedemptionsPerUser)
                    : "Aucune",
              },
              { label: "Creation", value: formatDateTime(discount.createdAt) },
            ]}
          />
        </section>

        <section className="rounded-[28px] border border-surface-border bg-surface-panel p-6 shadow-card">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Priorite</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                La priorite n'est exploitee que pour les remises automatiques.
              </p>
            </div>
          </div>

          {discount.isAutomatic ? (
            automationLevelMet ? (
              <AdminDiscountPriorityForm
                discountId={discount.id}
                currentPriority={discount.priority}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Priorite actuelle : {discount.priority}. Le niveau automation est requis pour la modifier.
              </p>
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              Priorite actuelle : {discount.priority}. Cette remise n'est pas automatique.
            </p>
          )}
        </section>

        <section className="rounded-[28px] border border-surface-border bg-surface-panel p-6 shadow-card">
          <div className="mb-5">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Codes associes</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Codes secondaires relies a cette remise, avec leur statut et leur limite d'utilisation.
            </p>
          </div>

          {rulesLevelMet ? (
            <div className="space-y-6">
              <AdminDiscountCodeCreateForm
                discountId={discount.id}
                maxRedemptionsPerCode={discount.maxRedemptionsPerCode}
              />
              <AdminDiscountCodesList discountId={discount.id} codes={discount.codes} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Le niveau actuel n'autorise pas encore la gestion des codes secondaires.
            </p>
          )}
        </section>

        <section className="rounded-[28px] border border-surface-border bg-surface-panel p-6 shadow-card">
          <div className="mb-5">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Redemptions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Historique des utilisations de la remise, avec commande et cliente si ces donnees existent.
            </p>
          </div>

          <AdminDiscountRedemptionsTable data={redemptions} />
        </section>
      </div>
    </AdminPageShell>
  );
}

import { Mail } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { AdminFeatureDisabledState } from "@/components/admin/shared/admin-feature-disabled-state";
import { MarketingRouteNav } from "@/features/admin/marketing/components/marketing-route-nav";
import { isNewsletterFeatureActive } from "@/features/admin/marketing/queries/is-newsletter-feature-active.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { listAdminNewsletterCampaigns } from "@/features/admin/marketing/newsletter/queries/list-admin-newsletter-campaigns.query";
import { AdminNewsletterCampaignsList } from "@/features/admin/marketing/newsletter/components/admin-newsletter-campaigns-list";
import { AdminNewsletterCampaignCreateForm } from "@/features/admin/marketing/newsletter/components/admin-newsletter-campaign-create-form";

export const dynamic = "force-dynamic";

type AdminNewsletterCampaignsPageProps = Readonly<{
  searchParams: Promise<{
    campaign_created?: string;
    campaign_error?: string;
  }>;
}>;

function getErrorMessage(code: string): string {
  switch (code) {
    case "invalid_input":
      return "Formulaire invalide — vérifiez les champs.";
    case "missing_store":
      return "Aucune boutique trouvée.";
    default:
      return "La création de la campagne a échoué.";
  }
}

export default async function AdminNewsletterCampaignsPage({
  searchParams,
}: AdminNewsletterCampaignsPageProps) {
  const featureActive = await isNewsletterFeatureActive();
  const campaignsHeader = (
    <AdminPageHeader
      eyebrow="Marketing"
      title="Campagnes"
      description="Création et suivi des campagnes email envoyées aux abonnés newsletter."
    />
  );

  if (!featureActive) {
    return (
      <AdminPageShell
        scrollBehavior="page"
        title="Campagnes"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Marketing", href: "/admin/marketing/overview" },
          { label: "Newsletter", href: "/admin/marketing/newsletter" },
          { label: "Campagnes" },
        ]}
        showTitleInContent={false}
        header={campaignsHeader}
      >
        <MarketingRouteNav />
        <AdminFeatureDisabledState
          capabilityName="Campagnes newsletter"
          description="Cette capacité est pilotée dans les Réglages avancés. Activez le niveau requis sur engagement.newsletter pour ouvrir les campagnes."
          icon={Mail}
        />
      </AdminPageShell>
    );
  }

  const basicLevelMet = await meetsFeatureLevel("engagement.newsletter", "basic");

  if (!basicLevelMet) {
    return (
      <AdminPageShell
        scrollBehavior="page"
        title="Campagnes"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Marketing", href: "/admin/marketing/overview" },
          { label: "Newsletter", href: "/admin/marketing/newsletter" },
          { label: "Campagnes" },
        ]}
        showTitleInContent={false}
        header={campaignsHeader}
      >
        <MarketingRouteNav />
        <AdminComingSoon
          title="Campagnes newsletter"
          description="Créez et envoyez des campagnes email à vos abonnés. Suivez les statuts d'envoi par destinataire."
          docRef="docs/domains/cross-cutting/newsletter.md"
          requirements={["Niveau requis : basic", "Feature : engagement.newsletter"]}
          icon={Mail}
        />
      </AdminPageShell>
    );
  }

  const [campaigns, resolvedSearchParams] = await Promise.all([
    listAdminNewsletterCampaigns(),
    searchParams,
  ]);

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Campagnes"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Marketing", href: "/admin/marketing/overview" },
        { label: "Newsletter", href: "/admin/marketing/newsletter" },
        { label: "Campagnes" },
      ]}
      showTitleInContent={false}
      contentPreset="table"
      header={campaignsHeader}
    >
      <MarketingRouteNav />
      <div className="grid gap-6">
        {resolvedSearchParams.campaign_created ? (
          <p className="rounded-lg border border-feedback-success-border bg-feedback-success-surface px-3 py-2 text-sm text-feedback-success-foreground">
            Campagne créée.
          </p>
        ) : null}
        {resolvedSearchParams.campaign_error ? (
          <p className="rounded-lg border border-feedback-error-border bg-feedback-error-surface px-3 py-2 text-sm text-feedback-error-foreground">
            {getErrorMessage(resolvedSearchParams.campaign_error)}
          </p>
        ) : null}

        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-foreground">
            Nouvelle campagne
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Créez un brouillon. L&apos;envoi est déclenché manuellement depuis la liste.
          </p>
          <AdminNewsletterCampaignCreateForm />
        </section>

        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">Campagnes</h2>
          <AdminNewsletterCampaignsList campaigns={campaigns} />
        </section>
      </div>
    </AdminPageShell>
  );
}

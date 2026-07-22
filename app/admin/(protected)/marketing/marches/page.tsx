import { Tag } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminFeatureDisabledState } from "@/components/admin/shared/admin-feature-disabled-state";
import { AdminDataTableFeedbackBanner } from "@/components/admin/tables/layout/admin-data-table-feedback-banner";
import { listAdminPublicEvents } from "@/features/admin/marketing/public-events/queries/list-admin-public-events.query";
import { isPublicEventsFeatureActive } from "@/features/admin/marketing/public-events/queries/is-public-events-feature-active.query";
import { AdminPublicEventsPanel } from "@/features/admin/marketing/public-events/components/admin-public-events-panel";
import { MarketingRouteNav } from "@/features/admin/marketing/components/marketing-route-nav";

export const dynamic = "force-dynamic";

type AdminMarketingPublicEventsPageProps = Readonly<{
  searchParams: Promise<{
    public_event_created?: string;
    public_event_error?: string;
  }>;
}>;

function getErrorMessage(code: string): string {
  switch (code) {
    case "duplicate_slug":
      return "Ce slug de marché existe déjà.";
    case "invalid_input":
      return "Formulaire invalide — vérifiez les champs.";
    case "missing_store":
      return "Aucune boutique trouvée.";
    default:
      return "La création du marché a échoué.";
  }
}

export default async function AdminMarketingPublicEventsPage({
  searchParams,
}: AdminMarketingPublicEventsPageProps) {
  const featureActive = await isPublicEventsFeatureActive();

  const header = (
    <AdminPageHeader
      eyebrow="Marketing"
      title="Marchés"
      description="Gestion des marchés (dates, lieux) affichés en liste chronologique sur la page publique dédiée."
    />
  );

  if (!featureActive) {
    return (
      <AdminPageShell
        scrollBehavior="page"
        title="Marchés"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Marketing", href: "/admin/marketing/overview" },
          { label: "Marchés" },
        ]}
        showTitleInContent={false}
        header={header}
      >
        <MarketingRouteNav />
        <AdminFeatureDisabledState
          capabilityName="Marchés"
          description="Cette capacité est pilotée dans les Réglages avancés. Activez le flag engagement.public-events pour ouvrir la gestion des marchés."
          icon={Tag}
        />
      </AdminPageShell>
    );
  }

  const [publicEvents, resolvedSearchParams] = await Promise.all([
    listAdminPublicEvents(),
    searchParams,
  ]);

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Marchés"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Marketing", href: "/admin/marketing/overview" },
        { label: "Marchés" },
      ]}
      showTitleInContent={false}
      contentPreset="table"
      header={header}
    >
      <MarketingRouteNav />
      <div className="grid gap-6">
        <AdminDataTableFeedbackBanner
          message={resolvedSearchParams.public_event_created ? "Marché créé." : null}
        />
        <AdminDataTableFeedbackBanner
          message={
            resolvedSearchParams.public_event_error
              ? getErrorMessage(resolvedSearchParams.public_event_error)
              : null
          }
          tone="error"
        />

        <AdminPublicEventsPanel publicEvents={publicEvents} />
      </div>
    </AdminPageShell>
  );
}

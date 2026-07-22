import { Tag } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminFeatureDisabledState } from "@/components/admin/shared/admin-feature-disabled-state";
import { AdminDataTableFeedbackBanner } from "@/components/admin/tables/layout/admin-data-table-feedback-banner";
import { AdminPublicEventForm } from "@/features/admin/marketing/public-events/components/admin-public-event-form";
import { createPublicEventAction } from "@/features/admin/marketing/public-events/actions/create-public-event.action";
import { isPublicEventsFeatureActive } from "@/features/admin/marketing/public-events/queries/is-public-events-feature-active.query";
import { ADMIN_PUBLIC_EVENTS_PATH } from "@/features/admin/marketing/public-events/shared/admin-public-events-routes";
import { MarketingRouteNav } from "@/features/admin/marketing/components/marketing-route-nav";

export const dynamic = "force-dynamic";

type AdminNewPublicEventPageProps = Readonly<{
  searchParams: Promise<{
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

export default async function AdminNewPublicEventPage({
  searchParams,
}: AdminNewPublicEventPageProps) {
  const featureActive = await isPublicEventsFeatureActive();

  if (!featureActive) {
    return (
      <AdminPageShell
        title="Marchés"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Marketing", href: "/admin/marketing/overview" },
          { label: "Marchés", href: ADMIN_PUBLIC_EVENTS_PATH },
        ]}
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

  const resolvedSearchParams = await searchParams;

  return (
    <AdminPageShell
      title="Nouveau marché"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Marketing", href: "/admin/marketing/overview" },
        { label: "Marchés", href: ADMIN_PUBLIC_EVENTS_PATH },
        { label: "Nouveau" },
      ]}
      contentPreset="detail"
    >
      <MarketingRouteNav />
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Marchés"
          title="Nouveau marché"
          description="Titre, dates, lieu et description affichés sur la page publique dédiée."
        />

        <AdminDataTableFeedbackBanner
          message={
            resolvedSearchParams.public_event_error
              ? getErrorMessage(resolvedSearchParams.public_event_error)
              : null
          }
          tone="error"
        />

        <section className="rounded-[28px] border border-surface-border bg-surface-panel p-6 shadow-card">
          <AdminPublicEventForm action={createPublicEventAction} submitLabel="Créer le marché" />
        </section>
      </div>
    </AdminPageShell>
  );
}

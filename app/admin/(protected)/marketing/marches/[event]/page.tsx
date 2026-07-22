import { notFound } from "next/navigation";
import { Tag } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminFeatureDisabledState } from "@/components/admin/shared/admin-feature-disabled-state";
import { AdminDataTableFeedbackBanner } from "@/components/admin/tables/layout/admin-data-table-feedback-banner";
import { Badge } from "@/components/ui/badge";
import { AdminPublicEventForm } from "@/features/admin/marketing/public-events/components/admin-public-event-form";
import { updatePublicEventAction } from "@/features/admin/marketing/public-events/actions/update-public-event.action";
import { getAdminPublicEventDetail } from "@/features/admin/marketing/public-events/queries/get-admin-public-event-detail.query";
import { isPublicEventsFeatureActive } from "@/features/admin/marketing/public-events/queries/is-public-events-feature-active.query";
import { ADMIN_PUBLIC_EVENTS_PATH } from "@/features/admin/marketing/public-events/shared/admin-public-events-routes";
import { MarketingRouteNav } from "@/features/admin/marketing/components/marketing-route-nav";

export const dynamic = "force-dynamic";

type AdminPublicEventDetailPageProps = Readonly<{
  params: Promise<{ event: string }>;
  searchParams: Promise<{
    public_event_updated?: string;
    public_event_error?: string;
  }>;
}>;

function getErrorMessage(code: string): string {
  switch (code) {
    case "duplicate_slug":
      return "Ce slug de marché existe déjà.";
    case "invalid_input":
      return "Formulaire invalide — vérifiez les champs.";
    case "not_found":
      return "Marché introuvable.";
    default:
      return "La mise à jour du marché a échoué.";
  }
}

function getStatusLabel(
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "CANCELLED" | "COMPLETED" | "ARCHIVED"
): string {
  switch (status) {
    case "ACTIVE":
      return "Actif";
    case "INACTIVE":
      return "Inactif";
    case "CANCELLED":
      return "Annulé";
    case "COMPLETED":
      return "Terminé";
    case "ARCHIVED":
      return "Archivé";
    case "DRAFT":
    default:
      return "Brouillon";
  }
}

export default async function AdminPublicEventDetailPage({
  params,
  searchParams,
}: AdminPublicEventDetailPageProps) {
  const [{ event: publicEventId }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

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

  const publicEvent = await getAdminPublicEventDetail(publicEventId);

  if (publicEvent === null) {
    notFound();
  }

  const updatePublicEventWithId = updatePublicEventAction.bind(null, publicEvent.id);

  return (
    <AdminPageShell
      title={publicEvent.title}
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Marketing", href: "/admin/marketing/overview" },
        { label: "Marchés", href: ADMIN_PUBLIC_EVENTS_PATH },
        { label: publicEvent.title },
      ]}
      contentPreset="detail"
    >
      <MarketingRouteNav />
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Marchés"
          title={publicEvent.title}
          description={
            publicEvent.shortDescription ??
            "Détail du marché : dates, lieu, description et conditions spéciales."
          }
          mobileHidden={false}
        />

        <AdminDataTableFeedbackBanner
          message={resolvedSearchParams.public_event_updated ? "Marché mis à jour." : null}
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
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge variant={publicEvent.status === "ACTIVE" ? "secondary" : "outline"}>
              {getStatusLabel(publicEvent.status)}
            </Badge>
            {publicEvent.hasSpecialConditions ? (
              <Badge variant="outline">Conditions spéciales</Badge>
            ) : null}
          </div>

          <AdminPublicEventForm
            action={updatePublicEventWithId}
            submitLabel="Enregistrer"
            defaultValues={{
              title: publicEvent.title,
              slug: publicEvent.slug,
              shortDescription: publicEvent.shortDescription,
              description: publicEvent.description,
              startsAt: publicEvent.startsAt,
              endsAt: publicEvent.endsAt,
              locationName: publicEvent.locationName,
              locationAddress: publicEvent.locationAddress,
              hasSpecialConditions: publicEvent.hasSpecialConditions,
              specialConditionsNote: publicEvent.specialConditionsNote,
            }}
          />
        </section>
      </div>
    </AdminPageShell>
  );
}

import { Webhook } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminFeatureDisabledState } from "@/components/admin/shared/admin-feature-disabled-state";
import { requireInternalAdminCapability } from "@/core/auth/admin/require-internal-admin-capability";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { WebhooksPanel } from "@/features/admin/settings/components/webhooks-panel";
import {
  getAdminWebhooksSnapshot,
  type AdminWebhookDeliverySummary,
} from "@/features/admin/settings/queries/get-admin-webhooks-snapshot.query";
import { isWebhooksFeatureActive } from "@/features/admin/settings/queries/is-webhooks-feature-active.query";
import { WebhookEndpointCreateForm } from "@/features/admin/settings/webhooks/components/webhook-endpoint-create-form";
import { RetryDeliveryButton } from "@/features/admin/settings/webhooks/components/retry-delivery-button";

export const dynamic = "force-dynamic";

const RETRYABLE_STATUSES: AdminWebhookDeliverySummary["status"][] = [
  "FAILED",
  "EXPIRED",
  "CANCELLED",
];

type AdminSettingsWebhooksPageProps = Readonly<{
  searchParams: Promise<{
    endpoint_created?: string;
    secret?: string;
  }>;
}>;

export default async function AdminSettingsWebhooksPage({
  searchParams,
}: AdminSettingsWebhooksPageProps) {
  await requireInternalAdminCapability("admin.settings.advanced.read");

  const featureActive = await isWebhooksFeatureActive();
  const webhooksHeader = (
    <AdminPageHeader
      eyebrow="Réglages avancés"
      title="Webhooks"
      description="Endpoints, deliveries et relances manuelles, selon le niveau activé sur platform.webhooks."
    />
  );

  if (!featureActive) {
    return (
      <AdminPageShell
        scrollBehavior="page"
        title="Webhooks"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Reglages", href: "/admin/settings" },
          { label: "Avance", href: "/admin/settings/advanced/overview" },
          { label: "Webhooks" },
        ]}
        showTitleInContent={false}
        contentPreset="table"
        header={webhooksHeader}
      >
        <AdminFeatureDisabledState
          capabilityName="Webhooks"
          description="Cette capacité est pilotée dans les Réglages avancés. Activez le niveau requis sur platform.webhooks pour ouvrir les webhooks."
          icon={Webhook}
        />
      </AdminPageShell>
    );
  }

  const [snapshot, resolvedSearchParams, canManageWebhooks, canRetryWebhooks] = await Promise.all([
    getAdminWebhooksSnapshot(),
    searchParams,
    meetsFeatureLevel("platform.webhooks", "manage"),
    meetsFeatureLevel("platform.webhooks", "retry"),
  ]);

  const retryableDeliveries = snapshot.deliveries.filter((d) =>
    RETRYABLE_STATUSES.includes(d.status)
  );

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Webhooks"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Reglages", href: "/admin/settings" },
        { label: "Avance", href: "/admin/settings/advanced/overview" },
        { label: "Webhooks" },
      ]}
      showTitleInContent={false}
      contentPreset="table"
      header={webhooksHeader}
    >
      <div className="grid gap-6">
        {canManageWebhooks ? (
          <WebhookEndpointCreateForm initialSecret={resolvedSearchParams.secret} />
        ) : null}

        <WebhooksPanel snapshot={snapshot} />

        {canRetryWebhooks && retryableDeliveries.length > 0 ? (
          <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Deliveries en echec — relance manuelle
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Chaque relance crée une nouvelle delivery. La delivery originale est conservée.
            </p>
            <div className="mt-4 divide-y divide-surface-border/40">
              {retryableDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-sm font-medium text-foreground truncate">
                      {delivery.eventType}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {delivery.status} — endpoint : {delivery.endpointCode}
                      {delivery.errorCode ? ` — erreur : ${delivery.errorCode}` : null}
                    </span>
                  </div>
                  <RetryDeliveryButton deliveryId={delivery.id} />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </AdminPageShell>
  );
}

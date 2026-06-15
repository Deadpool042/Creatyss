import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { requireInternalAdminCapability } from "@/core/auth/admin/require-internal-admin-capability";
import { WebhooksPanel } from "@/features/admin/settings/components/webhooks-panel";
import { getAdminWebhooksSnapshot } from "@/features/admin/settings/queries/get-admin-webhooks-snapshot.query";
import { isWebhooksFeatureActive } from "@/features/admin/settings/queries/is-webhooks-feature-active.query";

export const dynamic = "force-dynamic";

export default async function AdminSettingsWebhooksPage() {
  await requireInternalAdminCapability("admin.settings.advanced.read");

  const featureActive = await isWebhooksFeatureActive();

  if (!featureActive) {
    notFound();
  }

  const snapshot = await getAdminWebhooksSnapshot();

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
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="table"
    >
      <div className="grid gap-6">
        <WebhooksPanel snapshot={snapshot} />

        <section className="rounded-2xl border border-dashed border-surface-border/60 bg-surface-subtle/10 p-5">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Portee du lot
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cette page observe le modele Prisma reel `WebhookEndpoint` / `WebhookDelivery`.
            Le prochain increment devra trancher explicitement s&apos;il s&apos;agit du bon modele
            pour les webhooks entrants de la doctrine, ou d&apos;un mecanisme sortant a renommer.
          </p>
          <Link
            href="/admin/settings/advanced/overview"
            className="mt-4 inline-flex rounded-full border border-surface-border/60 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-subtle/30"
          >
            Revenir aux reglages avances
          </Link>
        </section>
      </div>
    </AdminPageShell>
  );
}

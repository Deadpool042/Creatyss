import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { requireInternalAdminCapability } from "@/core/auth/admin/require-internal-admin-capability";
import { ChannelsPanel } from "@/features/admin/settings/components/channels-panel";
import { getAdminChannelsSnapshot } from "@/features/admin/settings/queries/get-admin-channels-snapshot.query";
import { isChannelsFeatureActive } from "@/features/admin/settings/queries/is-channels-feature-active.query";

export const dynamic = "force-dynamic";

export default async function AdminSettingsChannelsPage() {
  await requireInternalAdminCapability("admin.settings.advanced.read");

  const featureActive = await isChannelsFeatureActive();

  if (!featureActive) {
    notFound();
  }

  const snapshot = await getAdminChannelsSnapshot();

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Canaux de diffusion"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Reglages", href: "/admin/settings" },
        { label: "Avance", href: "/admin/settings/advanced/overview" },
        { label: "Canaux de diffusion" },
      ]}
      showTitleInContent={false}
      contentPreset="table"
    >
      <div className="grid gap-6">
        <ChannelsPanel snapshot={snapshot} />

        <section className="rounded-2xl border border-dashed border-surface-border/60 bg-surface-subtle/10 p-5">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Portee du lot
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cette page observe l&apos;etat reel de <code>Channel</code>, <code>ChannelProductStatus</code>{" "}
            et <code>ChannelVariantStatus</code>. Les prochains increments pourront ajouter la
            creation de canaux, les regles d&apos;eligibilite ou les synchronisations provider,
            mais rien de cela n&apos;est ouvert ici.
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

import Link from "next/link";
import { Sparkles } from "lucide-react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminFeatureDisabledState } from "@/components/admin/shared/admin-feature-disabled-state";
import { requireInternalAdminCapability } from "@/core/auth/admin/require-internal-admin-capability";
import { AiPanel } from "@/features/admin/settings/components/ai-panel";
import { getAdminAiSnapshot } from "@/features/admin/settings/queries/get-admin-ai-snapshot.query";
import { isAiFeatureActive } from "@/features/admin/settings/queries/is-ai-feature-active.query";

export const dynamic = "force-dynamic";

export default async function AdminSettingsAiPage() {
  await requireInternalAdminCapability("admin.settings.advanced.read");

  const featureActive = await isAiFeatureActive();

  if (!featureActive) {
    return (
      <AdminPageShell
        scrollBehavior="page"
        title="Assistance IA"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Reglages", href: "/admin/settings" },
          { label: "Avance", href: "/admin/settings/advanced/overview" },
          { label: "Assistance IA" },
        ]}
        showTitleInContent={false}
        contentPreset="table"
      >
        <AdminFeatureDisabledState
          capabilityName="Assistance IA"
          description="Cette capacité est pilotée dans les Réglages avancés. Activez le niveau requis sur ai.core pour ouvrir l'assistance IA."
          icon={Sparkles}
        />
      </AdminPageShell>
    );
  }

  const snapshot = await getAdminAiSnapshot();

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Assistance IA"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Reglages", href: "/admin/settings" },
        { label: "Avance", href: "/admin/settings/advanced/overview" },
        { label: "Assistance IA" },
      ]}
      showTitleInContent={false}
      contentPreset="table"
    >
      <div className="grid gap-6">
        <AiPanel snapshot={snapshot} />

        <section className="rounded-2xl border border-dashed border-surface-border/60 bg-surface-subtle/10 p-5">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Portee du lot</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cette page observe l&apos;etat reel de <code>AiProvider</code> et <code>AiTask</code>.
            Le premier usage borne est maintenant la suggestion SEO manuelle sur fiche produit. Les
            prochains increments pourront trancher les providers supportes, les taches autorisees,
            les validations humaines et les autres surfaces de generation.
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

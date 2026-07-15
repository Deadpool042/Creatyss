import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { MarketingRouteNav } from "@/features/admin/marketing/components/marketing-route-nav";
import { AdminMarketingIntentsList } from "@/features/admin/marketing/intents/components/admin-marketing-intents-list";
import { AdminMarketingIntentsRefreshButton } from "@/features/admin/marketing/intents/components/admin-marketing-intents-refresh-button";
import { listAdminMarketingIntents } from "@/features/admin/marketing/intents/queries/list-admin-marketing-intents.query";

export const dynamic = "force-dynamic";

export default async function AdminMarketingIntentsPage() {
  const intents = await listAdminMarketingIntents();

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Intentions"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Marketing", href: "/admin/marketing/overview" },
        { label: "Intentions" },
      ]}
      showTitleInContent={false}
      contentPreset="table"
      header={
        <AdminPageHeader
          eyebrow="Marketing"
          title="Intentions"
          description="Propositions de communication générées à partir des publications éditoriales, en attente de revue."
        />
      }
    >
      <MarketingRouteNav />
      <div className="grid gap-6">
        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-foreground">
            Nouveaux événements éditoriaux
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Analyse les événements éditoriaux non encore projetés et propose de nouvelles intentions
            marketing.
          </p>
          <AdminMarketingIntentsRefreshButton />
        </section>

        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
            Propositions en attente
          </h2>
          <AdminMarketingIntentsList intents={intents} />
        </section>
      </div>
    </AdminPageShell>
  );
}

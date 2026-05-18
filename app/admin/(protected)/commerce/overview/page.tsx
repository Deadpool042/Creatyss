import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { Notice } from "@/components/shared/notice";

export default function AdminCommerceOverviewPage() {
  return (
    <AdminPageShell
      eyebrow="Commerce"
      title="Vue d'ensemble"
      description="Suivi des ventes, des commandes et des clients."
    >
      <Notice tone="info">
        Les outils commerce sont en cours d&apos;activation progressive. Les commandes, les clients
        et les paiements seront accessibles depuis cette section au fur et à mesure de leur mise en
        service.
      </Notice>

      <p className="text-sm leading-relaxed text-muted-foreground max-w-xl">
        Pour l&apos;instant, la boutique est opérationnelle pour recevoir des commandes. Le suivi
        détaillé et les exports seront disponibles prochainement.
      </p>
    </AdminPageShell>
  );
}

import { SectionIntro } from "@/components/shared/display";
import type { AdminOrderStatusHistoryEntry } from "@/features/admin/commerce/orders/details/types/admin-order-detail.types";

type OrderDetailStatusHistoryCardProps = Readonly<{
  statusHistory: AdminOrderStatusHistoryEntry[];
}>;

export function OrderDetailStatusHistoryCard({
  statusHistory,
}: OrderDetailStatusHistoryCardProps) {
  return (
    <article className="grid gap-4 rounded-xl border border-surface-border bg-surface-panel p-5 text-foreground shadow-card">
      <SectionIntro
        className="grid gap-2"
        eyebrow="Historique"
        title="Historique de statut"
        description="Chronologie des transitions de statut appliquées à cette commande."
      />

      {statusHistory.length === 0 ? (
        <p className="card-copy leading-snug text-foreground">
          Aucune transition de statut enregistrée pour cette commande.
        </p>
      ) : (
        <ol className="grid gap-2">
          {statusHistory.map((entry) => (
            <li
              key={entry.id}
              className="grid gap-1 rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="card-meta leading-snug text-text-muted-strong">{entry.date}</p>
                <p className="card-copy leading-snug font-medium text-foreground">
                  {entry.statusLabel}
                </p>
              </div>

              {entry.note ? (
                <p className="card-meta leading-snug text-text-muted-strong">
                  Note : {entry.note}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}

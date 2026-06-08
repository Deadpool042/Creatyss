import {
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-overview-content";
import type { AdminOrderStatusHistoryEntry } from "@/features/admin/commerce/orders/details/types/admin-order-detail.types";

type OrderDetailStatusHistoryCardProps = Readonly<{
  statusHistory: AdminOrderStatusHistoryEntry[];
}>;

export function OrderDetailStatusHistoryCard({ statusHistory }: OrderDetailStatusHistoryCardProps) {
  return (
    <AdminSplitDetailSectionCard tone="secondary">
      <AdminSplitDetailSectionHeader
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
            <li key={entry.id} className="grid gap-1 py-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="card-meta leading-snug text-text-muted-strong">{entry.date}</p>
                <p className="card-copy leading-snug font-medium text-foreground">
                  {entry.statusLabel}
                </p>
              </div>

              {entry.note ? (
                <p className="card-meta leading-snug text-text-muted-strong">Note : {entry.note}</p>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </AdminSplitDetailSectionCard>
  );
}

import type { AdminOrderLine } from "@/features/admin/commerce/orders/details/types/admin-order-detail.types";
import {
  AdminSplitDetailFact,
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-overview-content";
import { Separator } from "@/components/ui/separator";

type OrderDetailLinesPanelProps = Readonly<{
  lines: AdminOrderLine[];
  totalAmount: string;
}>;

export function OrderDetailLinesPanel({ lines, totalAmount }: OrderDetailLinesPanelProps) {
  return (
    <AdminSplitDetailSectionCard tone="secondary">
      <AdminSplitDetailSectionHeader
        eyebrow="Récapitulatif"
        title="Lignes de commande"
        description={`${lines.length} article${lines.length > 1 ? "s" : ""} enregistré${lines.length > 1 ? "s" : ""} sur cette commande.`}
      />

      <div className="grid gap-3">
        {lines.map((line) => (
          <article
            className="grid gap-3 rounded-xl border border-surface-border-subtle bg-surface-panel-soft p-4"
            key={line.id}
          >
            <div className="grid gap-1">
              <h3>{line.productName}</h3>
              {line.variantName ? (
                <p className="leading-snug text-text-muted-strong">{line.variantName}</p>
              ) : null}
            </div>

            {line.sku ? (
              <AdminSplitDetailFact label="SKU" value={line.sku} />
            ) : null}

            <div className="grid gap-3 sm:grid-cols-3">
              <AdminSplitDetailFact label="Quantité" value={line.quantity} />
              <AdminSplitDetailFact label="Prix unitaire" value={line.unitPriceAmount} />
              <AdminSplitDetailFact label="Sous-total" value={line.lineTotalAmount} />
            </div>
          </article>
        ))}
      </div>

      <Separator />

      <div className="grid gap-1">
        <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-text-muted-soft">
          Total commande
        </p>
        <p className="card-copy font-semibold text-foreground">{totalAmount}</p>
      </div>
    </AdminSplitDetailSectionCard>
  );
}

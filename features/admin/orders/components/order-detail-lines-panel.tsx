import type { AdminOrderDetail } from "@/features/admin/orders/types/order-detail-types";
import { Separator } from "@/components/ui/separator";

type OrderDetailLinesPanelProps = Readonly<{
  lines: AdminOrderDetail["lines"];
  totalAmount: string;
}>;

export function OrderDetailLinesPanel({ lines, totalAmount }: OrderDetailLinesPanelProps) {
  return (
    <aside className="grid gap-4 rounded-xl border border-surface-border bg-surface-panel p-5 text-card-foreground shadow-card">
      <div className="grid gap-2">
        <p className="text-meta-label text-brand">Récapitulatif</p>
        <h2>Lignes de commande</h2>
      </div>

      <div className="grid gap-3">
        {lines.map((line) => (
          <article
            className="grid gap-3 rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-4"
            key={line.id}
          >
            <div className="grid gap-1">
              <h3>{line.productName}</h3>
              <p className="text-secondary-copy reading-compact text-text-muted-strong">
                {line.variantName} · {line.colorName}
                {line.colorHex ? ` · ${line.colorHex}` : ""}
              </p>
            </div>

            <div className="grid gap-1">
              <p className="text-meta-label text-text-muted-soft">
                SKU
              </p>
              <p className="text-secondary-copy reading-compact card-copy font-medium text-foreground">
                {line.sku}
              </p>
            </div>

            <div className="grid gap-1">
              <p className="text-meta-label text-text-muted-soft">
                Quantité
              </p>
              <p className="text-secondary-copy reading-compact card-copy font-medium text-foreground">
                {line.quantity}
              </p>
            </div>

            <div className="grid gap-1">
              <p className="text-meta-label text-text-muted-soft">
                Prix unitaire figé
              </p>
              <p className="text-secondary-copy reading-compact card-copy font-medium text-foreground">
                {line.unitPrice}
              </p>
            </div>

            <div className="grid gap-1">
              <p className="text-meta-label text-text-muted-soft">
                Sous-total
              </p>
              <p className="text-secondary-copy reading-compact card-copy font-medium text-foreground">
                {line.lineTotal}
              </p>
            </div>
          </article>
        ))}
      </div>

      <Separator />

      <div className="grid gap-1">
        <p className="text-meta-label text-text-muted-soft">
          Total commande
        </p>
        <p className="text-title-compact card-copy font-semibold text-foreground">{totalAmount}</p>
      </div>
    </aside>
  );
}

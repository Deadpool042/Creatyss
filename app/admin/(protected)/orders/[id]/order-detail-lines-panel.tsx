import type { AdminOrderDetail } from "@/db/repositories/order.repository";
import { Separator } from "@/components/ui/separator";

type OrderDetailLinesPanelProps = Readonly<{
  lines: AdminOrderDetail["lines"];
  totalAmount: string;
}>;

export function OrderDetailLinesPanel({
  lines,
  totalAmount
}: OrderDetailLinesPanelProps) {
  return (
    <aside className="product-panel checkout-summary rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm">
      <div className="stack gap-2">
        <p className="eyebrow">Récapitulatif</p>
        <h2>Lignes de commande</h2>
      </div>

      <div className="checkout-line-list">
        {lines.map(line => (
          <article
            className="store-card checkout-line rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm"
            key={line.id}>
            <div className="stack">
              <h3>{line.productName}</h3>
              <p className="variant-meta">
                {line.variantName} · {line.colorName}
                {line.colorHex ? ` · ${line.colorHex}` : ""}
              </p>
            </div>

            <div className="stack">
              <p className="meta-label">SKU</p>
              <p className="card-copy">{line.sku}</p>
            </div>

            <div className="stack">
              <p className="meta-label">Quantité</p>
              <p className="card-copy">{line.quantity}</p>
            </div>

            <div className="stack">
              <p className="meta-label">Prix unitaire figé</p>
              <p className="card-copy">{line.unitPrice}</p>
            </div>

            <div className="stack">
              <p className="meta-label">Sous-total</p>
              <p className="card-copy">{line.lineTotal}</p>
            </div>
          </article>
        ))}
      </div>

      <Separator />

      <div className="stack">
        <p className="meta-label">Total commande</p>
        <p className="card-copy">{totalAmount}</p>
      </div>
    </aside>
  );
}

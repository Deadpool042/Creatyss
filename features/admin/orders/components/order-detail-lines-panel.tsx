import type { AdminOrderDetail } from "@/features/admin/orders/types/order-detail-types";
import { Separator } from "@/components/ui/separator";

type OrderDetailLinesPanelProps = Readonly<{
  lines: AdminOrderDetail["lines"];
  totalAmount: string;
}>;

export function OrderDetailLinesPanel({ lines, totalAmount }: OrderDetailLinesPanelProps) {
  return (
    <aside className="grid gap-4 p-5 border shadow-sm rounded-xl border-border/70 bg-card text-card-foreground">
      <div className="grid gap-2">
        <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">Récapitulatif</p>
        <h2>Lignes de commande</h2>
      </div>

      <div className="grid gap-3">
        {lines.map((line) => (
          <article
            className="grid gap-3 p-4 border rounded-lg border-border/60 bg-muted/10"
            key={line.id}
          >
            <div className="grid gap-1">
              <h3>{line.productName}</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                {line.variantName} · {line.colorName}
                {line.colorHex ? ` · ${line.colorHex}` : ""}
              </p>
            </div>

            <div className="grid gap-1">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                SKU
              </p>
              <p className="text-sm font-medium leading-6 card-copy text-foreground">{line.sku}</p>
            </div>

            <div className="grid gap-1">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Quantité
              </p>
              <p className="text-sm font-medium leading-6 card-copy text-foreground">
                {line.quantity}
              </p>
            </div>

            <div className="grid gap-1">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Prix unitaire figé
              </p>
              <p className="text-sm font-medium leading-6 card-copy text-foreground">
                {line.unitPrice}
              </p>
            </div>

            <div className="grid gap-1">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Sous-total
              </p>
              <p className="text-sm font-medium leading-6 card-copy text-foreground">
                {line.lineTotal}
              </p>
            </div>
          </article>
        ))}
      </div>

      <Separator />

      <div className="grid gap-1">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Total commande
        </p>
        <p className="text-base font-semibold leading-6 card-copy text-foreground">{totalAmount}</p>
      </div>
    </aside>
  );
}

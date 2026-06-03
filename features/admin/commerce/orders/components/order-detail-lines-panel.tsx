import type { AdminOrderLine } from "@/features/admin/commerce/orders/details/types/admin-order-detail.types";
import { Separator } from "@/components/ui/separator";
import { SectionIntro } from "@/components/shared/display";

type OrderDetailLinesPanelProps = Readonly<{
  lines: AdminOrderLine[];
  totalAmount: string;
}>;

export function OrderDetailLinesPanel({ lines, totalAmount }: OrderDetailLinesPanelProps) {
  return (
    <aside className="grid gap-4 rounded-xl border border-surface-border bg-surface-panel p-5 text-foreground shadow-card">
      <SectionIntro
        className="grid gap-2"
        eyebrow="Récapitulatif"
        title="Lignes de commande"
        description={`${lines.length} article${lines.length > 1 ? "s" : ""} enregistré${lines.length > 1 ? "s" : ""} sur cette commande.`}
      />

      <div className="grid gap-3">
        {lines.map((line) => (
          <article
            className="grid gap-3 rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-4"
            key={line.id}
          >
            <div className="grid gap-1">
              <h3>{line.productName}</h3>
              {line.variantName ? (
                <p className="leading-snug text-text-muted-strong">{line.variantName}</p>
              ) : null}
            </div>

            {line.sku ? (
              <div className="grid gap-1">
                <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-text-muted-soft">
                  SKU
                </p>
                <p className="leading-snug card-copy font-medium text-foreground">{line.sku}</p>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="grid gap-1">
                <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-text-muted-soft">
                  Quantité
                </p>
                <p className="leading-snug card-copy font-medium text-foreground">
                  {line.quantity}
                </p>
              </div>

              <div className="grid gap-1">
                <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-text-muted-soft">
                  Prix unitaire
                </p>
                <p className="leading-snug card-copy font-medium text-foreground">
                  {line.unitPriceAmount}
                </p>
              </div>

              <div className="grid gap-1">
                <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-text-muted-soft">
                  Sous-total
                </p>
                <p className="leading-snug card-copy font-medium text-foreground">
                  {line.lineTotalAmount}
                </p>
              </div>
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
    </aside>
  );
}

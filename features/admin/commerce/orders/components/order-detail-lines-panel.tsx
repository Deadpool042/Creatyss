import Link from "next/link";

import type { AdminOrderLine } from "@/features/admin/commerce/orders/details/types/admin-order-detail.types";
import {
  AdminSplitDetailFact,
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-overview-content";
import { AdminThumbnail } from "@/components/admin/media/admin-thumbnail";
import { Separator } from "@/components/ui/separator";
import { buildAdminProductPath } from "@/features/admin/products/navigation/product-routes";

type OrderDetailLinesPanelProps = Readonly<{
  lines: AdminOrderLine[];
  subtotalAmount: string;
  shippingAmount: string;
  discountAmount: string;
  taxAmount: string;
  totalAmount: string;
}>;

export function OrderDetailLinesPanel({
  lines,
  subtotalAmount,
  shippingAmount,
  discountAmount,
  taxAmount,
  totalAmount,
}: OrderDetailLinesPanelProps) {
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
            <div className="flex gap-3">
              <AdminThumbnail
                alt={line.thumbnailAlt ?? line.productName}
                className="h-12 w-12 shrink-0 rounded-lg border border-surface-border/40 bg-surface-subtle/50"
                src={line.thumbnailUrl}
              />
              <div className="grid gap-1">
                <h3>
                  {line.productSlug !== null ? (
                    <Link
                      className="hover:underline underline-offset-4"
                      href={buildAdminProductPath(line.productSlug)}
                    >
                      {line.productName}
                    </Link>
                  ) : (
                    line.productName
                  )}
                </h3>
                {line.variantName ? (
                  <p className="leading-snug text-text-muted-strong">{line.variantName}</p>
                ) : null}
              </div>
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

      <div className="grid gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-text-muted-soft">Sous-total</p>
          <p className="card-copy text-sm leading-snug text-foreground">{subtotalAmount}</p>
        </div>

        {shippingAmount !== "0.00" ? (
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-text-muted-soft">Livraison</p>
            <p className="card-copy text-sm leading-snug text-foreground">{shippingAmount}</p>
          </div>
        ) : null}

        {discountAmount !== "0.00" ? (
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-text-muted-soft">Remise</p>
            <p className="card-copy text-sm leading-snug text-foreground">−{discountAmount}</p>
          </div>
        ) : null}

        {taxAmount !== "0.00" ? (
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-text-muted-soft">TVA</p>
            <p className="card-copy text-sm leading-snug text-foreground">{taxAmount}</p>
          </div>
        ) : null}

        <Separator className="my-0.5" />

        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-text-muted-soft">Total</p>
          <p className="card-copy font-semibold text-foreground">{totalAmount}</p>
        </div>
      </div>
    </AdminSplitDetailSectionCard>
  );
}

import type { OrderStatusSummary } from "@/entities/order/order-status-presentation";
import { Notice } from "@/components/shared/feedback";
import { SectionIntro } from "@/components/shared/display";
import { Badge } from "@/components/ui/badge";

type OrderDetailSummaryCardProps = Readonly<{
  summary: OrderStatusSummary;
  orderStatusLabel: string;
  paymentStatusLabel: string;
  orderReference: string;
  totalAmount: string;
  createdAtLabel: string;
  lineCount: number;
  shipmentStatusLabel: string;
}>;

export function OrderDetailSummaryCard({
  summary,
  orderStatusLabel,
  paymentStatusLabel,
  orderReference,
  totalAmount,
  createdAtLabel,
  lineCount,
  shipmentStatusLabel,
}: OrderDetailSummaryCardProps) {
  return (
    <article className="grid gap-4 rounded-xl border border-surface-border/60 bg-surface-panel/80 p-5 shadow-sm">
      <div className="grid gap-3">
        <SectionIntro
          description={summary.description}
          className="grid gap-2"
          eyebrow="Synthèse"
          title={summary.title}
        />
        <Notice tone="note">{summary.nextStep}</Notice>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge className="rounded-full px-2.5 py-1 text-xs font-medium" variant="outline">
          {orderStatusLabel}
        </Badge>
        <Badge className="rounded-full px-2.5 py-1 text-xs font-medium" variant="outline">
          {paymentStatusLabel}
        </Badge>
        <Badge className="rounded-full px-2.5 py-1 text-xs font-medium" variant="outline">
          {shipmentStatusLabel}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted-soft">
            Référence
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{orderReference}</p>
        </div>
        <div className="rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted-soft">
            Total
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{totalAmount}</p>
        </div>
        <div className="rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted-soft">
            Créée le
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{createdAtLabel}</p>
        </div>
        <div className="rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted-soft">
            Articles
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{lineCount}</p>
        </div>
      </div>
    </article>
  );
}

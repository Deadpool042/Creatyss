import type { OrderStatusSummary } from "@/entities/order/order-status-presentation";
import { Notice } from "@/components/notice";
import { SectionIntro } from "@/components/section-intro";
import { Badge } from "@/components/ui/badge";

type OrderDetailSummaryCardProps = Readonly<{
  summary: OrderStatusSummary;
  orderStatusLabel: string;
  paymentStatusLabel: string;
}>;

export function OrderDetailSummaryCard({
  summary,
  orderStatusLabel,
  paymentStatusLabel
}: OrderDetailSummaryCardProps) {
  return (
    <article className="store-card checkout-line rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm">
      <div className="stack gap-2">
        <SectionIntro
          description={summary.description}
          eyebrow="Synthèse"
          title={summary.title}
        />
        <Notice tone="note">{summary.nextStep}</Notice>
      </div>

      <div className="admin-product-tags flex flex-wrap gap-2">
        <Badge
          className="rounded-full px-2.5 py-1 text-xs font-medium"
          variant="outline">
          {orderStatusLabel}
        </Badge>
        <Badge
          className="rounded-full px-2.5 py-1 text-xs font-medium"
          variant="outline">
          {paymentStatusLabel}
        </Badge>
      </div>
    </article>
  );
}

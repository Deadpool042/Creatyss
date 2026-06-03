import type { OrderStatusSummary } from "@/entities/order/order-status-presentation";
import { Notice } from "@/components/shared/feedback";
import { SectionIntro } from "@/components/shared/display";
import { Badge } from "@/components/ui/badge";

type OrderDetailSummaryCardProps = Readonly<{
  summary: OrderStatusSummary;
  orderStatusLabel: string;
  paymentStatusLabel: string;
}>;

export function OrderDetailSummaryCard({
  summary,
  orderStatusLabel,
  paymentStatusLabel,
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
      </div>
    </article>
  );
}

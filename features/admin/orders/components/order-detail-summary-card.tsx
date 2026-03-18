import type { OrderStatusSummary } from "@/entities/order/order-status-presentation";
import { Notice } from "@/components/shared/notice";
import { SectionIntro } from "@/components/shared/section-intro";
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
    <article className="grid gap-4 rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm">
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

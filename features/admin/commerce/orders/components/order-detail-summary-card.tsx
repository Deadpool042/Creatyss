import type { OrderStatusSummary } from "@/entities/order/order-status-presentation";
import {
  AdminSplitDetailFact,
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-overview-content";
import { Notice } from "@/components/shared/feedback";
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
  notes?: string | null;
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
  notes,
}: OrderDetailSummaryCardProps) {
  return (
    <AdminSplitDetailSectionCard>
      <div className="grid gap-3">
        <AdminSplitDetailSectionHeader
          description={summary.description}
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
        <AdminSplitDetailFact label="Référence" value={orderReference} />
        <AdminSplitDetailFact label="Total" value={totalAmount} />
        <AdminSplitDetailFact label="Créée le" value={createdAtLabel} />
        <AdminSplitDetailFact label="Articles" value={lineCount} />
      </div>

      {notes ? (
        <div className="rounded-xl border border-surface-border-subtle bg-surface-panel-soft p-3">
          <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-text-muted-soft">
            Note
          </p>
          <p className="mt-1 card-copy leading-snug text-foreground">{notes}</p>
        </div>
      ) : null}
    </AdminSplitDetailSectionCard>
  );
}

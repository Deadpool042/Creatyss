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
        <AdminSplitDetailFact
          className="rounded-none border-0 bg-transparent px-0 py-0 shadow-none"
          label="Référence"
          value={orderReference}
        />
        <AdminSplitDetailFact
          className="rounded-none border-0 bg-transparent px-0 py-0 shadow-none"
          label="Total"
          value={totalAmount}
        />
        <AdminSplitDetailFact
          className="rounded-none border-0 bg-transparent px-0 py-0 shadow-none"
          label="Créée le"
          value={createdAtLabel}
        />
        <AdminSplitDetailFact
          className="rounded-none border-0 bg-transparent px-0 py-0 shadow-none"
          label="Articles"
          value={lineCount}
        />
      </div>

      {notes ? (
        <div className="grid gap-1 pt-1">
          <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-text-muted-soft">
            Note
          </p>
          <p className="mt-1 card-copy leading-snug text-foreground">{notes}</p>
        </div>
      ) : null}
    </AdminSplitDetailSectionCard>
  );
}

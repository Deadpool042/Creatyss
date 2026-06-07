import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminSplitDetailPaneShell } from "@/components/admin/layout/admin-split-detail-pane-shell";
import { db } from "@/core/db";
import { findDocumentsByOrderId } from "@/features/admin/commerce/documents/queries/find-documents-by-order.query";
import { OrderDetailDocumentsCard } from "@/features/admin/commerce/documents/components/order-detail-documents-card";

export const dynamic = "force-dynamic";

type OrderDocumentsSlotPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export default async function OrderDocumentsSlotPage({ params }: OrderDocumentsSlotPageProps) {
  const { id } = await params;

  const [order, documents] = await Promise.all([
    db.order.findUnique({
      where: { id },
      select: { id: true, orderNumber: true },
    }),
    findDocumentsByOrderId(id),
  ]);

  if (order === null) {
    notFound();
  }

  return (
    <AdminSplitDetailPaneShell constrainContent={false} contentClassName="gap-4">
      <div className="admin-split-detail-pane-column">
        <AdminPageHeader
          eyebrow="Commandes"
          title={`Documents — Commande #${order.orderNumber}`}
          description="Documents associés à cette commande. Lecture seule."
        />
      </div>

      <div className="admin-split-detail-pane-column">
        <OrderDetailDocumentsCard documents={documents} orderId={id} />
      </div>
    </AdminSplitDetailPaneShell>
  );
}

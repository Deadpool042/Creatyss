import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminSplitDetailPaneShell } from "@/components/admin/layout/admin-split-detail-pane-shell";
import { db } from "@/core/db";
import {
  ADMIN_ORDERS_DETAIL_CONTENT_CLASS,
  buildAdminOrdersDetailSectionClassName,
} from "@/features/admin/commerce/orders/shared/admin-orders-detail-layout";
import { isDocumentsFeatureActive } from "@/features/admin/commerce/documents/queries/is-documents-feature-active.query";
import { findDocumentsByOrderId } from "@/features/admin/commerce/documents/queries/find-documents-by-order.query";
import { OrderDetailDocumentsCard } from "@/features/admin/commerce/documents/components/order-detail-documents-card";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export const dynamic = "force-dynamic";

type OrderDocumentsSlotPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export default async function OrderDocumentsSlotPage({ params }: OrderDocumentsSlotPageProps) {
  const { id } = await params;

  const [featureActive, allowFiscal, order, documents] = await Promise.all([
    isDocumentsFeatureActive(),
    meetsFeatureLevel("commerce.documents", "fiscal"),
    db.order.findUnique({
      where: { id },
      select: { id: true, orderNumber: true },
    }),
    findDocumentsByOrderId(id),
  ]);

  if (!featureActive) {
    notFound();
  }

  if (order === null) {
    notFound();
  }

  return (
    <AdminSplitDetailPaneShell
      constrainContent={false}
      contentClassName={ADMIN_ORDERS_DETAIL_CONTENT_CLASS}
    >
      <div className={buildAdminOrdersDetailSectionClassName()}>
        <AdminPageHeader
          eyebrow="Commandes"
          title={`Documents — Commande #${order.orderNumber}`}
          description="Documents associés à cette commande. Lecture seule."
        />
      </div>

      <div className={buildAdminOrdersDetailSectionClassName()}>
        <OrderDetailDocumentsCard documents={documents} orderId={id} allowFiscal={allowFiscal} />
      </div>
    </AdminSplitDetailPaneShell>
  );
}

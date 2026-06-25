import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminSplitDetailPaneShell } from "@/components/admin/layout/admin-split-detail-pane-shell";
import { Notice } from "@/components/shared/feedback";
import { findAdminOrderById } from "@/features/admin/commerce/orders/details/queries/find-admin-order-by-id.query";
import { buildAdminOrderDetailViewModel } from "@/features/admin/commerce/orders/details/mappers/build-admin-order-detail-view-model";
import {
  OrderDetailActionsCard,
  OrderDetailBillingAddressCard,
  OrderDetailCustomerCard,
  OrderDetailEmailEventsCard,
  OrderDetailLinesPanel,
  OrderDetailPaymentCard,
  OrderDetailShippingAddressCard,
  OrderDetailShippingCard,
  OrderDetailStatusHistoryCard,
  OrderDetailSummaryCard,
} from "@/features/admin/commerce/orders";
import {
  ADMIN_ORDERS_DETAIL_CONTENT_CLASS,
  buildAdminOrdersDetailSectionClassName,
} from "@/features/admin/commerce/orders/shared/admin-orders-detail-layout";
import { findDocumentsByOrderId } from "@/features/admin/commerce/documents/queries/find-documents-by-order.query";
import { isDocumentsFeatureActive } from "@/features/admin/commerce/documents/queries/is-documents-feature-active.query";
import { OrderDetailDocumentsCard } from "@/features/admin/commerce/documents/components/order-detail-documents-card";
import { findFulfillmentByOrderId } from "@/features/admin/commerce/fulfillment/queries/find-fulfillment-by-order.query";
import { isFulfillmentFeatureActive } from "@/features/admin/commerce/fulfillment/queries/is-fulfillment-feature-active.query";
import { OrderDetailFulfillmentCard } from "@/features/admin/commerce/fulfillment/components/order-detail-fulfillment-card";
import { findReturnByOrderId } from "@/features/admin/commerce/returns/queries/find-return-by-order.query";
import { isReturnsFeatureActive } from "@/features/admin/commerce/returns/queries/is-returns-feature-active.query";
import { OrderDetailReturnCard } from "@/features/admin/commerce/returns/components/order-detail-return-card";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export const dynamic = "force-dynamic";

type OrderDetailSlotPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    order_status?: string | string[];
    order_error?: string | string[];
  }>;
}>;

export default async function OrderDetailSlotPage({
  params,
  searchParams,
}: OrderDetailSlotPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const [order, documentsFeatureActive, fulfillmentFeatureActive, returnsFeatureActive, storeId] =
    await Promise.all([
      findAdminOrderById(id),
      isDocumentsFeatureActive(),
      isFulfillmentFeatureActive(),
      isReturnsFeatureActive(),
      getCurrentStoreId(),
    ]);

  if (order === null) {
    notFound();
  }

  const vm = buildAdminOrderDetailViewModel(order, resolvedSearchParams);

  const documents = documentsFeatureActive ? await findDocumentsByOrderId(id) : null;
  const fulfillment =
    fulfillmentFeatureActive && storeId !== null
      ? await findFulfillmentByOrderId(storeId, id)
      : null;
  const returnRequest =
    returnsFeatureActive && storeId !== null ? await findReturnByOrderId(storeId, id) : null;

  return (
    <AdminSplitDetailPaneShell
      constrainContent={false}
      contentClassName={ADMIN_ORDERS_DETAIL_CONTENT_CLASS}
    >
      <div className={buildAdminOrdersDetailSectionClassName()}>
        <AdminPageHeader
          eyebrow="Commandes"
          title={`Commande ${order.reference}`}
          description="Repérez d'abord l'état de la commande, appliquez l'action utile si nécessaire, puis consultez les détails."
        />
      </div>

      {vm.statusMessage ? <Notice tone="success">{vm.statusMessage}</Notice> : null}
      {vm.errorMessage ? <Notice tone="alert">{vm.errorMessage}</Notice> : null}

      <div
        className={buildAdminOrdersDetailSectionClassName(
          "grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] xl:items-start"
        )}
      >
        <OrderDetailSummaryCard
          createdAtLabel={vm.orderMeta.createdAtLabel}
          lineCount={order.lines.length}
          notes={order.notes}
          orderReference={order.reference}
          orderStatusLabel={vm.orderMeta.statusLabel}
          paymentStatusLabel={vm.orderMeta.paymentStatusLabel}
          shipmentStatusLabel={vm.shippingInfo.statusLabel}
          summary={vm.summary}
          totalAmount={order.totalAmount}
        />

        <OrderDetailActionsCard
          allowedTransitions={vm.allowedTransitions}
          order={vm.orderMeta}
          shipmentStatus={vm.shippingInfo.status}
        />
      </div>

      <div
        className={buildAdminOrdersDetailSectionClassName(
          "grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] xl:items-start"
        )}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <OrderDetailCustomerCard customer={vm.customer} />

          <OrderDetailShippingCard
            carrier={vm.shippingInfo.carrier}
            deliveredAtLabel={vm.shippingInfo.deliveredAtLabel}
            shipmentStatus={vm.shippingInfo.status}
            shippedAtLabel={vm.shippingInfo.shippedAtLabel}
            trackingReference={vm.shippingInfo.trackingReference}
            trackingUrl={vm.shippingInfo.trackingUrl}
          />

          {order.payment ? <OrderDetailPaymentCard payment={order.payment} /> : null}

          {vm.shippingAddress ? (
            <OrderDetailShippingAddressCard address={vm.shippingAddress} />
          ) : null}

          <OrderDetailBillingAddressCard billing={vm.billing} />
        </div>

        <OrderDetailLinesPanel
          lines={order.lines}
          subtotalAmount={order.subtotalAmount}
          shippingAmount={order.shippingAmount}
          discountAmount={order.discountAmount}
          taxAmount={order.taxAmount}
          totalAmount={order.totalAmount}
        />
      </div>

      <div className={buildAdminOrdersDetailSectionClassName()}>
        <OrderDetailStatusHistoryCard statusHistory={vm.statusHistory} />
      </div>

      {fulfillmentFeatureActive ? (
        <div className={buildAdminOrdersDetailSectionClassName()}>
          <OrderDetailFulfillmentCard
            fulfillment={fulfillment}
            orderId={id}
            orderLines={order.lines.map((l) => ({
              id: l.id,
              productName: l.productName,
              quantity: l.quantity,
            }))}
          />
        </div>
      ) : null}

      {returnsFeatureActive ? (
        <div className={buildAdminOrdersDetailSectionClassName()}>
          <OrderDetailReturnCard
            request={returnRequest}
            orderId={id}
            orderLines={order.lines.map((l) => ({
              id: l.id,
              productName: l.productName,
              variantName: l.variantName ?? null,
              quantity: l.quantity,
            }))}
          />
        </div>
      ) : null}

      {documents !== null ? (
        <div className={buildAdminOrdersDetailSectionClassName()}>
          <OrderDetailDocumentsCard documents={documents} orderId={id} />
        </div>
      ) : null}

      <div className={buildAdminOrdersDetailSectionClassName()}>
        <OrderDetailEmailEventsCard emailEvents={order.emailEvents} />
      </div>
    </AdminSplitDetailPaneShell>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/shared/notice";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { findAdminOrderById } from "@/db/repositories/order.repository";
import { getAllowedOrderStatusTransitions } from "@/entities/order/order-status-transition";
import {
  getOrderStatusLabel,
  getOrderStatusSummary,
  getPaymentStatusLabel
} from "@/entities/order/order-status-presentation";
import {
  OrderDetailActionsCard,
  OrderDetailBillingAddressCard,
  OrderDetailCustomerCard,
  OrderDetailEmailEventsCard,
  OrderDetailLinesPanel,
  OrderDetailPaymentCard,
  OrderDetailShippingAddressCard,
  OrderDetailShippingCard,
  OrderDetailSummaryCard
} from "@/features/admin/orders/components";
import {
  formatOptionalOrderDateTime,
  formatOrderDateTime,
  getOrderDetailErrorMessage,
  getOrderDetailStatusMessage,
  readOrderDetailSearchParam
} from "@/features/admin/orders/mappers/order-detail-mappers";

export const dynamic = "force-dynamic";

type AdminOrderDetailPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    order_status?: string | string[];
    order_error?: string | string[];
  }>;
}>;

export default async function AdminOrderDetailPage({
  params,
  searchParams
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const orderStatusParam = readOrderDetailSearchParam(
    resolvedSearchParams,
    "order_status"
  );
  const orderErrorParam = readOrderDetailSearchParam(
    resolvedSearchParams,
    "order_error"
  );
  const order = await findAdminOrderById(id);

  if (order === null) {
    notFound();
  }

  const allowedTransitions = getAllowedOrderStatusTransitions(order.status);
  const summary = getOrderStatusSummary({
    orderStatus: order.status,
    paymentStatus: order.payment.status
  });
  const statusMessage = getOrderDetailStatusMessage(orderStatusParam);
  const errorMessage = getOrderDetailErrorMessage(orderErrorParam);
  const orderStatusLabel = getOrderStatusLabel(order.status);
  const paymentStatusLabel = getPaymentStatusLabel(order.payment.status);
  const orderMeta = {
    id: order.id,
    reference: order.reference,
    trackingReference: order.trackingReference,
    createdAtLabel: formatOrderDateTime(order.createdAt),
    statusLabel: orderStatusLabel,
    paymentStatusLabel
  };
  const shippingInfo = {
    shippedAtLabel: formatOptionalOrderDateTime(order.shippedAt),
    trackingReference: order.trackingReference
  };
  const customer = {
    fullName: `${order.customerFirstName} ${order.customerLastName}`,
    email: order.customerEmail,
    phone: order.customerPhone
  };
  const shippingAddress = {
    line1: order.shippingAddressLine1,
    line2: order.shippingAddressLine2,
    postalCode: order.shippingPostalCode,
    city: order.shippingCity,
    countryCode: order.shippingCountryCode
  };
  const billing = {
    sameAsShipping: order.billingSameAsShipping,
    fullName:
      `${order.billingFirstName ?? ""} ${order.billingLastName ?? ""}`.trim() ||
      null,
    phone: order.billingPhone,
    line1: order.billingAddressLine1,
    line2: order.billingAddressLine2,
    postalCode: order.billingPostalCode,
    city: order.billingCity,
    countryCode: order.billingCountryCode
  };

  return (
    <AdminPageShell
      actions={
        <Button
          asChild
          size="sm"
          variant="outline">
          <Link href="/admin/orders">Retour aux commandes</Link>
        </Button>
      }
      description="Repérez d'abord l'état de la commande, appliquez l'action utile si nécessaire, puis consultez les détails."
      eyebrow="Commandes"
      title={`Commande ${order.reference}`}>
      {statusMessage ? <Notice tone="success">{statusMessage}</Notice> : null}
      {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] xl:items-start">
        <div className="grid gap-4">
          <OrderDetailSummaryCard
            orderStatusLabel={orderStatusLabel}
            paymentStatusLabel={paymentStatusLabel}
            summary={summary}
          />

          <OrderDetailActionsCard
            allowedTransitions={allowedTransitions}
            order={orderMeta}
          />

          <OrderDetailShippingCard
            shippedAtLabel={shippingInfo.shippedAtLabel}
            trackingReference={shippingInfo.trackingReference}
          />

          <OrderDetailPaymentCard payment={order.payment} />

          <OrderDetailEmailEventsCard emailEvents={order.emailEvents} />

          <OrderDetailCustomerCard customer={customer} />

          <OrderDetailShippingAddressCard address={shippingAddress} />

          <OrderDetailBillingAddressCard billing={billing} />
        </div>

        <OrderDetailLinesPanel
          lines={order.lines}
          totalAmount={order.totalAmount}
        />
      </div>
    </AdminPageShell>
  );
}

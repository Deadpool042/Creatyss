import { notFound } from "next/navigation";
import { Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { findAdminOrderById } from "@/db/repositories/order.repository";
import { getAllowedOrderStatusTransitions } from "@/entities/order/order-status-transition";
import {
  getOrderStatusLabel,
  getOrderStatusSummary,
  getPaymentStatusLabel
} from "@/entities/order/order-status-presentation";
import {
  formatOptionalOrderDateTime,
  formatOrderDateTime,
  getOrderDetailErrorMessage,
  getOrderDetailStatusMessage,
  readOrderDetailSearchParam
} from "../../../../../features/admin/orders/lib/order-detail-helpers";
import { OrderDetailActionsCard } from "../../../../../features/admin/orders/components/order-detail-actions-card";
import { OrderDetailBillingAddressCard } from "../../../../../features/admin/orders/components/order-detail-billing-address-card";
import { OrderDetailCustomerCard } from "../../../../../features/admin/orders/components/order-detail-customer-card";
import { OrderDetailEmailEventsCard } from "../../../../../features/admin/orders/components/order-detail-email-events-card";
import { OrderDetailLinesPanel } from "../../../../../features/admin/orders/components/order-detail-lines-panel";
import { OrderDetailPaymentCard } from "../../../../../features/admin/orders/components/order-detail-payment-card";
import { OrderDetailShippingAddressCard } from "../../../../../features/admin/orders/components/order-detail-shipping-address-card";
import { OrderDetailShippingCard } from "../../../../../features/admin/orders/components/order-detail-shipping-card";
import { OrderDetailSummaryCard } from "../../../../../features/admin/orders/components/order-detail-summary-card";

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
    <section className="space-y-6 [&_.page-header]:mb-0">
      <PageHeader
        description={
          <>
            Repérez d&apos;abord l&apos;état de la commande, appliquez
            l&apos;action utile si nécessaire, puis consultez les détails.
          </>
        }
        eyebrow="Commandes"
        title={`Commande ${order.reference}`}
      />

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
    </section>
  );
}

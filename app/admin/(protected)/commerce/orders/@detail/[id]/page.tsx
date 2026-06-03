import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { Notice } from "@/components/shared/feedback";
import { findAdminOrderById } from "@/features/admin/orders/details/queries/find-admin-order-by-id.query";
import { getAllowedOrderStatusTransitions } from "@/entities/order/order-status-transition";
import {
  getOrderStatusLabel,
  getOrderStatusSummary,
  getPaymentStatusLabel,
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
  OrderDetailSummaryCard,
  formatOptionalOrderDateTime,
  formatOrderDateTime,
  getOrderDetailErrorMessage,
  getOrderDetailStatusMessage,
  readOrderDetailSearchParam,
} from "@/features/admin/orders";

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
  const orderStatusParam = readOrderDetailSearchParam(resolvedSearchParams, "order_status");
  const orderErrorParam = readOrderDetailSearchParam(resolvedSearchParams, "order_error");
  const order = await findAdminOrderById(id);

  if (order === null) {
    notFound();
  }

  const allowedTransitions = getAllowedOrderStatusTransitions(order.status);
  const paymentStatus = order.payment?.status ?? "pending";
  const summary = getOrderStatusSummary({
    orderStatus: order.status,
    paymentStatus,
  });
  const statusMessage = getOrderDetailStatusMessage(orderStatusParam);
  const errorMessage = getOrderDetailErrorMessage(orderErrorParam);
  const orderStatusLabel = getOrderStatusLabel(order.status);
  const paymentStatusLabel = getPaymentStatusLabel(paymentStatus);

  const trackingReference = order.shipment?.trackingNumber ?? null;

  const orderMeta = {
    id: order.id,
    reference: order.reference,
    trackingReference,
    createdAtLabel: formatOrderDateTime(order.createdAt),
    statusLabel: orderStatusLabel,
    paymentStatusLabel,
  };
  const shippingInfo = {
    shippedAtLabel: formatOptionalOrderDateTime(order.shipment?.shippedAt ?? null),
    trackingReference,
  };
  const customer = {
    fullName: `${order.customerFirstName ?? ""} ${order.customerLastName ?? ""}`.trim() || "—",
    email: order.customerEmail ?? "",
    phone: order.customerPhone,
  };
  const shippingAddress = order.shippingAddress
    ? {
        line1: order.shippingAddress.line1,
        line2: order.shippingAddress.line2,
        postalCode: order.shippingAddress.postalCode,
        city: order.shippingAddress.city,
        countryCode: order.shippingAddress.countryCode,
      }
    : null;
  const billing = order.billingAddress
    ? {
        sameAsShipping: false as const,
        fullName:
          `${order.billingAddress.firstName ?? ""} ${order.billingAddress.lastName ?? ""}`.trim() ||
          null,
        phone: order.billingAddress.phone,
        line1: order.billingAddress.line1,
        line2: order.billingAddress.line2,
        postalCode: order.billingAddress.postalCode,
        city: order.billingAddress.city,
        countryCode: order.billingAddress.countryCode,
      }
    : {
        sameAsShipping: true as const,
        fullName: null,
        phone: null,
        line1: null,
        line2: null,
        postalCode: null,
        city: null,
        countryCode: null,
      };

  return (
    <AdminPageShell
      scrollMode="area"
      title={`Commande ${order.reference}`}
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Commerce", href: "/admin/commerce/overview" },
        { label: "Commandes", href: "/admin/commerce/orders" },
        { label: order.reference },
      ]}
      showBreadcrumbsInContent={false}
      header={
        <AdminPageHeader
          eyebrow="Commandes"
          title={`Commande ${order.reference}`}
          description="Repérez d'abord l'état de la commande, appliquez l'action utile si nécessaire, puis consultez les détails."
        />
      }
      contentClassName="px-6 py-4"
    >
      <div className="flex flex-col gap-4">
        {statusMessage ? <Notice tone="success">{statusMessage}</Notice> : null}
        {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] xl:items-start">
          <div className="grid gap-4">
            <OrderDetailSummaryCard
              orderStatusLabel={orderStatusLabel}
              paymentStatusLabel={paymentStatusLabel}
              summary={summary}
            />

            <OrderDetailActionsCard allowedTransitions={allowedTransitions} order={orderMeta} />

            <OrderDetailShippingCard
              shippedAtLabel={shippingInfo.shippedAtLabel}
              trackingReference={shippingInfo.trackingReference}
            />

            {order.payment ? <OrderDetailPaymentCard payment={order.payment} /> : null}

            <OrderDetailEmailEventsCard emailEvents={order.emailEvents} />

            <OrderDetailCustomerCard customer={customer} />

            {shippingAddress ? (
              <OrderDetailShippingAddressCard address={shippingAddress} />
            ) : null}

            <OrderDetailBillingAddressCard billing={billing} />
          </div>

          <OrderDetailLinesPanel lines={order.lines} totalAmount={order.totalAmount} />
        </div>
      </div>
    </AdminPageShell>
  );
}

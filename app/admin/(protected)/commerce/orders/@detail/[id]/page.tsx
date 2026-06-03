import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
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
  OrderDetailSummaryCard,
} from "@/features/admin/commerce/orders";

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
  const order = await findAdminOrderById(id);

  if (order === null) {
    notFound();
  }

  const vm = buildAdminOrderDetailViewModel(order, resolvedSearchParams);

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
        {vm.statusMessage ? <Notice tone="success">{vm.statusMessage}</Notice> : null}
        {vm.errorMessage ? <Notice tone="alert">{vm.errorMessage}</Notice> : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] xl:items-start">
          <OrderDetailSummaryCard
            createdAtLabel={vm.orderMeta.createdAtLabel}
            lineCount={order.lines.length}
            orderReference={order.reference}
            orderStatusLabel={vm.orderMeta.statusLabel}
            paymentStatusLabel={vm.orderMeta.paymentStatusLabel}
            shipmentStatusLabel={vm.shippingInfo.statusLabel}
            summary={vm.summary}
            totalAmount={order.totalAmount}
          />

          <OrderDetailActionsCard allowedTransitions={vm.allowedTransitions} order={vm.orderMeta} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] xl:items-start">
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

          <OrderDetailLinesPanel lines={order.lines} totalAmount={order.totalAmount} />
        </div>

        <OrderDetailEmailEventsCard emailEvents={order.emailEvents} />
      </div>
    </AdminPageShell>
  );
}

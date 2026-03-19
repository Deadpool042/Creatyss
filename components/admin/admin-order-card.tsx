import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  getOrderStatusLabel,
  getOrderStatusSummary,
  getPaymentStatusLabel,
} from "@/entities/order/order-status-presentation";
import { type AdminOrderSummary } from "@/features/admin/orders/types/order-detail-types";

const orderDateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
});

type AdminOrderCardProps = {
  order: AdminOrderSummary;
};

function getOrderStatusBadgeVariant(status: AdminOrderSummary["status"]) {
  if (status === "cancelled") {
    return "destructive" as const;
  }

  if (status === "pending") {
    return "outline" as const;
  }

  return "secondary" as const;
}

function getPaymentStatusBadgeVariant(status: AdminOrderSummary["paymentStatus"]) {
  if (status === "failed") {
    return "destructive" as const;
  }

  if (status === "pending") {
    return "outline" as const;
  }

  return "secondary" as const;
}

export function AdminOrderCard({ order }: AdminOrderCardProps) {
  const summary = getOrderStatusSummary({
    orderStatus: order.status,
    paymentStatus: order.paymentStatus,
  });
  const titleId = `admin-order-${order.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="grid gap-4 rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm"
    >
      <div className="grid gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Commande
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-foreground" id={titleId}>
          {order.reference}
        </h2>
        <p className="text-sm text-muted-foreground">
          {order.customerFirstName} {order.customerLastName}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant={getOrderStatusBadgeVariant(order.status)}>
          {getOrderStatusLabel(order.status)}
        </Badge>
        <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>
          {getPaymentStatusLabel(order.paymentStatus)}
        </Badge>
        <Badge variant="outline">{order.totalAmount}</Badge>
        <Badge variant="outline">
          {order.lineCount} ligne{order.lineCount > 1 ? "s" : ""}
        </Badge>
      </div>

      <p className="text-sm leading-6 text-foreground/85">{summary.description}</p>
      <p className="text-sm text-muted-foreground">Suivant : {summary.nextStep}</p>
      <p className="text-sm leading-6 text-foreground/85">{order.customerEmail}</p>
      <p className="text-sm text-muted-foreground">
        {orderDateTimeFormatter.format(new Date(order.createdAt))}
      </p>

      <Link
        className="inline-flex w-fit items-center text-sm font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
        href={`/admin/orders/${order.id}`}
      >
        Voir le détail
      </Link>
    </article>
  );
}

import Link from "next/link";
import {
  getOrderStatusLabel,
  getOrderStatusSummary,
  getPaymentStatusLabel
} from "@/entities/order/order-status-presentation";
import { type AdminOrderSummary } from "@/db/repositories/order.repository";

const orderDateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short"
});

type AdminOrderCardProps = {
  order: AdminOrderSummary;
};

export function AdminOrderCard({ order }: AdminOrderCardProps) {
  const summary = getOrderStatusSummary({
    orderStatus: order.status,
    paymentStatus: order.paymentStatus
  });
  const titleId = `admin-order-${order.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="store-card rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm"
      key={order.id}>
      <div className="stack gap-2">
        <p className="card-kicker text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Commande
        </p>
        <h2
          className="text-lg font-semibold tracking-tight text-foreground"
          id={titleId}>
          {order.reference}
        </h2>
        <p className="card-meta text-sm text-muted-foreground">
          {order.customerFirstName} {order.customerLastName}
        </p>
      </div>

      <div className="admin-product-tags flex flex-wrap gap-2">
        <span className="admin-chip border-border/70 bg-muted/50 text-xs font-medium text-foreground">
          {getOrderStatusLabel(order.status)}
        </span>
        <span className="admin-chip border-border/70 bg-muted/50 text-xs font-medium text-foreground">
          {getPaymentStatusLabel(order.paymentStatus)}
        </span>
        <span className="admin-chip border-border/70 bg-muted/50 text-xs font-medium text-foreground">
          {order.totalAmount}
        </span>
        <span className="admin-chip border-border/70 bg-muted/50 text-xs font-medium text-foreground">
          {order.lineCount} ligne{order.lineCount > 1 ? "s" : ""}
        </span>
      </div>

      <p className="card-copy text-sm leading-6 text-foreground/85">
        {summary.description}
      </p>
      <p className="card-meta text-sm text-muted-foreground">
        Suivant : {summary.nextStep}
      </p>
      <p className="card-copy text-sm leading-6 text-foreground/85">
        {order.customerEmail}
      </p>
      <p className="card-meta text-sm text-muted-foreground">
        {orderDateTimeFormatter.format(new Date(order.createdAt))}
      </p>

      <div className="pt-1">
        <Link
          className="link inline-flex w-fit items-center text-sm font-medium"
          href={`/admin/orders/${order.id}`}>
          Voir le détail
        </Link>
      </div>
    </article>
  );
}

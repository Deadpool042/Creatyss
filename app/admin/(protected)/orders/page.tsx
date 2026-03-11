import Link from "next/link";
import { listAdminOrders } from "@/db/repositories/order.repository";
import {
  getOrderStatusLabel,
  getOrderStatusSummary,
  getPaymentStatusLabel
} from "@/entities/order/order-status-presentation";

export const dynamic = "force-dynamic";

type AdminOrdersPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
  }>;
}>;

const orderDateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short"
});

export default async function AdminOrdersPage({
  searchParams
}: AdminOrdersPageProps) {
  const resolvedSearchParams = await searchParams;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const orders = await listAdminOrders();
  const errorMessage =
    errorParam === "missing_order"
      ? "La commande demandee est introuvable."
      : errorParam === "invalid_order_action"
        ? "L'action demandee est invalide."
        : null;

  return (
    <div className="admin-record-list">
      <section className="section">
        <div className="page-header">
          <div>
            <p className="eyebrow">Orders</p>
            <h1>Commandes admin</h1>
            <p className="lead">
              Suivez les commandes creees depuis le checkout invite sans edition
              complexe dans ce lot.
            </p>
          </div>
        </div>

        {errorMessage ? <p className="admin-alert">{errorMessage}</p> : null}

        {orders.length > 0 ? (
          <div className="admin-record-list">
            {orders.map((order) => {
              const summary = getOrderStatusSummary({
                orderStatus: order.status,
                paymentStatus: order.paymentStatus
              });

              return (
                <article className="store-card" key={order.id}>
                  <div className="stack">
                    <p className="card-kicker">Commande</p>
                    <h2>{order.reference}</h2>
                    <p className="card-meta">
                      {order.customerFirstName} {order.customerLastName}
                    </p>
                  </div>

                  <div className="admin-product-tags">
                    <span className="admin-chip">
                      {getOrderStatusLabel(order.status)}
                    </span>
                    <span className="admin-chip">
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </span>
                    <span className="admin-chip">{order.totalAmount}</span>
                    <span className="admin-chip">
                      {order.lineCount} ligne{order.lineCount > 1 ? "s" : ""}
                    </span>
                  </div>

                  <p className="card-copy">{summary.description}</p>
                  <p className="card-meta">Suivant : {summary.nextStep}</p>
                  <p className="card-copy">{order.customerEmail}</p>
                  <p className="card-meta">
                    {orderDateTimeFormatter.format(new Date(order.createdAt))}
                  </p>

                  <div>
                    <Link className="link" href={`/admin/orders/${order.id}`}>
                      Voir le detail
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Aucune commande</p>
            <h2>Aucune commande n&apos;a encore ete creee</h2>
            <p className="card-copy">
              Les commandes creees depuis le checkout invite apparaitront ici.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

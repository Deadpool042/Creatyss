import Link from "next/link";
import { notFound } from "next/navigation";
import { findPublicOrderByReference } from "@/db/repositories/order.repository";
import {
  getOrderPaymentNotice,
  getOrderStatusLabel,
  getOrderStatusSummary,
  getPaymentStatusLabel
} from "@/entities/order/order-status-presentation";
import { startOrderPaymentAction } from "@/features/payment/actions/start-order-payment-action";

export const dynamic = "force-dynamic";

type OrderConfirmationPageProps = Readonly<{
  params: Promise<{
    reference: string;
  }>;
  searchParams: Promise<{
    payment?: string | string[];
  }>;
}>;

const orderDateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short"
});

export default async function OrderConfirmationPage({
  params,
  searchParams
}: OrderConfirmationPageProps) {
  const { reference } = await params;
  const resolvedSearchParams = await searchParams;
  const paymentParam = Array.isArray(resolvedSearchParams.payment)
    ? resolvedSearchParams.payment[0]
    : resolvedSearchParams.payment;
  const order = await findPublicOrderByReference(reference);

  if (order === null) {
    notFound();
  }

  const summary = getOrderStatusSummary({
    orderStatus: order.status,
    paymentStatus: order.payment.status
  });
  const paymentMessage = getOrderPaymentNotice({
    paymentStatus: order.payment.status,
    orderStatus: order.status,
    paymentParam
  });

  return (
    <div className="page">
      <section className="section">
        <div className="page-header">
          <div>
            <p className="eyebrow">Confirmation</p>
            <h1>{summary.title}</h1>
            <p className="lead">{summary.description}</p>
          </div>
        </div>

        {paymentMessage ? (
          <p
            className={
              paymentMessage.kind === "success" ? "admin-success" : "admin-alert"
            }
          >
            {paymentMessage.text}
          </p>
        ) : null}

        <div className="cart-layout order-confirmation-layout">
          <div className="checkout-line-list">
            <article className="store-card checkout-line">
              <div className="stack">
                <p className="eyebrow">Synthèse</p>
                <h2>{summary.title}</h2>
                <p className="card-copy">{summary.description}</p>
                <p className="card-meta">Prochaine étape : {summary.nextStep}</p>
              </div>

              <div className="admin-product-tags">
                <span className="admin-chip">
                  {getOrderStatusLabel(order.status)}
                </span>
                <span className="admin-chip">
                  {getPaymentStatusLabel(order.payment.status)}
                </span>
              </div>
            </article>

            <article className="store-card checkout-line">
              <div className="stack">
                <p className="meta-label">Référence</p>
                <p className="card-copy">{order.reference}</p>
              </div>

              <div className="stack">
                <p className="meta-label">Statut</p>
                <p className="card-copy">{getOrderStatusLabel(order.status)}</p>
              </div>

              <div className="stack">
                <p className="meta-label">Paiement</p>
                <p className="card-copy">
                  {getPaymentStatusLabel(order.payment.status)}
                </p>
              </div>

              <div className="stack">
                <p className="meta-label">Créée le</p>
                <p className="card-copy">
                  {orderDateTimeFormatter.format(new Date(order.createdAt))}
                </p>
              </div>
            </article>

            <article className="store-card checkout-line">
              <div className="stack">
                <p className="eyebrow">Cliente</p>
                <h2>
                  {order.customerFirstName} {order.customerLastName}
                </h2>
                <p className="card-copy">{order.customerEmail}</p>
                {order.customerPhone ? (
                  <p className="card-meta">{order.customerPhone}</p>
                ) : null}
              </div>
            </article>

            <article className="store-card checkout-line">
              <div className="stack">
                <p className="eyebrow">Livraison</p>
                <h2>Adresse de livraison</h2>
                <p className="card-copy">{order.shippingAddressLine1}</p>
                {order.shippingAddressLine2 ? (
                  <p className="card-copy">{order.shippingAddressLine2}</p>
                ) : null}
                <p className="card-copy">
                  {order.shippingPostalCode} {order.shippingCity}
                </p>
                <p className="card-meta">{order.shippingCountryCode}</p>
                {order.shippedAt ? (
                  <p className="card-meta">
                    Date d&apos;expédition :{" "}
                    {orderDateTimeFormatter.format(new Date(order.shippedAt))}
                  </p>
                ) : null}
                {order.trackingReference ? (
                  <p className="card-meta">
                    Référence de suivi : {order.trackingReference}
                  </p>
                ) : null}
              </div>
            </article>

            <article className="store-card checkout-line">
              <div className="stack">
                <p className="eyebrow">Facturation</p>
                <h2>Adresse de facturation</h2>
                {order.billingSameAsShipping ? (
                  <p className="card-copy">
                    Identique à l&apos;adresse de livraison.
                  </p>
                ) : (
                  <>
                    <p className="card-copy">
                      {order.billingFirstName} {order.billingLastName}
                    </p>
                    {order.billingPhone ? (
                      <p className="card-meta">{order.billingPhone}</p>
                    ) : null}
                    <p className="card-copy">{order.billingAddressLine1}</p>
                    {order.billingAddressLine2 ? (
                      <p className="card-copy">{order.billingAddressLine2}</p>
                    ) : null}
                    <p className="card-copy">
                      {order.billingPostalCode} {order.billingCity}
                    </p>
                    <p className="card-meta">{order.billingCountryCode}</p>
                  </>
                )}
              </div>
            </article>
          </div>

          <aside className="product-panel checkout-summary">
            <div className="stack">
              <p className="eyebrow">Récapitulatif</p>
              <h2>Lignes de commande</h2>
            </div>

            <div className="checkout-line-list">
              {order.lines.map((line) => (
                <article className="store-card checkout-line" key={line.id}>
                  <div className="stack">
                    <h3>{line.productName}</h3>
                    <p className="variant-meta">
                      {line.variantName} · {line.colorName}
                      {line.colorHex ? ` · ${line.colorHex}` : ""}
                    </p>
                  </div>

                  <div className="stack">
                    <p className="meta-label">SKU</p>
                    <p className="card-copy">{line.sku}</p>
                  </div>

                  <div className="stack">
                    <p className="meta-label">Quantité</p>
                    <p className="card-copy">{line.quantity}</p>
                  </div>

                  <div className="stack">
                    <p className="meta-label">Prix unitaire figé</p>
                    <p className="card-copy">{line.unitPrice}</p>
                  </div>

                  <div className="stack">
                    <p className="meta-label">Sous-total</p>
                    <p className="card-copy">{line.lineTotal}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="stack">
              <p className="meta-label">Total commande</p>
              <p className="card-copy">{order.totalAmount}</p>
            </div>

            <div className="admin-inline-actions">
              {order.status === "pending" ? (
                <form action={startOrderPaymentAction}>
                  <input name="reference" type="hidden" value={order.reference} />
                  <button className="button" type="submit">
                    Payer la commande
                  </button>
                </form>
              ) : null}
              <Link className="button" href="/boutique">
                Retour à la boutique
              </Link>
              <Link className="link link-subtle" href="/panier">
                Voir le panier
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

import { notFound } from "next/navigation";
import { Notice } from "@/components/ui/notice";
import { PageHeader } from "@/components/ui/page-header";
import { SectionIntro } from "@/components/ui/section-intro";
import {
  findAdminOrderById,
  type OrderEmailEventStatus,
  type OrderStatus
} from "@/db/repositories/order.repository";
import { getAllowedOrderStatusTransitions } from "@/entities/order/order-status-transition";
import {
  getOrderStatusLabel,
  getOrderStatusSummary,
  getPaymentStatusLabel
} from "@/entities/order/order-status-presentation";
import { shipOrderAction } from "@/features/admin/orders/actions/ship-order-action";
import { updateOrderStatusAction } from "@/features/admin/orders/actions/update-order-status-action";

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

const orderDateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short"
});

function getOrderTransitionLabel(status: OrderStatus): string {
  switch (status) {
    case "preparing":
      return "Marquer en préparation";
    case "cancelled":
      return "Annuler la commande";
    default:
      return status;
  }
}

function getEmailEventLabel(eventType: string): string {
  switch (eventType) {
    case "payment_succeeded":
      return "Paiement réussi";
    case "order_shipped":
      return "Commande expédiée";
    case "order_created":
    default:
      return "Commande créée";
  }
}

function getEmailEventStatusLabel(status: OrderEmailEventStatus): string {
  switch (status) {
    case "sent":
      return "Envoyé";
    case "failed":
      return "Échec";
    case "pending":
    default:
      return "En attente";
  }
}

export default async function AdminOrderDetailPage({
  params,
  searchParams
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const orderStatusParam = Array.isArray(resolvedSearchParams.order_status)
    ? resolvedSearchParams.order_status[0]
    : resolvedSearchParams.order_status;
  const orderErrorParam = Array.isArray(resolvedSearchParams.order_error)
    ? resolvedSearchParams.order_error[0]
    : resolvedSearchParams.order_error;
  const order = await findAdminOrderById(id);

  if (order === null) {
    notFound();
  }

  const allowedTransitions = getAllowedOrderStatusTransitions(order.status);
  const summary = getOrderStatusSummary({
    orderStatus: order.status,
    paymentStatus: order.payment.status
  });
  const statusMessage =
    orderStatusParam === "updated"
      ? "Le statut de la commande a été mis à jour."
      : orderStatusParam === "shipped"
        ? "La commande a été marquée comme expédiée."
      : null;
  const errorMessage =
    orderErrorParam === "invalid_transition"
      ? "Cette transition n'est pas autorisée."
      : orderErrorParam === "ship_failed"
        ? "La commande n'a pas pu être marquée comme expédiée."
      : orderErrorParam === "update_failed"
        ? "La commande n'a pas pu être mise à jour."
        : null;

  return (
    <div className="admin-record-list">
      <section className="section">
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

        <div className="cart-layout">
          <div className="checkout-line-list">
            <article className="store-card checkout-line">
              <div className="stack">
                <SectionIntro
                  description={summary.description}
                  eyebrow="Synthèse"
                  title={summary.title}
                />
                <Notice tone="note">{summary.nextStep}</Notice>
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
              <SectionIntro
                className="stack"
                description="Vérifiez le statut, puis utilisez l'action disponible si une étape reste à effectuer."
                eyebrow="Actions"
                title="État actuel"
              />

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

              {allowedTransitions.length > 0 ? (
                <div className="admin-inline-actions">
                  {allowedTransitions.includes("shipped") ? (
                    <form action={shipOrderAction} className="admin-form">
                      <input name="orderId" type="hidden" value={order.id} />
                      <label className="admin-field">
                        <span className="meta-label">
                          Référence de suivi optionnelle
                        </span>
                        <input
                          defaultValue={order.trackingReference ?? ""}
                          name="trackingReference"
                          placeholder="Ex. COLISSIMO-123456"
                          type="text"
                        />
                      </label>
                      <button className="button" type="submit">
                        Marquer comme expédiée
                      </button>
                    </form>
                  ) : null}

                  {allowedTransitions
                    .filter((nextStatus) => nextStatus !== "shipped")
                    .map((nextStatus) => (
                      <form action={updateOrderStatusAction} key={nextStatus}>
                        <input name="orderId" type="hidden" value={order.id} />
                        <input name="nextStatus" type="hidden" value={nextStatus} />
                        <button
                          className={
                            nextStatus === "cancelled"
                              ? "button admin-danger-button"
                              : "button"
                          }
                          type="submit"
                        >
                          {getOrderTransitionLabel(nextStatus)}
                        </button>
                      </form>
                    ))}
                </div>
              ) : (
                <Notice tone="note">
                  Aucune autre action n&apos;est disponible pour cette commande.
                </Notice>
              )}
            </article>

            <article className="store-card checkout-line">
              <div className="stack">
                <SectionIntro
                  description={
                    order.shippedAt
                      ? `Expédiée le ${orderDateTimeFormatter.format(
                          new Date(order.shippedAt)
                        )}`
                      : "La commande n'a pas encore été expédiée."
                  }
                  eyebrow="Expédition"
                  title="Suivi simple"
                />
                {order.trackingReference ? (
                  <p className="card-meta">
                    Référence de suivi : {order.trackingReference}
                  </p>
                ) : null}
              </div>
            </article>

            <article className="store-card checkout-line">
              <div className="stack">
                <p className="eyebrow">Paiement</p>
                <h2>État du paiement</h2>
                <p className="card-copy">
                  Prestataire : {order.payment.provider}
                </p>
                <p className="card-copy">
                  Méthode : {order.payment.method}
                </p>
                <p className="card-copy">
                  Montant : {order.payment.amount} {order.payment.currency.toUpperCase()}
                </p>
                {order.payment.stripeCheckoutSessionId ? (
                  <p className="card-meta">
                    Session Stripe : {order.payment.stripeCheckoutSessionId}
                  </p>
                ) : null}
                {order.payment.stripePaymentIntentId ? (
                  <p className="card-meta">
                    Identifiant de paiement : {order.payment.stripePaymentIntentId}
                  </p>
                ) : null}
              </div>
            </article>

            <article className="store-card checkout-line">
              <div className="stack">
                <p className="eyebrow">Emails transactionnels</p>
                <h2>Trace minimale</h2>
                {order.emailEvents.length === 0 ? (
                  <p className="card-copy">
                    Aucun e-mail transactionnel n&apos;a encore été enregistré pour
                    cette commande.
                  </p>
                ) : (
                  <div className="checkout-line-list">
                    {order.emailEvents.map((emailEvent) => (
                      <article
                        className="store-card checkout-line"
                        key={emailEvent.id}
                      >
                        <div className="stack">
                          <p className="meta-label">Événement</p>
                          <p className="card-copy">
                            {getEmailEventLabel(emailEvent.eventType)}
                          </p>
                        </div>

                        <div className="stack">
                          <p className="meta-label">Statut</p>
                          <p className="card-copy">
                            {getEmailEventStatusLabel(emailEvent.status)}
                          </p>
                        </div>

                        <div className="stack">
                          <p className="meta-label">Destinataire</p>
                          <p className="card-copy">
                            {emailEvent.recipientEmail}
                          </p>
                        </div>

                        {emailEvent.sentAt ? (
                          <p className="card-meta">
                            Envoyé le{" "}
                            {orderDateTimeFormatter.format(
                              new Date(emailEvent.sentAt)
                            )}
                          </p>
                        ) : null}

                        {emailEvent.lastError ? (
                          <p className="card-meta">
                            Erreur : {emailEvent.lastError}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                )}
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
          </aside>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import {
  readGuestCheckoutContextByToken,
  type GuestCheckoutContext
} from "@/db/repositories/guest-cart.repository";
import { createOrderAction } from "@/features/checkout/actions/create-order-action";
import { saveGuestCheckoutAction } from "@/features/checkout/actions/save-guest-checkout-action";
import { readCartSessionToken } from "@/lib/cart-session";

export const dynamic = "force-dynamic";

type CheckoutPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
    status?: string | string[];
  }>;
}>;

function getStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "saved":
      return "Les informations de commande ont été enregistrées.";
    default:
      return null;
  }
}

function getErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_cart":
    case "empty_cart":
      return "Ajoutez au moins un article au panier avant de continuer.";
    case "cart_unavailable":
      return "Le panier contient un ou plusieurs articles indisponibles. Corrigez le panier avant de continuer.";
    case "missing_customer_email":
    case "invalid_customer_email":
      return "Renseignez une adresse email valide.";
    case "missing_customer_first_name":
      return "Renseignez le prénom.";
    case "missing_customer_last_name":
      return "Renseignez le nom.";
    case "missing_shipping_address_line_1":
      return "Renseignez l'adresse de livraison.";
    case "missing_shipping_postal_code":
    case "invalid_shipping_postal_code":
      return "Renseignez un code postal de livraison à 5 chiffres.";
    case "missing_shipping_city":
      return "Renseignez la ville de livraison.";
    case "missing_billing_first_name":
      return "Renseignez le prénom de facturation.";
    case "missing_billing_last_name":
      return "Renseignez le nom de facturation.";
    case "missing_billing_address_line_1":
      return "Renseignez l'adresse de facturation.";
    case "missing_billing_postal_code":
    case "invalid_billing_postal_code":
      return "Renseignez un code postal de facturation à 5 chiffres.";
    case "missing_billing_city":
      return "Renseignez la ville de facturation.";
    case "missing_checkout":
      return "Renseignez vos informations avant de créer la commande.";
    case "save_failed":
      return "Les informations de commande n'ont pas pu être enregistrées.";
    case "create_failed":
      return "La commande n'a pas pu être créée.";
    default:
      return null;
  }
}

function getAvailabilityLabel(isAvailable: boolean): string {
  return isAvailable ? "Disponible" : "Temporairement indisponible";
}

async function readCheckoutContext(): Promise<GuestCheckoutContext | null> {
  const cartToken = await readCartSessionToken();

  if (cartToken === null) {
    return null;
  }

  return readGuestCheckoutContextByToken(cartToken);
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const resolvedSearchParams = await searchParams;
  const statusParam = Array.isArray(resolvedSearchParams.status)
    ? resolvedSearchParams.status[0]
    : resolvedSearchParams.status;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const statusMessage = getStatusMessage(statusParam);
  const errorMessage = getErrorMessage(errorParam);
  const checkoutContext = await readCheckoutContext();
  const cart = checkoutContext?.cart ?? null;
  const draft = checkoutContext?.draft ?? null;
  const issues = checkoutContext?.issues ?? ["empty_cart"];
  const checkoutIssueMessage =
    errorMessage === null && issues.includes("cart_unavailable")
      ? "Le panier contient un ou plusieurs articles indisponibles. Corrigez le panier avant de continuer."
      : null;
  const canSave = cart !== null && issues.length === 0;
  const billingSameAsShipping = draft?.billingSameAsShipping ?? true;

  return (
    <div className="page checkout-page">
      <section className="section">
        <div className="page-header">
          <div>
            <p className="eyebrow">Commande</p>
            <h1>Finaliser la commande</h1>
            <p className="lead">
              Renseignez vos informations, puis créez la commande quand le
              panier est prêt.
            </p>
          </div>
        </div>

        {statusMessage ? <p className="admin-success">{statusMessage}</p> : null}
        {errorMessage ? (
          <p className="admin-alert" role="alert">
            {errorMessage}
          </p>
        ) : null}
        {checkoutIssueMessage ? (
          <p className="admin-alert" role="alert">
            {checkoutIssueMessage}
          </p>
        ) : null}

        {cart ? (
          <div className="checkout-layout">
            <form
              className="admin-form checkout-form"
              noValidate
            >
              <section className="admin-homepage-section">
                <div className="stack">
                  <p className="eyebrow">Contact</p>
                  <h2>Vos informations</h2>
                </div>

                <div className="admin-panels">
                  <label className="admin-field">
                    <span className="meta-label">Prénom</span>
                    <input
                      className="admin-input"
                      defaultValue={draft?.customerFirstName ?? ""}
                      name="customerFirstName"
                      required
                      type="text"
                    />
                  </label>

                  <label className="admin-field">
                    <span className="meta-label">Nom</span>
                    <input
                      className="admin-input"
                      defaultValue={draft?.customerLastName ?? ""}
                      name="customerLastName"
                      required
                      type="text"
                    />
                  </label>
                </div>

                <div className="admin-panels">
                  <label className="admin-field">
                    <span className="meta-label">Email</span>
                    <input
                      className="admin-input"
                      defaultValue={draft?.customerEmail ?? ""}
                      name="customerEmail"
                      required
                      type="email"
                    />
                  </label>

                  <label className="admin-field">
                    <span className="meta-label">Téléphone</span>
                    <input
                      className="admin-input"
                      defaultValue={draft?.customerPhone ?? ""}
                      name="customerPhone"
                      type="tel"
                    />
                  </label>
                </div>
              </section>

              <section className="admin-homepage-section">
                <div className="stack">
                  <p className="eyebrow">Livraison</p>
                  <h2>Adresse de livraison</h2>
                </div>

                <label className="admin-field">
                  <span className="meta-label">Adresse ligne 1</span>
                  <input
                    className="admin-input"
                    defaultValue={draft?.shippingAddressLine1 ?? ""}
                    name="shippingAddressLine1"
                    required
                    type="text"
                  />
                </label>

                <label className="admin-field">
                  <span className="meta-label">Adresse ligne 2</span>
                  <input
                    className="admin-input"
                    defaultValue={draft?.shippingAddressLine2 ?? ""}
                    name="shippingAddressLine2"
                    type="text"
                  />
                </label>

                <div className="admin-panels">
                  <label className="admin-field">
                    <span className="meta-label">Code postal</span>
                    <input
                      className="admin-input"
                      defaultValue={draft?.shippingPostalCode ?? ""}
                      inputMode="numeric"
                      maxLength={5}
                      name="shippingPostalCode"
                      pattern="[0-9]{5}"
                      required
                      type="text"
                    />
                  </label>

                  <label className="admin-field">
                    <span className="meta-label">Ville</span>
                    <input
                      className="admin-input"
                      defaultValue={draft?.shippingCity ?? ""}
                      name="shippingCity"
                      required
                      type="text"
                    />
                  </label>
                </div>

                <div className="stack">
                  <p className="meta-label">Pays</p>
                  <p className="card-copy">France</p>
                </div>
              </section>

              <section className="admin-homepage-section">
                <div className="stack">
                  <p className="eyebrow">Facturation</p>
                  <h2>Adresse de facturation</h2>
                </div>

                <label className="admin-checkbox">
                  <input
                    defaultChecked={billingSameAsShipping}
                    name="billingSameAsShipping"
                    type="checkbox"
                    value="true"
                  />
                  <span>Adresse de facturation identique</span>
                </label>

                <p className="admin-muted-note">
                  Laissez la case cochée pour réutiliser l&apos;adresse de livraison.
                </p>

                <div className="admin-panels">
                  <label className="admin-field">
                    <span className="meta-label">Prénom</span>
                    <input
                      className="admin-input"
                      defaultValue={draft?.billingFirstName ?? ""}
                      name="billingFirstName"
                      type="text"
                    />
                  </label>

                  <label className="admin-field">
                    <span className="meta-label">Nom</span>
                    <input
                      className="admin-input"
                      defaultValue={draft?.billingLastName ?? ""}
                      name="billingLastName"
                      type="text"
                    />
                  </label>
                </div>

                <div className="admin-panels">
                  <label className="admin-field">
                    <span className="meta-label">Téléphone</span>
                    <input
                      className="admin-input"
                      defaultValue={draft?.billingPhone ?? ""}
                      name="billingPhone"
                      type="tel"
                    />
                  </label>
                </div>

                <label className="admin-field">
                  <span className="meta-label">Adresse ligne 1</span>
                  <input
                    className="admin-input"
                    defaultValue={draft?.billingAddressLine1 ?? ""}
                    name="billingAddressLine1"
                    type="text"
                  />
                </label>

                <label className="admin-field">
                  <span className="meta-label">Adresse ligne 2</span>
                  <input
                    className="admin-input"
                    defaultValue={draft?.billingAddressLine2 ?? ""}
                    name="billingAddressLine2"
                    type="text"
                  />
                </label>

                <div className="admin-panels">
                  <label className="admin-field">
                    <span className="meta-label">Code postal</span>
                    <input
                      className="admin-input"
                      defaultValue={draft?.billingPostalCode ?? ""}
                      inputMode="numeric"
                      maxLength={5}
                      name="billingPostalCode"
                      pattern="[0-9]{5}"
                      type="text"
                    />
                  </label>

                  <label className="admin-field">
                    <span className="meta-label">Ville</span>
                    <input
                      className="admin-input"
                      defaultValue={draft?.billingCity ?? ""}
                      name="billingCity"
                      type="text"
                    />
                  </label>
                </div>

                <div className="stack">
                  <p className="meta-label">Pays</p>
                  <p className="card-copy">France</p>
                </div>
              </section>

              <div className="admin-inline-actions">
                {canSave ? (
                  <>
                    <p className="admin-muted-note">
                      Créez la commande une fois vos informations complètes.
                      Vous pouvez aussi les enregistrer pour plus tard.
                    </p>
                    <button className="button" formAction={createOrderAction} type="submit">
                      Créer la commande
                    </button>
                    <button
                      className="button link-subtle"
                      formAction={saveGuestCheckoutAction}
                      type="submit"
                    >
                      Enregistrer mes informations
                    </button>
                  </>
                ) : (
                  <p className="admin-muted-note">
                    La commande reste bloquée tant que le panier n&apos;est pas
                    corrigé.
                  </p>
                )}

                <Link className="link link-subtle" href="/panier">
                  Retour au panier
                </Link>
              </div>
            </form>

            <aside className="product-panel checkout-summary">
              <div className="stack">
                <p className="eyebrow">Récapitulatif</p>
                <h2>Panier final</h2>
              </div>

              {cart.lines.length > 0 ? (
                <div className="checkout-line-list">
                  {cart.lines.map((line) => (
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
                        <p className="meta-label">Prix unitaire actuel</p>
                        <p className="card-copy">{line.unitPrice}</p>
                      </div>

                      <div className="stack">
                        <p className="meta-label">Sous-total</p>
                        <p className="card-copy">{line.lineTotal}</p>
                      </div>

                      <div className="stack">
                        <p className="meta-label">Disponibilité</p>
                        <p className="card-copy">
                          {getAvailabilityLabel(line.isAvailable)}
                        </p>
                        {!line.isAvailable ? (
                          <p className="admin-alert">
                            Cette ligne bloque la commande tant qu&apos;elle
                            n&apos;est pas corrigée dans le panier.
                          </p>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p className="eyebrow">Panier vide</p>
                  <h2>Aucune ligne à valider</h2>
                  <p className="card-copy">
                    Revenez à la boutique pour ajouter un article au panier.
                  </p>
                </div>
              )}

              <div className="stack">
                <p className="meta-label">Quantité totale</p>
                <p className="card-copy">{cart.itemCount}</p>
              </div>

              <div className="stack">
                <p className="meta-label">Sous-total panier</p>
                <p className="card-copy">{cart.subtotal}</p>
              </div>
            </aside>
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Commande indisponible</p>
            <h2>Ajoutez d&apos;abord un article au panier</h2>
            <p className="card-copy">
              Ajoutez d&apos;abord un article disponible au panier pour
              finaliser la commande.
            </p>
            <div className="button-row">
              <Link className="button" href="/boutique">
                Voir la boutique
              </Link>
              <Link className="link link-subtle" href="/panier">
                Retour au panier
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notice } from "@/components/notice";
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
    <div className="page">
      <section className="section">
        <div className="mb-6 grid gap-2">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">
            Commande
          </p>
          <h1 className="m-0">Finaliser la commande</h1>
          <p className="mt-1 leading-relaxed text-muted-foreground">
            Renseignez vos informations, puis créez la commande quand le
            panier est prêt.
          </p>
        </div>

        {statusMessage ? (
          <Notice tone="success">{statusMessage}</Notice>
        ) : null}
        {errorMessage ? (
          <Notice tone="alert">{errorMessage}</Notice>
        ) : null}
        {checkoutIssueMessage ? (
          <Notice tone="alert">{checkoutIssueMessage}</Notice>
        ) : null}

        {cart ? (
          <div className="checkout-layout">
            <form
              className="grid gap-4 content-start"
              noValidate
            >
              <section className="grid gap-4 rounded-xl border border-border/70 bg-white/80 p-5">
                <div className="grid gap-1">
                  <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">Contact</p>
                  <h2>Vos informations</h2>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="customerFirstName">Prénom</Label>
                    <Input
                      defaultValue={draft?.customerFirstName ?? ""}
                      id="customerFirstName"
                      name="customerFirstName"
                      required
                      type="text"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="customerLastName">Nom</Label>
                    <Input
                      defaultValue={draft?.customerLastName ?? ""}
                      id="customerLastName"
                      name="customerLastName"
                      required
                      type="text"
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      defaultValue={draft?.customerEmail ?? ""}
                      id="customerEmail"
                      name="customerEmail"
                      required
                      type="email"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="customerPhone">Téléphone</Label>
                    <Input
                      defaultValue={draft?.customerPhone ?? ""}
                      id="customerPhone"
                      name="customerPhone"
                      type="tel"
                    />
                  </div>
                </div>
              </section>

              <section className="grid gap-4 rounded-xl border border-border/70 bg-white/80 p-5">
                <div className="grid gap-1">
                  <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">Livraison</p>
                  <h2>Adresse de livraison</h2>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="shippingAddressLine1">Adresse ligne 1</Label>
                  <Input
                    defaultValue={draft?.shippingAddressLine1 ?? ""}
                    id="shippingAddressLine1"
                    name="shippingAddressLine1"
                    required
                    type="text"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="shippingAddressLine2">Adresse ligne 2</Label>
                  <Input
                    defaultValue={draft?.shippingAddressLine2 ?? ""}
                    id="shippingAddressLine2"
                    name="shippingAddressLine2"
                    type="text"
                  />
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="shippingPostalCode">Code postal</Label>
                    <Input
                      defaultValue={draft?.shippingPostalCode ?? ""}
                      id="shippingPostalCode"
                      inputMode="numeric"
                      maxLength={5}
                      name="shippingPostalCode"
                      pattern="[0-9]{5}"
                      required
                      type="text"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="shippingCity">Ville</Label>
                    <Input
                      defaultValue={draft?.shippingCity ?? ""}
                      id="shippingCity"
                      name="shippingCity"
                      required
                      type="text"
                    />
                  </div>
                </div>

                <div className="grid gap-1">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Pays</p>
                  <p className="card-copy">France</p>
                </div>
              </section>

              <section className="grid gap-4 rounded-xl border border-border/70 bg-white/80 p-5">
                <div className="grid gap-1">
                  <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">Facturation</p>
                  <h2>Adresse de facturation</h2>
                </div>

                <label className="flex items-center gap-3 text-sm text-foreground">
                  <input
                    className="size-4"
                    defaultChecked={billingSameAsShipping}
                    name="billingSameAsShipping"
                    type="checkbox"
                    value="true"
                  />
                  <span>Adresse de facturation identique</span>
                </label>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  Laissez la case cochée pour réutiliser l&apos;adresse de livraison.
                </p>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="billingFirstName">Prénom</Label>
                    <Input
                      defaultValue={draft?.billingFirstName ?? ""}
                      id="billingFirstName"
                      name="billingFirstName"
                      type="text"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="billingLastName">Nom</Label>
                    <Input
                      defaultValue={draft?.billingLastName ?? ""}
                      id="billingLastName"
                      name="billingLastName"
                      type="text"
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="billingPhone">Téléphone</Label>
                    <Input
                      defaultValue={draft?.billingPhone ?? ""}
                      id="billingPhone"
                      name="billingPhone"
                      type="tel"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="billingAddressLine1">Adresse ligne 1</Label>
                  <Input
                    defaultValue={draft?.billingAddressLine1 ?? ""}
                    id="billingAddressLine1"
                    name="billingAddressLine1"
                    type="text"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="billingAddressLine2">Adresse ligne 2</Label>
                  <Input
                    defaultValue={draft?.billingAddressLine2 ?? ""}
                    id="billingAddressLine2"
                    name="billingAddressLine2"
                    type="text"
                  />
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="billingPostalCode">Code postal</Label>
                    <Input
                      defaultValue={draft?.billingPostalCode ?? ""}
                      id="billingPostalCode"
                      inputMode="numeric"
                      maxLength={5}
                      name="billingPostalCode"
                      pattern="[0-9]{5}"
                      type="text"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="billingCity">Ville</Label>
                    <Input
                      defaultValue={draft?.billingCity ?? ""}
                      id="billingCity"
                      name="billingCity"
                      type="text"
                    />
                  </div>
                </div>

                <div className="grid gap-1">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Pays</p>
                  <p className="card-copy">France</p>
                </div>
              </section>

              <div className="flex flex-wrap gap-3">
                {canSave ? (
                  <>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Créez la commande une fois vos informations complètes.
                      Vous pouvez aussi les enregistrer pour plus tard.
                    </p>
                    <Button
                      formAction={createOrderAction}
                      type="submit">
                      Créer la commande
                    </Button>
                    <Button
                      formAction={saveGuestCheckoutAction}
                      type="submit"
                      variant="ghost">
                      Enregistrer mes informations
                    </Button>
                  </>
                ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    La commande reste bloquée tant que le panier n&apos;est pas
                    corrigé.
                  </p>
                )}

                <Link
                  className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  href="/panier">
                  Retour au panier
                </Link>
              </div>
            </form>

            <aside className="product-panel checkout-summary">
              <div className="grid gap-1">
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">Récapitulatif</p>
                <h2>Panier final</h2>
              </div>

              {cart.lines.length > 0 ? (
                <div className="grid gap-4">
                  {cart.lines.map((line) => (
                    <article className="store-card checkout-line" key={line.id}>
                      <div className="grid gap-1">
                        <h3>{line.productName}</h3>
                        <p className="text-[0.95rem] text-foreground/68">
                          {line.variantName} · {line.colorName}
                          {line.colorHex ? ` · ${line.colorHex}` : ""}
                        </p>
                      </div>

                      <div className="grid gap-1">
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">SKU</p>
                        <p className="card-copy">{line.sku}</p>
                      </div>

                      <div className="grid gap-1">
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Quantité</p>
                        <p className="card-copy">{line.quantity}</p>
                      </div>

                      <div className="grid gap-1">
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Prix unitaire actuel</p>
                        <p className="card-copy">{line.unitPrice}</p>
                      </div>

                      <div className="grid gap-1">
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Sous-total</p>
                        <p className="card-copy">{line.lineTotal}</p>
                      </div>

                      <div className="grid gap-1">
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Disponibilité</p>
                        <p className="card-copy">
                          {getAvailabilityLabel(line.isAvailable)}
                        </p>
                        {!line.isAvailable ? (
                          <Notice tone="alert">
                            Cette ligne bloque la commande tant qu&apos;elle
                            n&apos;est pas corrigée dans le panier.
                          </Notice>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">Panier vide</p>
                  <h2>Aucune ligne à valider</h2>
                  <p className="card-copy">
                    Revenez à la boutique pour ajouter un article au panier.
                  </p>
                </div>
              )}

              <div className="grid gap-1">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Quantité totale</p>
                <p className="card-copy">{cart.itemCount}</p>
              </div>

              <div className="grid gap-1">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Sous-total panier</p>
                <p className="card-copy">{cart.subtotal}</p>
              </div>
            </aside>
          </div>
        ) : (
          <div className="empty-state">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">Commande indisponible</p>
            <h2>Ajoutez d&apos;abord un article au panier</h2>
            <p className="card-copy">
              Ajoutez d&apos;abord un article disponible au panier pour
              finaliser la commande.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/boutique">Voir la boutique</Link>
              </Button>
              <Link
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                href="/panier">
                Retour au panier
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

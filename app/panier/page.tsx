import Link from "next/link";
import {
  readGuestCartByToken,
  type GuestCart
} from "@/db/repositories/guest-cart.repository";
import { updateCartItemQuantityAction } from "@/features/cart/actions/update-cart-item-quantity-action";
import { removeCartItemAction } from "@/features/cart/actions/remove-cart-item-action";
import { readCartSessionToken } from "@/lib/cart-session";

export const dynamic = "force-dynamic";

type CartPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
    status?: string | string[];
  }>;
}>;

function getStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "updated":
      return "Quantité du panier mise à jour.";
    case "removed":
      return "Ligne retirée du panier.";
    default:
      return null;
  }
}

function getErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_cart":
    case "missing_cart_item":
      return "La ligne de panier demandée est introuvable.";
    case "missing_quantity":
    case "invalid_quantity":
      return "Renseignez une quantité entière supérieure ou égale à 1.";
    case "missing_variant":
      return "La déclinaison demandée est introuvable.";
    case "variant_unavailable":
      return "Cette ligne n'est plus disponible pour le moment.";
    case "insufficient_stock":
      return "Le stock disponible est insuffisant pour cette quantité.";
    case "save_failed":
      return "Le panier n'a pas pu être mis à jour.";
    default:
      return null;
  }
}

function getAvailabilityLabel(isAvailable: boolean): string {
  return isAvailable ? "Disponible" : "Temporairement indisponible";
}

async function readGuestCart(): Promise<GuestCart | null> {
  const cartToken = await readCartSessionToken();

  if (cartToken === null) {
    return null;
  }

  return readGuestCartByToken(cartToken);
}

export default async function CartPage({ searchParams }: CartPageProps) {
  const resolvedSearchParams = await searchParams;
  const statusParam = Array.isArray(resolvedSearchParams.status)
    ? resolvedSearchParams.status[0]
    : resolvedSearchParams.status;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const statusMessage = getStatusMessage(statusParam);
  const errorMessage = getErrorMessage(errorParam);
  const cart = await readGuestCart();
  const hasUnavailableLine = cart?.lines.some((line) => !line.isAvailable) ?? false;

  return (
    <div className="page cart-page">
      <section className="section">
        <div className="page-header">
          <div>
            <p className="eyebrow">Panier</p>
            <h1>Votre panier</h1>
            <p className="lead">
              Vérifiez la disponibilité de vos articles, puis ajustez les
              quantités avant de finaliser la commande.
            </p>
          </div>
        </div>

        {statusMessage ? <p className="admin-success">{statusMessage}</p> : null}
        {errorMessage ? (
          <p className="admin-alert" role="alert">
            {errorMessage}
          </p>
        ) : null}

        {cart && cart.lines.length > 0 ? (
          <div className="cart-layout">
            <div className="cart-list">
              {cart.lines.map((line) => (
                <article className="store-card cart-line" key={line.id}>
                  <div className="stack">
                    <p className="card-kicker">Produit</p>
                    <h2>{line.productName}</h2>
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
                        Cette ligne bloque la commande. Revenez à la fiche
                        produit ou supprimez-la pour continuer.
                      </p>
                    ) : null}
                  </div>

                  <form action={updateCartItemQuantityAction} className="cart-line-form">
                    <input name="itemId" type="hidden" value={line.id} />

                    <label className="admin-field cart-quantity-field">
                      <span className="meta-label">Quantité</span>
                      <input
                        className="admin-input"
                        defaultValue={String(line.quantity)}
                        min="1"
                        name="quantity"
                        required
                        step="1"
                        type="number"
                      />
                    </label>

                    <div className="admin-inline-actions">
                      <button className="button" type="submit">
                        Mettre à jour la quantité
                      </button>
                    </div>
                  </form>

                  <form action={removeCartItemAction}>
                    <input name="itemId" type="hidden" value={line.id} />

                    <button className="button link-subtle" type="submit">
                      Supprimer la ligne
                    </button>
                  </form>

                  <Link className="link" href={`/boutique/${line.productSlug}`}>
                    Retour à la fiche produit
                  </Link>
                </article>
              ))}
            </div>

            <aside className="product-panel cart-summary">
              {hasUnavailableLine ? (
                <p className="admin-alert">
                  Au moins une ligne bloque la commande. Corrigez le panier
                  avant de continuer.
                </p>
              ) : null}

              <div className="stack">
                <p className="meta-label">Lignes</p>
                <p className="card-copy">{cart.lines.length}</p>
              </div>

              <div className="stack">
                <p className="meta-label">Quantité totale</p>
                <p className="card-copy">{cart.itemCount}</p>
              </div>

              <div className="stack">
                <p className="meta-label">Sous-total panier</p>
                <p className="card-copy">{cart.subtotal}</p>
              </div>

              <div className="admin-inline-actions">
                <Link className="button" href="/checkout">
                  Finaliser la commande
                </Link>
              </div>
            </aside>
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Panier vide</p>
            <h2>Aucun article n&apos;a encore été ajouté au panier</h2>
            <p className="card-copy">
              Ajoutez un article disponible depuis une fiche produit.
            </p>
            <div>
              <Link className="button" href="/boutique">
                Voir la boutique
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

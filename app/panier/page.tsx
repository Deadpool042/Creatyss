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
      return "Quantite du panier mise a jour.";
    case "removed":
      return "Ligne retiree du panier.";
    default:
      return null;
  }
}

function getErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_cart":
    case "missing_cart_item":
      return "La ligne de panier demandee est introuvable.";
    case "missing_quantity":
    case "invalid_quantity":
      return "Renseignez une quantite entiere superieure ou egale a 1.";
    case "missing_variant":
      return "La variante demandee est introuvable.";
    case "variant_unavailable":
      return "Cette ligne n'est plus disponible pour le moment.";
    case "insufficient_stock":
      return "Le stock disponible est insuffisant pour cette quantite.";
    case "save_failed":
      return "Le panier n'a pas pu etre mis a jour.";
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

  return (
    <div className="page cart-page">
      <section className="section">
        <div className="page-header">
          <div>
            <p className="eyebrow">Panier</p>
            <h1>Panier invite</h1>
            <p className="lead">
              Verifiez les variantes selectionnees avant le checkout du lot suivant.
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
                    <p className="meta-label">Disponibilite</p>
                    <p className="card-copy">
                      {getAvailabilityLabel(line.isAvailable)}
                    </p>
                    {!line.isAvailable ? (
                      <p className="card-meta">
                        Cette ligne reste visible mais ne peut pas etre
                        commandee en l&apos;etat.
                      </p>
                    ) : null}
                  </div>

                  <form action={updateCartItemQuantityAction} className="cart-line-form">
                    <input name="itemId" type="hidden" value={line.id} />

                    <label className="admin-field cart-quantity-field">
                      <span className="meta-label">Quantite</span>
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
                        Mettre a jour la quantite
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
                    Retour a la fiche produit
                  </Link>
                </article>
              ))}
            </div>

            <aside className="product-panel cart-summary">
              <div className="stack">
                <p className="meta-label">Lignes</p>
                <p className="card-copy">{cart.lines.length}</p>
              </div>

              <div className="stack">
                <p className="meta-label">Quantite totale</p>
                <p className="card-copy">{cart.itemCount}</p>
              </div>

              <div className="stack">
                <p className="meta-label">Sous-total panier</p>
                <p className="card-copy">{cart.subtotal}</p>
              </div>

              <div className="admin-inline-actions">
                <Link className="button" href="/checkout">
                  Continuer vers le checkout
                </Link>
              </div>
            </aside>
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Panier vide</p>
            <h2>Aucune variante n&apos;a encore ete ajoutee au panier</h2>
            <p className="card-copy">
              Ajoutez une variante publiee et disponible depuis une fiche produit.
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

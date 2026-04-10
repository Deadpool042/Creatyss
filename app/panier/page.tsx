import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notice } from "@/components/shared/notice";
import { readCartSessionToken } from "@/core/sessions/cart";
import { readGuestCartByToken } from "@/features/cart/lib/guest-cart.repository";
import type { GuestCart } from "@/features/cart/lib/guest-cart.types";
import { updateCartItemQuantityAction, removeCartItemAction } from "@/features/cart";

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
    <div className="page">
      <section className="section">
        <div className="mb-6 grid gap-2">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">Panier</p>
          <h1 className="m-0">Votre panier</h1>
          <p className="mt-1 leading-relaxed text-muted-foreground">
            Vérifiez la disponibilité de vos articles, puis ajustez les quantités avant de finaliser
            la commande.
          </p>
        </div>

        {statusMessage ? <Notice tone="success">{statusMessage}</Notice> : null}
        {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

        {cart && cart.lines.length > 0 ? (
          <div className="cart-layout">
            <div className="grid gap-4">
              {cart.lines.map((line) => (
                <article className="store-card cart-line" key={line.id}>
                  <div className="grid gap-1">
                    <p className="text-[0.95rem] text-foreground/68">Produit</p>
                    <h2>{line.productName}</h2>
                    <p className="text-[0.95rem] text-foreground/68">
                      {line.variantName} · {line.colorName}
                      {line.colorHex ? ` · ${line.colorHex}` : ""}
                    </p>
                  </div>

                  <div className="grid gap-1">
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                      SKU
                    </p>
                    <p className="card-copy">{line.sku}</p>
                  </div>

                  <div className="grid gap-1">
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                      Prix unitaire actuel
                    </p>
                    <p className="card-copy">{line.unitPrice}</p>
                  </div>

                  <div className="grid gap-1">
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                      Sous-total
                    </p>
                    <p className="card-copy">{line.lineTotal}</p>
                  </div>

                  <div className="grid gap-1">
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                      Disponibilité
                    </p>
                    <p className="card-copy">{getAvailabilityLabel(line.isAvailable)}</p>
                    {!line.isAvailable ? (
                      <Notice tone="alert">
                        Cette ligne bloque la commande. Revenez à la fiche produit ou supprimez-la
                        pour continuer.
                      </Notice>
                    ) : null}
                  </div>

                  <form action={updateCartItemQuantityAction} className="grid gap-4">
                    <input name="itemId" type="hidden" value={line.id} />

                    <div className="grid gap-2 max-w-[10rem]">
                      <Label htmlFor={`quantity-${line.id}`}>Quantité</Label>
                      <Input
                        defaultValue={String(line.quantity)}
                        id={`quantity-${line.id}`}
                        min="1"
                        name="quantity"
                        required
                        step="1"
                        type="number"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button type="submit">Mettre à jour la quantité</Button>
                    </div>
                  </form>

                  <form action={removeCartItemAction}>
                    <input name="itemId" type="hidden" value={line.id} />

                    <Button size="sm" type="submit" variant="ghost">
                      Supprimer la ligne
                    </Button>
                  </form>

                  <Link
                    className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    href={`/boutique/${line.productSlug}`}
                  >
                    Retour à la fiche produit
                  </Link>
                </article>
              ))}
            </div>

            <aside className="product-panel cart-summary">
              {hasUnavailableLine ? (
                <Notice tone="alert">
                  Au moins une ligne bloque la commande. Corrigez le panier avant de continuer.
                </Notice>
              ) : null}

              <div className="grid gap-1">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                  Lignes
                </p>
                <p className="card-copy">{cart.lines.length}</p>
              </div>

              <div className="grid gap-1">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                  Quantité totale
                </p>
                <p className="card-copy">{cart.itemCount}</p>
              </div>

              <div className="grid gap-1">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                  Sous-total panier
                </p>
                <p className="card-copy">{cart.subtotal}</p>
              </div>

              <Button asChild className="w-full">
                <Link href="/checkout">Finaliser la commande</Link>
              </Button>
            </aside>
          </div>
        ) : (
          <div className="empty-state">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">Panier vide</p>
            <h2>Aucun article n&apos;a encore été ajouté au panier</h2>
            <p className="card-copy">Ajoutez un article disponible depuis une fiche produit.</p>
            <Button asChild>
              <Link href="/boutique">Voir la boutique</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

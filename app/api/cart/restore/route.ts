import { type NextRequest, NextResponse } from "next/server";

import { setCartSessionToken } from "@/core/sessions/cart";
import { reactivateAbandonedCart } from "@/features/commerce/cart/lib/guest-cart.repository";

/**
 * GET /api/cart/restore?token=<base64url(cartId)>
 *
 * Lien de reprise envoyé dans l'email de relance panier abandonné (lot 7,
 * cf. docs/roadmap/analyses-cockpit-analytique/lot-7-panier-abandonne-effet-bord-cadrage.md).
 * Réactive le panier ABANDONED -> ACTIVE, pose le cookie de session panier,
 * puis redirige vers /panier. Suit le même pattern token que
 * app/api/newsletter/unsubscribe/route.ts.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.nextUrl.searchParams.get("token");
  const cartId = token ? Buffer.from(token, "base64url").toString("utf-8") : "";

  if (!cartId) {
    return NextResponse.redirect(new URL("/panier", request.url));
  }

  const reactivated = await reactivateAbandonedCart(cartId);

  if (!reactivated) {
    return NextResponse.redirect(new URL("/panier", request.url));
  }

  await setCartSessionToken(cartId);

  return NextResponse.redirect(new URL("/panier?status=restored", request.url));
}

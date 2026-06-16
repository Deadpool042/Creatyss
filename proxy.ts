import { type NextRequest, NextResponse } from "next/server";

import {
  DEFAULT_LOCALE_CODE,
  SECONDARY_LOCALE_CODES,
} from "@/core/localization/supported-locales";

/**
 * Proxy de routing localisé — lot 5 (L3 `localized-routing`).
 * Référence : docs/lots/2026-06-13-localization-l3-cadrage.md.
 *
 * Convention D2 : locale par défaut (`fr`) non préfixée, locales secondaires
 * préfixées (`/en-GB/boutique`).
 *
 * Comportement :
 * - `/en-GB/boutique` → rewrite interne vers `/boutique` + headers
 *   `x-next-locale: en-GB` et `x-next-path-without-locale: /boutique`.
 * - `/fr/boutique` (locale par défaut préfixée) → redirect 301 vers `/boutique`.
 * - Tout autre chemin storefront → passthrough avec `x-next-path-without-locale`
 *   injecté, ce qui permet au layout de construire les alternates hreflang
 *   même pour la locale par défaut (sous-lot 2, `generateMetadata`).
 *
 * La vérification du flag `localized-routing` reste côté Server Component
 * (Prisma disponible). Ce proxy tourne en Node.js runtime (défaut Next.js 16) :
 * Prisma serait techniquement disponible, mais on conserve l'approche sans DB
 * pour garder ce fichier minimal et réversible.
 *
 * Exclut explicitement au runtime : `/admin/**`, `/api/**`.
 * Exclut via matcher : `/_next/**`, fichiers avec extension.
 *
 * Nommage : renommé de `middleware.ts` → `proxy.ts` lors de la migration
 * Next.js 16 (cf. https://nextjs.org/docs/messages/middleware-to-proxy).
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Exclure admin et API (pas de routing localisé sur ces périmètres).
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const potentialLocale = segments[0] ?? null;

  // Locale par défaut préfixée (ex. /fr/boutique) → redirect 301 sans préfixe.
  // Pas besoin d'injecter les headers : la réponse est un redirect, le navigateur
  // suit et le prochain hit passera dans le bloc pass-through ci-dessous.
  if (potentialLocale !== null && potentialLocale === DEFAULT_LOCALE_CODE) {
    const url = request.nextUrl.clone();
    url.pathname = segments.length > 1 ? "/" + segments.slice(1).join("/") : "/";
    return NextResponse.redirect(url, { status: 301 });
  }

  // Locale secondaire connue → rewrite interne + injection des headers.
  const isSecondaryLocale =
    potentialLocale !== null &&
    (SECONDARY_LOCALE_CODES as readonly string[]).includes(potentialLocale);

  if (isSecondaryLocale) {
    const pathWithoutLocale =
      segments.length > 1 ? "/" + segments.slice(1).join("/") : "/";

    const url = request.nextUrl.clone();
    url.pathname = pathWithoutLocale;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-next-locale", potentialLocale as string);
    requestHeaders.set("x-next-path-without-locale", pathWithoutLocale);

    return NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
  }

  // Pass-through (locale par défaut non préfixée, homepage, routes sans locale) :
  // injecter le chemin courant pour le layout (alternates hreflang).
  // Exclut admin/api (déjà retournés plus haut).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-next-path-without-locale", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  /**
   * Correspond à toutes les routes sauf :
   * - _next/static, _next/image (assets Next.js)
   * - favicon.ico
   * - chemins avec extension de fichier (images, fonts, manifests…)
   */
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)"],
};

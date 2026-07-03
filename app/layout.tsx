//app/layout.tsx
import type { Metadata, Viewport } from "next";
import { cache, type ReactNode } from "react";
import "./globals.css";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { cn } from "@/lib/utils";
import { PublicSiteShell } from "@/components/storefront/public-site-shell";
import { LocaleSelector } from "@/components/storefront/topbar/locale-selector";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/shared/theme";
import { Toaster } from "@/components/ui/sonner";
import { clientEnv } from "@/core/config/env";
import { brandConfig } from "@/core/config/brand";
import { getStoreLogo } from "@/features/storefront/store/queries/get-store-logo-url.query";
import { DEFAULT_LOCALE_CODE, SECONDARY_LOCALE_CODES } from "@/core/localization/supported-locales";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Mémoïsation per-request du guard L3.
 * Évite un double appel DB si `generateMetadata` et `RootLayout` appellent
 * tous les deux ce guard dans la même requête (React cache = scope request).
 */
const getLocalizationL3Active = cache(() =>
  meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "localized-routing")
);

/**
 * Metadata dynamique : génère les alternates hreflang quand L3 est actif.
 * Le chemin courant est lu depuis `x-next-path-without-locale` injecté par
 * le middleware (storefront uniquement — absent sur /admin, /api).
 */
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathWithoutLocale = headersList.get("x-next-path-without-locale");

  const base: Metadata = {
    metadataBase: new URL(clientEnv.appUrl),
    title: {
      default: brandConfig.metadata.titleDefault,
      template: brandConfig.metadata.titleTemplate,
    },
    description: brandConfig.metadata.description,
  };

  // Header absent → requête admin ou non-storefront → pas d'alternates.
  if (pathWithoutLocale === null) {
    return base;
  }

  const isL3Active = await getLocalizationL3Active();

  if (!isL3Active) {
    return base;
  }

  return {
    ...base,
    alternates: {
      languages: {
        [DEFAULT_LOCALE_CODE]: `${clientEnv.appUrl}${pathWithoutLocale}`,
        ...Object.fromEntries(
          SECONDARY_LOCALE_CODES.map((code) => [
            code,
            `${clientEnv.appUrl}/${code}${pathWithoutLocale}`,
          ])
        ),
        "x-default": `${clientEnv.appUrl}${pathWithoutLocale}`,
      },
    },
  };
}

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const headersList = await headers();
  const locale = headersList.get("x-next-locale") ?? DEFAULT_LOCALE_CODE;
  const pathWithoutLocale = headersList.get("x-next-path-without-locale") ?? "/";

  /**
   * Gate L3 : si une locale secondaire a été détectée par le middleware
   * mais que `localized-routing` n'est pas actif, on redirige vers la même
   * page en locale par défaut (sans préfixe d'URL).
   */
  if (locale !== DEFAULT_LOCALE_CODE && !(await getLocalizationL3Active())) {
    redirect(pathWithoutLocale);
  }

  const { logoUrl } = await getStoreLogo();

  return (
    <html
      lang={locale}
      className={cn("font-sans", jost.variable, cormorant.variable)}
      suppressHydrationWarning
    >
      <body>
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:z-50 focus-visible:left-4 focus-visible:top-4 focus-visible:rounded-md focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-foreground focus-visible:shadow-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          Aller au contenu principal
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <TooltipProvider>
            <PublicSiteShell logoUrl={logoUrl} localeSelector={<LocaleSelector />}>
              {children}
            </PublicSiteShell>
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 92],
  },
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    viewTransition: true,
  },

  /**
   * Redirects des URLs de l'ancien site WordPress (creatyss.com),
   * slugs vérifiés sur le site en ligne le 2026-06-11.
   * Sans redirect nécessaire (chemins identiques) : /politique-confidentialite,
   * /contact, /panier, /blog. L'ancien site n'avait ni mentions légales
   * ni politique de retour dédiées.
   */
  async redirects() {
    return [
      {
        // CGV : « ventes » au pluriel sur l'ancien site
        source: "/conditions-generales-de-ventes",
        destination: "/conditions-generales-de-vente",
        permanent: true,
      },
      {
        source: "/marches",
        destination: "/les-marches",
        permanent: true,
      },
      {
        source: "/mon-compte/:path*",
        destination: "/compte",
        permanent: true,
      },
      {
        source: "/validation-de-commande",
        destination: "/checkout",
        permanent: true,
      },
      {
        // Catégories WooCommerce : slugs anciens sans équivalent direct,
        // renvoi générique vers la boutique plutôt que 404
        source: "/categorie-produit/:path*",
        destination: "/boutique",
        permanent: true,
      },
    ];
  },

  async headers() {
    if (process.env.NODE_ENV !== "development") {
      return [];
    }

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
};

export default nextConfig;

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
        // Produits WooCommerce (/produit/<slug>) : slugs conservés à l'import.
        // Produit inconnu → notFound de /boutique/[slug], équivalent au 404 d'origine.
        source: "/produit/:slug",
        destination: "/boutique/:slug",
        permanent: true,
      },
      {
        // Catégories WooCommerce : les slugs ont été conservés à l'import
        // (seed_data/categories.creatyss.json), le filtre boutique est préservé.
        // Un slug inconnu donne une liste vide, sans erreur.
        source: "/categorie-produit/:slug",
        destination: "/boutique?category=:slug",
        permanent: true,
      },
      {
        // Chemins catégorie plus profonds (pagination Woo, sous-catégories) :
        // renvoi générique vers la boutique
        source: "/categorie-produit/:path+",
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

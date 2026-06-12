/**
 * Redirects spécifiques à l'instance Creatyss (Horizon 4 — lot R6).
 *
 * Héritage de l'ancien site WordPress/WooCommerce creatyss.com — slugs
 * vérifiés sur le site en ligne le 2026-06-11. Sans redirect nécessaire
 * (chemins identiques) : /politique-confidentialite, /contact, /panier,
 * /blog. L'ancien site n'avait ni mentions légales ni politique de retour
 * dédiées.
 *
 * Pour un clone du repo : vider ce tableau (ou y placer les redirects
 * hérités de l'instance clonée). Le socle n'impose aucun redirect.
 */

type InstanceRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

export const instanceRedirects: InstanceRedirect[] = [
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

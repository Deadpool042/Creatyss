/**
 * Dictionnaire fr du copy fiche produit (Horizon 4 — généralisation
 * `LocalizedValue`, pilote n°2 après `homepage`).
 *
 * Contenu de la locale par défaut, résolu via
 * `entities/languages/resolve-locale-content.ts` par
 * `features/storefront/catalog/product-page/config/product-page-copy.config.ts`
 * (le contrat — forme et clés consommées par les composants). Mêmes valeurs
 * que la config `as const` précédente (Horizon 4 — lot R1), déplacées ici
 * sans changement.
 */

export const PRODUCT_PAGE_COPY_FR = {
  editorial: {
    eyebrow: "Savoir-faire",
    titleLine1: "Fabriqué à la main",
    titleLine2: "à Saint-Étienne",
    body: "Chaque pièce est pensée, dessinée et fabriquée à la main dans mon atelier stéphanois. Je sélectionne des matières choisies avec exigence et réalise des finitions soignées, pour des pièces uniques, pensées pour durer.",
    ctaLabel: "Découvrir mon atelier",
    ctaHref: "/a-propos",
  },

  heroBadges: {
    /** Badge localisation (icône MapPin). */
    location: "Fait main à Saint-Étienne",
    /** Badge unicité — variante par défaut (portrait). */
    uniqueness: "Chaque sac est unique",
    /** Badge unicité — variante compacte (landscape). */
    uniquenessCompact: "Pièce unique",
  },

  /** Description JSON-LD par défaut quand le produit n'en fournit aucune. */
  jsonLdDefaultDescription: "Produit Creatyss.",
} as const;

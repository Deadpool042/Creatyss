/**
 * Copy éditorial de la fiche produit (Horizon 4 — lot R1).
 *
 * Textes de marque extraits des composants : les composants consomment cette
 * configuration, le clone change le contenu ici. Locale par défaut en vue de
 * l'option `localization`.
 */
export const productPageCopyConfig = {
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

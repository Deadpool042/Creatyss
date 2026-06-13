/**
 * Source de marque unique du socle (Horizon 4 — lot R1).
 *
 * Les composants du socle ne portent aucun texte de marque en dur : ils
 * consomment cette configuration. Pour un clone du repo, changer d'identité
 * passe par ce fichier (et le contenu en base), pas par les composants.
 *
 * Anticipation `localization` : ces textes constituent la locale par défaut ;
 * l'activation du multilangue les déclinera par locale sans toucher les
 * composants consommateurs.
 */
export const brandConfig = {
  name: "Creatyss",

  /**
   * Identifiants techniques du store créé par le bootstrap initial
   * (`scripts/helpers/admin-bootstrap.ts`, `ensureDefaultStore`).
   * Pour un clone : changer ces valeurs avant le premier
   * `pnpm run bootstrap:store-admin` sur une base vide. Sans effet sur un
   * store déjà créé (champs éditables via `/admin/settings/general`).
   */
  storeCode: "creatyss",
  storeSlug: "creatyss",

  metadata: {
    titleDefault: "Creatyss — Créations artisanales",
    titleTemplate: "%s — Creatyss",
    description:
      "Créations artisanales faites main à Saint-Étienne. Sacs, pochettes et accessoires uniques, sans cuir animal. Découvrez les collections Creatyss.",
  },

  /** Baseline de la colonne marque du footer. */
  baseline:
    "Sacs et accessoires artisanaux conçus et cousus à la main à Saint‑Étienne, sans cuir.",

  /** Signature courte du bas de footer. */
  tagline: "Créations artisanales en pièces uniques",

  /** Baseline courte (drawer mobile). */
  baselineShort: "Sacs artisanaux faits main à Saint-Étienne.",

  /** Encart bas du drawer mobile. */
  drawerNote: {
    title: "Fait main à Saint-Étienne",
    body: "Des pièces uniques, sans cuir, cousues avec soin.",
  },

  /** Mentions éditoriales de la colonne « L'atelier » du footer. */
  atelierItems: [
    "Saint-Étienne",
    "Fait main",
    "Sans cuir",
    "Pièces uniques",
    "Les marchés",
    "Sur-mesure",
  ],

  /** Nom utilisé dans la mention de copyright. */
  copyrightName: "Creatyss",

  /** Message du garde d'orientation mobile. */
  orientationNotice:
    "La boutique Creatyss est pensée pour une consultation mobile en portrait.",

  /** Signature des emails transactionnels. */
  emailSignature: "Creatyss",

  /** Description longue du réassurance "fait main" (page boutique). */
  reassuranceHandmadeDescription:
    "Chaque pièce est cousue à la main dans notre atelier stéphanois.",

  /** Page "Toutes les catégories" : metadata description. */
  categoriesPageDescription:
    "Découvrez toutes les collections Creatyss : sacs, accessoires et créations artisanales uniques.",

  /** Page "Toutes les catégories" : intro éditoriale. */
  categoriesPageIntro:
    "Chaque collection est pensée et réalisée à la main dans l'atelier stéphanois de Creatyss.",
} as const;

export type BrandConfig = typeof brandConfig;

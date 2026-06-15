/**
 * Dictionnaire fr — copy éditorial de la page boutique (Horizon 4 — lot L4 généralisation).
 *
 * Contenu de référence, recopié depuis l'ancien
 * `boutique-copy.config.ts` (Horizon 4 — lot R1).
 */
export const BOUTIQUE_PAGE_COPY_FR = {
  header: {
    /** Eyebrow par défaut (sans catégorie active). */
    defaultEyebrow: "Créations uniques, faites main à Saint-Étienne",
    /** Préfixe d'eyebrow quand une catégorie est active. */
    categoryEyebrowPrefix: "Sélection",
    intro:
      "Chaque pièce est imaginée et cousue à la main dans mon atelier stéphanois avec passion, exigence et engagement.",
  },

  engagements: {
    ariaLabel: "Engagements Creatyss",
  },

  marketAside: {
    ariaLabel: "Informations atelier Creatyss",
    label: "L'atelier Creatyss",
    title: "Prochains marchés",
    // Données éditoriales marchés — à remplacer par une source CMS quand disponible.
    events: [
      { dateLabel: "Date à confirmer", name: "Marché de créateurs", location: "Saint-Étienne" },
      { dateLabel: "Calendrier à venir", name: "Marché artisanal", location: "Loire" },
    ],
    ctaLabel: "Voir les marchés",
    uniqueBlock: {
      title: "Créations faites main en pièce unique",
      body: "Chaque sac est imaginé et cousu à la main dans mon atelier stéphanois, en pièce unique.",
    },
  },
} as const;

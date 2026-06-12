/**
 * Copy éditorial et fallbacks de la homepage (Horizon 4 — lot R1).
 *
 * La homepage est éditable en admin : ces textes sont les valeurs par défaut
 * (fallbacks) et le copy fixe des sections. Les composants consomment cette
 * configuration ; le clone change le contenu ici ou en admin. Locale par
 * défaut en vue de l'option `localization`.
 */
export const homepageCopyConfig = {
  hero: {
    fallbackText:
      "Chaque sac Creatyss est dessiné, coupé et cousu dans notre atelier en France. Aucun modèle n'est reproduit à l'identique.",
  },

  journal: {
    fallbackInstagramUrl: "https://www.instagram.com/creatyss",
    fallbackFacebookUrl: "https://www.facebook.com/creatyss",
    emptyText:
      "Le journal de l'atelier sera bientôt enrichi de nouveaux contenus : inspirations, nouveautés et temps forts autour des créations Creatyss.",
  },

  savoirFaire: {
    imageAlt: "Détail du savoir-faire Creatyss dans l'atelier",
    badgeNote: "Chaque geste, de la découpe à la finition, est réalisé dans l'atelier Creatyss.",
  },

  events: {
    title: "Retrouvez Creatyss lors de marchés et événements artisanaux",
    intro:
      "Tout au long de l'année, Creatyss participe à des rendez-vous locaux pour présenter ses créations, rencontrer le public et partager l'univers de l'atelier. Une belle occasion de découvrir les pièces de près et d'échanger autour du fait main.",
    visitText:
      "Venez découvrir les créations Creatyss, échanger autour des pièces exposées et voir les détails de fabrication de plus près.",
  },

  editorial: {
    fallbackTitle: "L'atelier Creatyss",
    fallbackText:
      "Creatyss imagine et réalise des sacs faits main dans une démarche artisanale, attentive aux matières, aux détails et au temps nécessaire pour bien faire. Chaque création est pensée pour durer, avec une attention particulière portée à l'élégance, à l'usage et à la singularité de chaque pièce.",
  },

  collections: {
    eyebrow: "L'univers Creatyss",
  },

  about: {
    fallbackTitle: "Derrière chaque sac, une main.",
    fallbackBody:
      "« Je couds par passion, mais aussi par conviction — que les objets qu'on porte méritent d'être pensés, faits avec soin, et destinés à durer. »",
    fallbackSubtitle: "— Creatyss, fabrication française",
    fallbackCtaLabel: "Notre histoire",
    fallbackCtaHref: "/blog?category=atelier",
  },
} as const;

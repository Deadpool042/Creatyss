/**
 * Copy des pages de contenu d'instance (Horizon 4 — lot R2, option config).
 *
 * `a-propos`, `les-marchés` et `contact` restent des composants (mise en
 * page riche, formulaire) ; leur contenu est de l'instance, extrait ici.
 * La bascule vers des pages DB à blocs (PageSection/PageBlock, déjà
 * modélisées) reste la cible long terme — décision tracée dans la roadmap.
 */
export const contentPagesCopyConfig = {
  aPropos: {
    metadata: {
      title: "À propos — Creatyss",
      description:
        "Creatyss est un atelier artisanal basé à Saint-Étienne. Découvrez l'histoire, la démarche et les valeurs de la créatrice.",
    },
    eyebrow: "L'atelier",
    title: "À propos de Creatyss",
    sections: [
      {
        title: "Un atelier à Saint-Étienne",
        body: "Creatyss est un atelier créatif basé au cœur de Saint-Étienne. Chaque pièce est pensée, dessinée et fabriquée à la main, avec une attention particulière portée aux matières, aux détails et à la durabilité.",
      },
      {
        title: "La démarche artisanale",
        body: "Sans cuir animal. Avec des matières sélectionnées pour leur qualité et leur impact réduit. Les créations Creatyss valorisent un savoir-faire manuel et une production locale, loin des circuits industriels.",
      },
      {
        title: "Pièces uniques et sur-mesure",
        body: "Chaque sac, pochette ou accessoire est une pièce unique ou produite en très petite série. Le sur-mesure est possible pour les projets personnalisés — contactez-nous pour en discuter.",
      },
    ],
    ctaPrimary: { label: "Découvrir la boutique", href: "/boutique" },
    ctaSecondary: { label: "Nous contacter", href: "/contact" },
  },

  lesMarches: {
    metadata: {
      title: "Les marchés — Creatyss",
      description:
        "Retrouvez Creatyss sur les marchés artisanaux et créatifs de la région. Dates et lieux à venir.",
    },
    eyebrow: "Rencontres",
    title: "Les marchés",
    intro:
      "Venez découvrir et toucher les créations Creatyss en vrai, sur les marchés artisanaux et créatifs de la région.",
    placeholder: {
      title: "Calendrier à venir",
      body: "Les prochaines dates de marché seront publiées ici très prochainement.",
      note: "Suivez-nous pour ne rien manquer — ou écrivez-nous directement.",
    },
    atelier: {
      title: "Atelier basé à Saint-Étienne",
      subtitle: "Loire, Auvergne-Rhône-Alpes",
    },
    ctaPrimary: { label: "Nous contacter", href: "/contact" },
    ctaSecondary: { label: "Commander en ligne", href: "/boutique" },
  },

  contact: {
    metadata: {
      title: "Contact — Creatyss",
      description:
        "Contactez l'atelier Creatyss pour toute question sur les créations, le sur-mesure ou une commande.",
    },
    /** Placeholder du formulaire non câblé — l'email réel vient de Store.supportEmail. */
    mailtoPlaceholder: "mailto:contact@creatyss.local",
  },
} as const;

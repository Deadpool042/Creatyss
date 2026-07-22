import type { FeatureCatalogEntry } from "./feature-catalog.types";

export const FEATURE_LEVELS = {
  ai: ["basic", "assistant", "advanced", "automation"],
  analytics: ["read", "insights", "recommendations"],
  newsletter: ["basic", "segmentation", "automation"],
  social: ["basic"],
  media: ["basic", "optimization", "generation", "automation"],
  discounts: ["simple", "rules", "automation"],
  inventory: ["manual", "alerts", "forecasting"],
  localization: ["managed", "multilingual", "localized-routing"],
  fulfillment: ["manual", "partial"],
  automations: ["basic"],
  tracking: ["active"],
  returns: ["manual", "partial"],
  taxation: ["store"],
  documents: ["basic", "fiscal"],
  payments: ["read", "manual", "online"],
  webhooks: ["read", "manage", "retry"],
  shipping: ["read", "dispatch", "delivery"],
  pricing: ["base-price", "price-lists", "scheduled-pricing"],
  availability: ["sellability", "scheduling", "preorder"],
  blog: ["draft", "publish"],
  relatedProducts: ["storefront", "manage"],
  variants: ["read", "manage", "options"],
} as const;

export const FEATURE_CATALOG = [
  // Commerce — satellite modules
  {
    key: "commerce.fulfillment",
    label: "Traitement des commandes",
    description: "Gestion du cycle de traitement des commandes : préparation, expédition et suivi.",
    family: "satellite",
    module: "commerce",
    defaultState: "inactive",
    mutability: "level_selectable",
    scopes: ["store"],
    levels: FEATURE_LEVELS.fulfillment,
    levelLabels: {
      manual: "Manuel",
      partial: "Partiel",
    },
    levelDescriptions: {
      manual:
        "Préparation tout-ou-rien : toutes les lignes de la commande sont préparées ensemble.",
      partial: "Autorise la sélection de quantités partielles par ligne à la création.",
    },
  },
  {
    key: "commerce.returns",
    label: "Retours",
    description: "Gestion des demandes de retour, remboursements et échanges.",
    family: "satellite",
    module: "commerce",
    defaultState: "inactive",
    mutability: "level_selectable",
    scopes: ["store"],
    levels: FEATURE_LEVELS.returns,
    levelLabels: {
      manual: "Manuel",
      partial: "Partiel",
    },
    levelDescriptions: {
      manual: "Retour tout-ou-rien : toutes les lignes de la commande sont retournées ensemble.",
      partial: "Autorise la sélection de quantités partielles par ligne à la création.",
    },
  },
  {
    key: "commerce.documents",
    label: "Documents commerciaux",
    description:
      "Documents de commande : confirmation et bon de préparation (basic), facture et avoir à numérotation légale (fiscal).",
    family: "satellite",
    module: "commerce",
    defaultState: "inactive",
    mutability: "level_selectable",
    scopes: ["store"],
    levels: FEATURE_LEVELS.documents,
    levelLabels: {
      basic: "Basique",
      fiscal: "Fiscal",
    },
    levelDescriptions: {
      basic: "Confirmation de commande et bon de préparation uniquement (documents informatifs).",
      fiscal:
        "Débloque en plus la facture et l'avoir, à numérotation légale séquentielle irréversible.",
    },
  },
  {
    key: "commerce.taxation",
    label: "Fiscalité",
    description: "Gestion des règles de TVA par territoire (métropole, DOM), à l'échelle boutique.",
    family: "satellite",
    module: "commerce",
    defaultState: "inactive",
    mutability: "level_selectable",
    scopes: ["store"],
    levels: FEATURE_LEVELS.taxation,
    levelLabels: {
      store: "Boutique",
    },
    levelDescriptions: {
      store: "Règles de TVA à l'échelle boutique uniquement (pas de ciblage catégorie/produit).",
    },
  },
  {
    key: "commerce.payments",
    label: "Paiements",
    description: "Gestion des moyens de paiement et des transactions.",
    family: "satellite",
    module: "commerce",
    defaultState: "active",
    mutability: "level_selectable",
    scopes: ["store"],
    levels: FEATURE_LEVELS.payments,
    levelLabels: {
      read: "Lecture",
      manual: "Manuel",
      online: "En ligne",
    },
    levelDescriptions: {
      read: "Lecture admin des paiements et de leur statut, sans action de transition.",
      manual:
        "Autorise les actions admin sur paiements manuels en attente : marquer reçu ou annuler.",
      online: "Débloque en plus le paiement carte au checkout quand Stripe est configuré.",
    },
  },
  {
    key: "commerce.shipping",
    label: "Livraison",
    description: "Gestion des modes de livraison et des transporteurs.",
    family: "satellite",
    module: "commerce",
    defaultState: "active",
    mutability: "level_selectable",
    scopes: ["store"],
    levels: FEATURE_LEVELS.shipping,
    levelLabels: {
      read: "Lecture",
      dispatch: "Expédition",
      delivery: "Livraison confirmée",
    },
    levelDescriptions: {
      read: "Lecture admin des expéditions et de leurs statuts.",
      dispatch:
        "Autorise le marquage manuel d'une commande comme expédiée avec transporteur et suivi.",
      delivery: "Autorise en plus la confirmation manuelle de livraison.",
    },
  },
  {
    key: "commerce.discounts",
    label: "Remises",
    description: "Gestion des codes promo, règles de remise et promotions.",
    family: "satellite",
    module: "commerce",
    defaultState: "inactive",
    mutability: "level_selectable",
    scopes: ["store"],
    levels: FEATURE_LEVELS.discounts,
    levelLabels: {
      simple: "Simple",
      rules: "Règles",
      automation: "Automatisation",
    },
    levelDescriptions: {
      simple:
        "CRUD admin des remises (pourcentage/montant fixe, scope commande), sans effet panier.",
      rules:
        "Remise appliquée au checkout : code promo, ciblage produit/variante/catégorie, livraison offerte.",
      automation: "Remises automatiques (sans code) appliquées au checkout selon leur priorité.",
    },
  },
  // Platform — optional modules
  {
    key: "platform.notifications",
    label: "Notifications",
    description: "Gestion des notifications email, SMS et push envoyées aux clients et à l'équipe.",
    family: "optional",
    module: "platform",
    defaultState: "inactive",
    mutability: "toggleable",
    scopes: ["store"],
  },
  {
    key: "platform.integrations",
    label: "Intégrations",
    description:
      "Connexions aux services tiers : ERP, CRM, outils marketing et plateformes externes.",
    family: "optional",
    module: "platform",
    defaultState: "inactive",
    mutability: "toggleable",
    scopes: ["store", "global"],
  },
  {
    key: "platform.webhooks",
    label: "Webhooks",
    description:
      "Émission d'événements vers des endpoints externes pour intégrations et automatisations.",
    family: "optional",
    module: "platform",
    defaultState: "inactive",
    mutability: "level_selectable",
    scopes: ["store", "global"],
    levels: FEATURE_LEVELS.webhooks,
    levelLabels: {
      read: "Lecture",
      manage: "Gestion",
      retry: "Relance",
    },
    levelDescriptions: {
      read: "Lecture admin des endpoints webhook sortants et de leurs deliveries.",
      manage: "Autorise la création et l'activation/désactivation des endpoints webhook.",
      retry: "Autorise en plus la relance manuelle des deliveries en échec.",
    },
  },
  {
    key: "platform.localization",
    label: "Localisation",
    description: "Gestion des langues, devises et adaptations locales du contenu et des prix.",
    family: "optional",
    module: "platform",
    defaultState: "inactive",
    mutability: "level_selectable",
    scopes: ["store"],
    levelLabels: {
      managed: "Géré",
      multilingual: "Multilingue",
      "localized-routing": "Routing localisé",
    },
    levelDescriptions: {
      managed: "Gestion de la locale par défaut de la boutique, sans contenu traduit.",
      multilingual:
        "Copies traduites servies côté storefront et admin selon la locale demandée, avec repli sur la locale par défaut.",
      "localized-routing":
        "Routing localisé complet (URLs par locale, hreflang, sitemap localisé, sélecteur de langue).",
    },
    levels: FEATURE_LEVELS.localization,
  },
  // Satellite — search and channels
  {
    key: "satellite.search",
    label: "Recherche avancée",
    description: "Moteur de recherche interne avec indexation, facettes et suggestions.",
    family: "satellite",
    module: "satellite",
    defaultState: "inactive",
    mutability: "toggleable",
    scopes: ["store"],
  },
  {
    key: "satellite.channels",
    label: "Canaux de vente",
    description:
      "Gestion des canaux de distribution : marketplaces, réseaux sociaux et points de vente.",
    family: "satellite",
    module: "satellite",
    defaultState: "inactive",
    mutability: "toggleable",
    scopes: ["store"],
  },
  // Engagement — optional modules
  {
    key: "engagement.newsletter",
    label: "Newsletter",
    description: "Gestion des campagnes email et des abonnements.",
    family: "optional",
    module: "engagement",
    defaultState: "inactive",
    mutability: "level_selectable",
    scopes: ["store"],
    levelLabels: {
      basic: "Basique",
      segmentation: "Segmentation",
      automation: "Automatisation",
    },
    levelDescriptions: {
      basic:
        "Référentiel des abonnés (admin + souscription storefront) et envoi de campagnes email, sans segmentation.",
      segmentation:
        "Filtres de segmentation sur le référentiel réel des abonnés (statut, source, récence).",
      automation:
        "Souscription à une newsletter déclenche une automation email (si engagement.automations est actif).",
    },
    levels: FEATURE_LEVELS.newsletter,
  },
  {
    key: "engagement.social",
    label: "Diffusion sociale",
    description:
      "Matérialisation de brouillons de publications sociales à partir d'intents éditoriaux approuvés.",
    family: "optional",
    module: "engagement",
    defaultState: "inactive",
    mutability: "level_selectable",
    scopes: ["store"],
    levelLabels: {
      basic: "Basique",
    },
    levelDescriptions: {
      basic:
        "Création de brouillons SocialPublication (statut DRAFT) depuis un intent éditorial approuvé, sans publication réelle ni provider externe.",
    },
    levels: FEATURE_LEVELS.social,
  },
  {
    key: "engagement.analytics",
    label: "Analytics",
    description: "Suivi des performances, des conversions et des audiences.",
    family: "optional",
    module: "engagement",
    defaultState: "inactive",
    mutability: "level_selectable",
    scopes: ["store"],
    levelLabels: {
      read: "Lecture",
      insights: "Analyses",
      recommendations: "Recommandations",
    },
    levelDescriptions: {
      read: "Lecture live du mois courant : chiffre d'affaires, commandes, nouveaux clients, taux d'annulation.",
      insights:
        "Ajoute panier moyen, répartition des commandes par statut et top produits du mois.",
      recommendations:
        "Insights actionnables dérivés d'Order/OrderLine : produits en repli (0 vente sur 30 jours après une période active) et produits en forte croissance (vs mois précédent).",
    },
    levels: FEATURE_LEVELS.analytics,
  },
  {
    key: "engagement.tracking",
    label: "Tracking storefront",
    description:
      "Collecte anonyme des signaux de comportement storefront (vues produit, ajouts panier, recherches), sans cookie ni identifiant.",
    family: "optional",
    module: "engagement",
    defaultState: "active",
    mutability: "level_selectable",
    scopes: ["store"],
    levels: FEATURE_LEVELS.tracking,
    levelLabels: {
      active: "Actif",
    },
    levelDescriptions: {
      active: "Collecte des agrégats quotidiens consommés par le module Analytics.",
    },
  },
  {
    key: "engagement.automations",
    label: "Automations marketing",
    description:
      "Flux email automatisés déclenchés par les événements boutique : commande passée, inscription newsletter.",
    family: "optional",
    module: "engagement",
    defaultState: "inactive",
    mutability: "level_selectable",
    scopes: ["store"],
    levels: FEATURE_LEVELS.automations,
    levelLabels: {
      basic: "Basique",
    },
    levelDescriptions: {
      basic: "Déclencheurs commande passée / inscription newsletter, action email uniquement.",
    },
  },
  {
    key: "engagement.public-events",
    label: "Marchés",
    description:
      "Gestion des marchés (titre, dates, lieu) affichés en liste chronologique sur la page publique dédiée.",
    family: "optional",
    module: "engagement",
    defaultState: "inactive",
    mutability: "toggleable",
    scopes: ["store"],
  },
  // Catalog products — core capabilities
  {
    key: "catalog.products.pricing",
    label: "Tarification produit",
    description: "Gestion des prix, des taxes et des règles tarifaires.",
    family: "core",
    module: "catalog",
    capability: "catalog.products.pricing",
    defaultState: "active",
    mutability: "level_selectable",
    scopes: ["store"],
    levelLabels: {
      "base-price": "Prix de base",
      "price-lists": "Listes de prix",
      "scheduled-pricing": "Tarification planifiée",
    },
    levelDescriptions: {
      "base-price": "Tarif boutique par défaut sur la fiche produit, sans grilles avancées.",
      "price-lists": "Ajoute la gestion des listes de prix et des tarifs multi-grilles.",
      "scheduled-pricing": "Ajoute les fenêtres tarifaires datées sur les prix produit déjà gérés.",
    },
    levels: FEATURE_LEVELS.pricing,
  },
  {
    key: "catalog.products.availability",
    label: "Disponibilité produit",
    description: "Gestion de la disponibilité et de la visibilité des produits.",
    family: "core",
    module: "catalog",
    capability: "catalog.products.availability",
    defaultState: "active",
    mutability: "level_selectable",
    scopes: ["store"],
    levelLabels: {
      sellability: "Vendabilité",
      scheduling: "Planification",
      preorder: "Précommande",
    },
    levelDescriptions: {
      sellability:
        "Statut commercial, vendabilité en ligne et autorisation de commande en rupture.",
      scheduling: "Ajoute les fenêtres de vente datées (début/fin de vendabilité).",
      preorder: "Ajoute l'ouverture et la fermeture datées des précommandes.",
    },
    levels: FEATURE_LEVELS.availability,
  },
  {
    key: "catalog.products.inventory",
    label: "Inventaire produit",
    description: "Gestion du stock, des alertes et des prévisions d'inventaire.",
    family: "core",
    module: "catalog",
    capability: "catalog.products.inventory",
    defaultState: "active",
    mutability: "level_selectable",
    scopes: ["store"],
    levelLabels: {
      manual: "Manuel",
      alerts: "Alertes",
      forecasting: "Prévisions",
    },
    levelDescriptions: {
      manual: "Seuil de stock faible fixe (2 unités), non configurable.",
      alerts: "Seuil de stock faible configurable par variante dans l'éditeur produit.",
      forecasting: "Ajoute une lecture locale de couverture de stock dans l'onglet stock produit.",
    },
    levels: FEATURE_LEVELS.inventory,
  },
  {
    key: "catalog.products.media",
    label: "Médias produit",
    description: "Gestion des images, vidéos et contenus médias des produits.",
    family: "core",
    module: "catalog",
    capability: "catalog.products.media",
    defaultState: "active",
    mutability: "level_selectable",
    scopes: ["store"],
    levelLabels: {
      basic: "Basique",
      optimization: "Optimisation",
      generation: "Génération",
      automation: "Automatisation",
    },
    levelDescriptions: {
      basic: "Upload et gestion manuelle des médias, sans diagnostic ni génération.",
      optimization:
        "Diagnostic « sans texte alternatif » dans l'onglet médias de l'éditeur produit.",
      generation: "Génération locale déterministe des textes alternatifs manquants, à la demande.",
      automation:
        "Complétion automatique des textes alternatifs à l'ajout d'une image (upload/attach).",
    },
    levels: FEATURE_LEVELS.media,
  },
  {
    key: "catalog.products.variants",
    label: "Variantes produit",
    description: "Gestion des déclinaisons (taille, couleur, etc.).",
    family: "core",
    module: "catalog",
    capability: "catalog.products.variants",
    defaultState: "active",
    mutability: "level_selectable",
    scopes: ["store"],
    levelLabels: {
      read: "Lecture",
      manage: "Gestion",
      options: "Options",
    },
    levelDescriptions: {
      read: "Lecture des variantes et de leur structure dans l'éditeur produit.",
      manage: "Création, modification, suppression et choix de la variante par défaut.",
      options: "Ajoute la gestion des valeurs d'options couleur utilisées par les variantes.",
    },
    levels: FEATURE_LEVELS.variants,
  },
  {
    key: "catalog.products.seo",
    label: "SEO produit",
    description: "Gestion des métadonnées SEO et de l'optimisation pour les moteurs de recherche.",
    family: "core",
    module: "catalog",
    capability: "catalog.products.seo",
    defaultState: "active",
    mutability: "readonly",
    scopes: ["store"],
  },
  {
    key: "catalog.products.categories",
    label: "Catégories produit",
    description: "Organisation des produits en catégories et sous-catégories.",
    family: "core",
    module: "catalog",
    capability: "catalog.products.categories",
    defaultState: "active",
    mutability: "readonly",
    scopes: ["store"],
  },
  {
    key: "catalog.products.related",
    label: "Produits associés",
    description: "Gestion des suggestions de produits similaires ou complémentaires.",
    family: "optional",
    module: "catalog",
    capability: "catalog.products.related",
    defaultState: "active",
    mutability: "level_selectable",
    scopes: ["store"],
    levels: FEATURE_LEVELS.relatedProducts,
    levelLabels: {
      storefront: "Storefront",
      manage: "Gestion",
    },
    levelDescriptions: {
      storefront: "Affiche les suggestions de produits liés sur les fiches produit publiques.",
      manage:
        "Autorise en plus l'édition admin des relations related, cross-sell, up-sell, accessory et similar.",
    },
  },
  // Content — cross-cutting modules (structure éditoriale transverse)
  {
    key: "content.blog",
    label: "Blog",
    description: "Gestion des articles de blog et de la structure éditoriale.",
    family: "cross_cutting",
    module: "content",
    defaultState: "active",
    mutability: "level_selectable",
    scopes: ["store"],
    levels: FEATURE_LEVELS.blog,
    levelLabels: {
      draft: "Brouillon",
      publish: "Publication",
    },
    levelDescriptions: {
      draft: "Édition admin des brouillons, sans diffusion publique du blog.",
      publish: "Ajoute la publication storefront des articles et du listing blog.",
    },
  },
  {
    key: "content.homepage",
    label: "Page d'accueil",
    description: "Gestion du contenu et de la mise en page de la page d'accueil.",
    family: "cross_cutting",
    module: "content",
    defaultState: "active",
    mutability: "readonly",
    scopes: ["store"],
  },
  {
    key: "content.seo",
    label: "SEO global",
    description:
      "Gestion des métadonnées SEO et de l'optimisation transverse pour les moteurs de recherche.",
    family: "cross_cutting",
    module: "content",
    defaultState: "active",
    mutability: "readonly",
    scopes: ["store"],
  },
  // Settings — core pilotage
  {
    key: "settings.advanced",
    label: "Réglages avancés",
    description:
      "Pilotage des fonctionnalités, mutabilité et gouvernance des modules depuis l'admin.",
    family: "core",
    module: "settings",
    defaultState: "active",
    mutability: "readonly",
    scopes: ["store", "global"],
  },
  // Maintenance — cross-cutting observability
  {
    key: "maintenance.observability",
    label: "Observabilité",
    description:
      "Supervision transverse de l'état du système, des alertes et des indicateurs de santé.",
    family: "cross_cutting",
    module: "maintenance",
    defaultState: "active",
    mutability: "readonly",
    scopes: ["global"],
  },
  {
    key: "maintenance.logs",
    label: "Journaux système",
    description: "Accès aux journaux d'exploitation et aux traces d'audit.",
    family: "cross_cutting",
    module: "maintenance",
    defaultState: "active",
    mutability: "readonly",
    scopes: ["global"],
  },
  // Insights — capability de lecture analytics (distinct de engagement.analytics = module flag)
  // engagement.analytics = activation du module analytics par boutique
  // insights.analyticsRead = capability de lecture des données analytics dans l'admin
  {
    key: "insights.analyticsRead",
    label: "Lecture Analytics",
    description: "Capacité de lecture des données analytics dans l'interface d'administration.",
    family: "cross_cutting",
    module: "insights",
    capability: "insights.analyticsRead",
    defaultState: "active",
    mutability: "readonly",
    scopes: ["store", "global"],
    dependencies: ["engagement.analytics"],
  },
  // AI — optional module
  {
    key: "ai.core",
    label: "Intelligence artificielle",
    description:
      "Fonctionnalités IA transverses : génération de contenu, suggestions et automatisations.",
    family: "optional",
    module: "ai",
    defaultState: "inactive",
    mutability: "level_selectable",
    scopes: ["store"],
    levelLabels: {
      basic: "Basique",
      assistant: "Assistant",
      advanced: "Avancé",
      automation: "Automatisation",
    },
    levelDescriptions: {
      basic:
        "Lecture/observabilité admin des tâches IA, et suggestion SEO manuelle pour un produit.",
      assistant: "Ajoute la suggestion SEO manuelle pour un article de blog.",
      advanced: "Historique local réutilisable des suggestions SEO déjà tracées sur un même sujet.",
      automation:
        "Préparation automatique d'une première suggestion SEO quand aucun historique n'existe.",
    },
    levels: FEATURE_LEVELS.ai,
  },
] as const satisfies readonly FeatureCatalogEntry[];

export function getFeatureCatalogEntries(): readonly FeatureCatalogEntry[] {
  return FEATURE_CATALOG;
}

export function findFeatureCatalogEntry(key: string): FeatureCatalogEntry | null {
  return FEATURE_CATALOG.find((e) => e.key === key) ?? null;
}

export function isFeatureCatalogKey(key: string): boolean {
  return FEATURE_CATALOG.some((e) => e.key === key);
}

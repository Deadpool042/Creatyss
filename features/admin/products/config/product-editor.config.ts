type ProductSectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

export const PRODUCT_FIELD_COPY = {
  nameLabel: "Nom",
  slugLabel: "Adresse du produit",
  slugHint:
    "Visible dans l’URL du produit. Générée automatiquement depuis le nom, vous pouvez la modifier.",
  skuRootLabel: "Référence interne",
  skuRootHint:
    "Optionnelle, utile pour retrouver un produit. Pour un produit à variantes, chaque déclinaison reprend cette base pour générer sa propre référence.",
  productTypeLabel: "Famille produit",
  productTypeHint: "Classe le produit dans une famille catalogue.",
  marketingHookLabel: "Accroche commerciale",
  marketingHookHint:
    "Phrase courte affichée en haut de la fiche produit pour mettre le produit en valeur.",
  shortDescriptionLabel: "Description courte",
  shortDescriptionHint:
    "Affichée en haut de la fiche produit. Visez une phrase courte, concrète et naturelle (idéalement 120 à 180 caractères, maximum 220).",
  descriptionLabel: "Description détaillée",
  descriptionHint:
    "Développez le produit (usage, praticité, fabrication, finitions). Évitez de dupliquer les listes factuelles déjà saisies dans Caractéristiques.",
  careInstructionsLabel: "Conseils d'entretien",
  careInstructionsHint:
    "Champ dédié aux conseils de soin affichés sur la fiche produit. Saisissez-les ici et évitez de les dupliquer dans Caractéristiques.",
  statusLabel: "Statut",
  statusHint:
    "Brouillon : non visible. Actif : publié sur la boutique. Inactif : retiré temporairement. Archivé : retiré définitivement.",
  isFeaturedLabel: "Mise en avant",
  isFeaturedHint: "Produit mis en avant dans la boutique et l’administration.",
  imageLabel: "Image principale",
  imageHint: "Gérez ce choix depuis l'onglet Médias.",
} as const;

export const PRODUCT_GENERAL_SECTION_COPY = {
  eyebrow: "Informations",
  title: "Informations principales",
  description: "Mettez à jour le nom, l’adresse et le texte affichés dans le catalogue.",
} satisfies ProductSectionCopy;

export const PRODUCT_CREATE_GENERAL_SECTION_COPY = {
  ...PRODUCT_GENERAL_SECTION_COPY,
  description:
    "Renseignez les éléments visibles dans le catalogue. Vous pourrez compléter le visuel et le référencement ensuite.",
} satisfies ProductSectionCopy;

export const PRODUCT_SEO_SECTION_COPY = {
  eyebrow: "Référencement",
  title: "Référencement",
  description:
    "Aidez les moteurs de recherche et les aperçus de partage à présenter correctement le produit.",
} satisfies ProductSectionCopy;

export const PRODUCT_PUBLICATION_SECTION_COPY = {
  eyebrow: "Publication",
  title: "Publication et visibilité",
  description: "Contrôlez la mise en ligne du produit et sa mise en avant dans la boutique.",
} satisfies ProductSectionCopy;

export const PRODUCT_STRUCTURE_SECTION_COPY = {
  eyebrow: "Structure",
  title: "Structure du produit",
  description: "Indique si le produit est vendu seul ou avec plusieurs déclinaisons.",
} satisfies ProductSectionCopy;
// ─── Navigation & breadcrumbs ─────────────────────────────────────────────────

export const PRODUCT_EDITOR_NAV_COPY = {
  eyebrow: "Produits",
  navLabel: "Produits",
  breadcrumbHome: "Accueil",
  breadcrumbProducts: "Produits",
} as const;

// ─── Create page ──────────────────────────────────────────────────────────────

export const PRODUCT_CREATE_PAGE_COPY = {
  title: "Nouveau produit",
  description: "Créez un produit, puis complétez ses informations dans l'éditeur.",
  newProductButton: "Nouveau produit",
} as const;

export const PRODUCT_CREATE_MENU_COPY = {
  triggerLabel: "Nouveau",
  createProductLabel: "Créer un produit",
} as const;

// ─── Editor page ──────────────────────────────────────────────────────────────

export const PRODUCT_EDITOR_PAGE_COPY = {
  description:
    "Édition du produit, de ses variantes, de ses médias, de ses catégories et de son SEO.",
  archivedDescription: "Produit archivé.",
  archivedBodyTitle: "Ce produit est actuellement dans la corbeille.",
  archivedBodySubtitle: "Restaurez-le pour reprendre son édition, ou supprimez-le définitivement.",
  archivedBackToTrash: "Retour à la corbeille",
  notFoundMessage: "Produit introuvable.",
  notFoundBack: "Retour à la liste des produits",
} as const;

export const PRODUCT_EDITOR_MENUS_COPY = {
  editorMenuAriaLabel: "Ouvrir les actions du produit",
  mediaMenuAriaLabel: "Ouvrir les actions des images",
  variantsMenuAriaLabel: "Ouvrir les actions des variantes",
  newProductLabel: "Nouveau produit",
  restoreLabel: "Restaurer",
  permanentDeleteLabel: "Supprimer définitivement",
  archiveLabel: "Mettre à la corbeille",
  attachFromLibraryLabel: "Associer depuis la bibliothèque",
  uploadImageLabel: "Importer une image",
  deleteProductLabel: "Supprimer le produit",
  addVariantLabel: "Ajouter une variante",
  processingPending: "Traitement…",
} as const;

// ─── Shared form actions ──────────────────────────────────────────────────────

export const PRODUCT_FORM_ACTIONS_COPY = {
  reset: "Réinitialiser",
  save: "Enregistrer",
  savePending: "Mise à jour…",
  saveSuccess: "Mise à jour effectuée.",
  cancel: "Annuler",
  back: "Retour",
} as const;

// ─── Create panel ─────────────────────────────────────────────────────────────

export const PRODUCT_CREATE_PANEL_COPY = {
  step1Description: "Donnez un nom à votre produit.",
  step2Description: "Choisissez le type de produit.",
  progressLabel: "Progression",
  progressStep: (step: number): string => `Étape ${step} sur 2`,
  nextButton: "Suivant",
  createButton: "Créer le produit",
  createPending: "Création…",
  identityEyebrow: "Identité",
  identityTitle: "Identité produit",
  identitySlugHint: "Généré automatiquement depuis le nom. Vous pouvez le modifier.",
  structureEyebrow: "Structure",
  structureTitle: "Type de produit",
  nameLabel: "Nom",
  namePlaceholder: "Ex. Trousse en cuir",
  slugLabel: "Slug",
  slugPlaceholder: "trousse-cuir",
  typePlaceholder: "Choisir un type",
  typeSimple: "Produit simple",
  typeVariable: "Produit à variantes",
  identityCardDescription:
    "Donnez un nom au produit. Le slug est généré automatiquement et reste modifiable.",
  structureCardDescription:
    "Choisissez la structure de départ du produit. Vous pourrez ensuite compléter le reste dans l'éditeur.",
} as const;

// ─── General tab ──────────────────────────────────────────────────────────────

export const PRODUCT_GENERAL_TAB_COPY = {
  identityEyebrow: "Identité",
  identityTitle: "Identité produit",
  identityDescription:
    "Renseignez les attributs structurants qui identifient ce produit dans le catalogue.",
  contentsEyebrow: "Contenus",
  contentsTitle: "Contenus éditoriaux",
  contentsDescription: "Rédigez le résumé et la description complète du produit.",
  publicationEyebrow: "Publication",
  publicationTitle: "Publication et visibilité",
  publicationDescription: "Contrôlez la mise en ligne du produit et sa mise en avant.",
  structureInfoTitle: "Structure du produit",
  structureInfoDescription: "Indique si le produit est vendu seul ou avec plusieurs déclinaisons.",
  primaryImageInfoTitle: "Image principale",
  primaryImageInfoDescription: "Gérez ce choix depuis l'onglet Médias.",
  primaryImageNone: "Aucune image principale définie.",
  primaryImageCurrent: (altText: string): string => `Image actuelle : ${altText}`,
  primaryImageDefined: "Une image principale est déjà définie.",
  nameLabel: "Nom du produit",
  slugLabel: "Adresse du produit",
  slugHint:
    "Visible dans l'URL du produit. Générée automatiquement depuis le nom, vous pouvez la modifier.",
  skuRootLabel: "Référence interne",
  skuRootHint:
    "Optionnelle, utile pour retrouver un produit. Pour un produit à variantes, chaque déclinaison reprend cette base pour générer sa propre référence.",
  productTypeLabel: "Famille produit",
  productTypeHint: "Classe le produit dans une famille catalogue.",
  marketingHookLabel: "Accroche commerciale",
  marketingHookHint:
    "Phrase courte affichée en haut de la fiche produit pour mettre le produit en valeur.",
  marketingHookPlaceholder: "Ex. Un sac artisanal pensé pour illuminer le quotidien.",
  shortDescriptionLabel: "Description courte",
  shortDescriptionHint:
    "Affichée en haut de la fiche produit. Visez une phrase courte, concrète et naturelle (idéalement 120 à 180 caractères, maximum 220).",
  descriptionLabel: "Description détaillée",
  descriptionHint:
    "Développez le produit (usage, praticité, fabrication, finitions). Évitez de dupliquer les listes factuelles déjà saisies dans Caractéristiques.",
  careInstructionsLabel: "Conseils d'entretien",
  careInstructionsHint:
    "Champ dédié aux conseils de soin affichés sur la fiche produit. Saisissez-les ici et évitez de les dupliquer dans Caractéristiques.",
  statusLabel: "Statut",
  statusHint:
    "Brouillon : non visible. Actif : publié sur la boutique. Inactif : retiré temporairement. Archivé : retiré définitivement.",
  isFeaturedLabel: "Mise en avant",
  statusDraft: "Brouillon",
  statusActive: "Actif",
  statusInactive: "Inactif",
  statusArchived: "Archivé",
  featuredStandard: "Produit standard",
  featuredTrue: "Produit mis en avant",
  typeNone: "Non renseignée",
  typeSimple: "Produit simple",
  typeVariable: "Produit à variantes",
  typeHistorical: "Import catalogue historique",
} as const;

// ─── Pricing tab ──────────────────────────────────────────────────────────────

export const PRODUCT_PRICING_TAB_COPY = {
  defaultPriceTitle: "Prix boutique (principal)",
  defaultPriceDescription:
    "Définissez le prix affiché sur la boutique. Laisser vide désactive ce tarif.",
  advancedPriceTitle: "Listes de prix (avancé)",
  advancedPriceDescription:
    "Pour des besoins spécifiques. La boutique V1 ne choisit pas encore une liste de prix.",
  variantPriceTitle: "Prix variantes",
  variantPriceDescription:
    "Chaque variante peut avoir son propre prix. Si aucun prix n'est renseigné, le prix du produit est utilisé.",
  noPriceLists: "Aucune liste de prix disponible.",
  noDefaultPriceList: 'Aucune liste de prix n\'est marquée comme "par défaut".',
  shopBadge: "Boutique",
  priceLabel: "Prix",
  priceHint: "Montant affiché sur la fiche produit.",
  compareAtLabel: "Prix barré (optionnel)",
  compareAtLabelShort: "Prix barré",
  compareAtHint: "Affiché barré pour indiquer une promotion.",
  promotionAdvancedLabel: "Options avancées (promotion)",
  promotionAdvancedShort: "Promotion (avancé)",
  promotionPeriodLabel: "Période de promotion",
  promotionStartLabel: "Début",
  promotionEndLabel: "Fin",
  variantColumnVariant: "Variante",
  variantPriceAppliedSpecific: "Prix appliqué · Prix spécifique",
  variantPriceAppliedProduct: "Prix appliqué · Prix du produit",
  statusExpired: "Expirée",
  statusPlanned: "Planifiée",
  statusActive: "Active",
  advancedListsToggle: (count: number): string => `Afficher les autres listes de prix (${count})`,
  storefrontHint:
    "La boutique affiche actuellement un prix simple. Les listes de prix et la planification de promotion ne pilotent pas encore l'affichage storefront (V1).",
  promotionDatesHint:
    "Ces dates sont enregistrées mais ne pilotent pas encore l'affichage storefront en V1.",
  advancedStorefrontNote: "Stockage uniquement. Non consommé storefront V1.",
  variantPriceReadOnly:
    "Lecture seule (V1). L'édition des prix par variante n'est pas encore disponible dans l'admin. La boutique applique: prix variante si présent, sinon prix produit.",
} as const;

// ─── Availability tab ─────────────────────────────────────────────────────────

export const PRODUCT_AVAILABILITY_TAB_COPY = {
  singleTitle: "Disponibilité",
  singleDescription: "Définissez si ce produit est vendable en ligne.",
  variantsTitle: "Disponibilité par variante",
  variantsDescription:
    "Définissez la vendabilité de chaque déclinaison sans gérer ici les quantités de stock.",
  noData: "Aucune donnée de disponibilité disponible pour ce produit.",
  noVariants: "Aucune variante disponible pour gérer la vendabilité.",
  statusFieldLabel: "Statut de disponibilité",
  sellableFieldLabel: "Vente en ligne",
  backorderFieldLabel: "Commandes en rupture de stock",
  sellableTrue: "Vendable",
  sellableFalse: "Non vendable",
  backorderAllowed: "Autorisée",
  backorderForbidden: "Interdite",
  sellableFrom: "Début de vente",
  sellableUntil: "Fin de vente",
  preorderStart: "Début de précommande",
  preorderEnd: "Fin de précommande",
  statusAvailable: "Disponible à la vente",
  statusUnavailable: "Indisponible à la vente",
  statusPreorder: "Précommande ouverte",
  statusBackorder: "Commande en rupture",
  statusDiscontinued: "Arrêt commercial",
  statusArchived: "Archivé",
  variantNameFallback: "Variante sans nom",
  internalRefLabel: "Référence interne :",
  statusHint:
    "Le statut indique l'état commercial du produit. La vendabilité contrôle si l'ajout au panier est autorisé.",
} as const;

// ─── Inventory tab ────────────────────────────────────────────────────────────

export const PRODUCT_INVENTORY_TAB_COPY = {
  singleTitle: "Stock du produit",
  singleDescription: "Gérez les quantités disponibles pour ce produit.",
  variantsTitle: "Stock par variante",
  variantsDescription: "Gérez les quantités de stock sans modifier ici la vendabilité.",
  noData: "Aucune donnée de stock disponible pour ce produit.",
  noVariants: "Aucune variante disponible pour gérer le stock.",
  physicalStockLabel: "Stock physique",
  availableStockLabel: "Stock disponible:",
  reservedStockLabel: "Stock réservé :",
  backorderStatusLabel: "Rupture de stock :",
  backorderAllowed: "Autorisée",
  backorderForbidden: "Non autorisée",
  inventoryStatusLabel: "État du stock :",
  inventoryRecorded: "Enregistré",
  inventoryUnrecorded: "Non enregistré",
  internalRefLabel: "Référence interne :",
  variantNameFallback: "Variante sans nom",
  reservedStockHint:
    "Le stock réservé est géré automatiquement par le système. Le stock disponible est calculé en conséquence.",
} as const;

// ─── Characteristics tab ──────────────────────────────────────────────────────

export const PRODUCT_CHARACTERISTICS_TAB_COPY = {
  sectionTitle: "Caractéristiques produit",
  sectionDescription:
    "Renseignez les attributs factuels du produit : matière, dimensions, fermeture, composition, etc.",
  addTitle: "Ajouter une caractéristique",
  suggestionsLabel: "Suggestions :",
  labelFieldLabel: "Libellé",
  labelPlaceholder: "Ex : Matière",
  valueFieldLabel: "Valeur",
  valuePlaceholder: "Ex : Toile enduite imperméable",
  valuePlaceholderEdit: "Ex : Cuir pleine fleur",
  addButton: "Ajouter",
  limitReached: "Limite atteinte : 20 caractéristiques maximum.",
  emptyTitle: "Aucune caractéristique enregistrée.",
  emptyDescription: "Ajoutez vos premières caractéristiques pour enrichir la fiche produit.",
  rowOrderLabel: (index: number): string => `Ordre ${index + 1}`,
  moveUpAriaLabel: (index: number): string => `Monter la caractéristique ${index + 1}`,
  moveDownAriaLabel: (index: number): string => `Descendre la caractéristique ${index + 1}`,
  deleteAriaLabel: (index: number): string => `Supprimer la caractéristique ${index + 1}`,
} as const;

// ─── Related products tab ─────────────────────────────────────────────────────

export const PRODUCT_RELATED_PRODUCTS_TAB_COPY = {
  linkedTitle: "Produits liés",
  linkedDescription:
    "Ces produits sont affichés sur la fiche produit. Le type change l'intitulé en vitrine, et l'ordre d'affichage se gère avec Monter/Descendre.",
  addTitle: "Ajouter un produit lié",
  addDescription:
    "Choisissez un produit à mettre en avant depuis cette fiche. Vous pourrez ensuite ajuster le type et l'ordre.",
  emptyTitle: "Aucun produit lié pour le moment.",
  emptyDescription:
    "Ajoutez 1 à 3 produits complémentaires pour guider la navigation. Vous pourrez ajuster le type et l'ordre ensuite.",
  productFieldLabel: "Produit à lier",
  productFieldHint: "Seuls les produits non encore associés à cet article sont proposés.",
  typeFieldLabel: "Type de relation",
  selectProductPlaceholder: "Sélectionner un produit",
  allLinkedPlaceholder: "Tous les produits disponibles sont déjà liés",
  removeButton: "Retirer",
  moveUp: "Monter",
  moveDown: "Descendre",
} as const;

// ─── Categories tab ───────────────────────────────────────────────────────────

export const PRODUCT_CATEGORIES_TAB_COPY = {
  sectionTitle: "Catégories",
  summaryLinkedLabel: "Catégories liées",
  summaryLinkedCount: (count: number): string => `${count} sélectionnées`,
  summaryPrimaryLabel: "Catégorie principale",
  summaryPrimaryNone: "Aucune",
  primaryFieldLabel: "Catégorie principale",
  primaryFieldHint:
    "La catégorie principale définit le classement principal de ce produit dans la boutique. Choisir la plus spécifique disponible.",
  primaryRootPlaceholder: "Choisir une catégorie",
  primaryChildPlaceholder: "Choisir une sous-catégorie",
  parentCategoryOption: "Catégorie parente",
  addFieldLabel: "Ajouter une catégorie",
  addRootPlaceholder: "Choisir une catégorie",
  addChildPlaceholder: "Choisir une sous-catégorie",
  addButton: "Ajouter",
} as const;

// ─── SEO tab ──────────────────────────────────────────────────────────────────

export const PRODUCT_SEO_TAB_COPY = {
  googleSectionTitle: "Référencement Google",
  socialSectionTitle: "Réseaux sociaux",
  googlePreviewLabel: "Aperçu Google",
  socialPreviewLabel: "Aperçu partage",
  titleFieldLabel: "Titre pour Google",
  descriptionFieldLabel: "Description pour Google",
  canonicalFieldLabel: "Adresse de la page (URL canonique)",
  indexingFieldLabel: "Visibilité Google",
  sitemapFieldLabel: "Plan du site (Sitemap)",
  ogTitleLabel: "Titre de partage",
  ogDescriptionLabel: "Description de partage",
  twitterTitleLabel: "Titre X",
  twitterDescriptionLabel: "Description X",
  twitterNetworkLabel: "X (anciennement Twitter)",
  facebookNetworkLabel: "Facebook, LinkedIn et autres réseaux",
  socialImageLabel: "Image de partage",
  imageProductFallback: "Image du produit",
  deleteImageButton: "Supprimer",
  chooseImageButton: "Choisir une image dédiée",
  changeImageButton: "Modifier",
  closeImageButton: "Fermer",
  prefillButton: "← Pré-remplir",
  showSocialFieldsButton: "Personnaliser le titre et la description",
  hideSocialFieldsButton: "Masquer les champs de personnalisation",
  checklistErrorsTitle: "Points à corriger",
  checklistWarningsTitle: "Quelques points à surveiller",
  checklistOkTitle: "Référencement en bon état",
  priorityActionsTitle: "À faire en priorité",
} as const;

// ─── Images tab ───────────────────────────────────────────────────────────────

export const PRODUCT_IMAGES_TAB_COPY = {
  gallerySectionTitle: "Galerie produit",
  gallerySectionDescription:
    "Gère les médias affichés sur la fiche produit, leur ordre et leur image principale — c'est-à-dire la photo mise en avant en premier sur la boutique.",
  infoSectionTitle: "Informations de repère",
  infoSectionDescription: "Repères rapides sur la galerie et l'image principale.",
  ratioConformLabel: "Conformes 4:5",
  ratioToCropLabel: "À recadrer",
  ratioUnknownLabel: "Dimensions inconnues",
  uploadSourceTitle: "Importer depuis l'appareil",
  uploadSourceDescription: "Charge de nouveaux fichiers images depuis votre ordinateur.",
  librarySourceTitle: "Choisir depuis la médiathèque",
  librarySourceDescription: "Réutilise des médias déjà présents dans votre bibliothèque.",
  uploadPanelTitle: "Importer des images",
  uploadPanelClose: "Fermer",
  primaryImagePrefix: "Image principale du produit :",
  noPrimaryImage: "Aucune image principale du produit n'est définie.",
  infoSlugLabel: "Lien du produit",
  infoIdLabel: "Identifiant interne",
  infoPrimaryLabel: "Image principale",
  infoPrimaryDefined: "Définie",
  infoPrimaryNone: "Aucune",
  imageCount: (count: number): string => `${count} image${count > 1 ? "s" : ""}`,
} as const;

// ─── Variants tab ─────────────────────────────────────────────────────────────

export const PRODUCT_VARIANTS_TAB_COPY = {
  addVariantButton: "Ajouter une variante",
  variantImageHint:
    "L'image principale de chaque variante est choisie parmi les médias déjà rattachés au produit.",
  colorValuesSectionTitle: "Valeurs couleur",
  colorValuesSectionSubtitle: "Valeurs partagées entre variantes",
  noColorOptions: "Aucune option couleur active pour ce type produit.",
  noColorValues: "Aucune valeur couleur active.",
  colorManageHint: "Gérez le libellé et la couleur hex des valeurs disponibles.",
  colorLabelField: "Libellé",
  colorColorField: "Couleur",
  colorHexField: "Hex",
  colorSaveButton: "Enregistrer",
  colorDeleteAriaLabel: "Supprimer la couleur",
  colorInvalidHex: "Code invalide: utilisez #RGB ou #RRGGBB.",
  colorNewLabelField: "Nouvelle couleur (libellé)",
  colorNewLabelPlaceholder: "Ex. Cognac",
  colorNewHexPlaceholder: "#8B4513",
  colorAddButton: "Ajouter",
  defaultVariantLabel: (label: string): string => ` • variante par défaut : ${label}`,
  variantCountLabel: (count: number): string => `${count} variante${count > 1 ? "s" : ""}`,
} as const;

// ─── Image item ───────────────────────────────────────────────────────────────

export const PRODUCT_IMAGE_ITEM_COPY = {
  primaryBadge: "Principale",
  setPrimaryAriaLabel: "Définir comme principale",
  setPrimaryTooltip: "Définir comme principale",
  isPrimaryTooltip: "Image principale",
  editAltAriaLabel: "Modifier le texte alt",
  editAltTooltip: "Modifier le texte alternatif",
  menuAriaLabel: "Actions image",
  menuMoreTooltip: "Plus d'actions",
  moveUp: "Monter",
  moveDown: "Descendre",
  editAltMenuLabel: "Modifier le texte alt",
  setPrimaryMenuLabel: "Définir comme principale",
  deleteMenuLabel: "Supprimer",
  altTextLabel: "Texte alternatif",
  altTextPlaceholder: "Texte alternatif",
  altTextNone: "Aucun texte alternatif",
  saveAltButton: "Enregistrer",
  cancelAltButton: "Annuler",
  imageFallbackAlt: "Image produit",
  ratioConform: "Conforme 4:5 (hero-ready)",
  ratioNonConform: "À recadrer (hors 4:5)",
  ratioDimensionsUnknown: "Dimensions inconnues",
} as const;

// ─── Image library ────────────────────────────────────────────────────────────

export const PRODUCT_IMAGE_LIBRARY_COPY = {
  sheetTitle: "Médiathèque",
  sheetDescription:
    "Sélectionne un ou plusieurs médias déjà présents dans ta médiathèque pour les ajouter à la galerie du produit.",
  searchPlaceholder: "Rechercher un média…",
  selectedCount: (count: number): string => `${count} sélection${count > 1 ? "s" : ""}`,
  cancelButton: "Annuler",
  attachButton: "Ajouter à la galerie",
  attachPending: "Ajout en cours…",
  emptyState: "Aucun média disponible.",
  altTextFallback: "Sans texte alternatif",
  filenameFallback: "Média",
} as const;

// ─── Image upload form ────────────────────────────────────────────────────────

export const PRODUCT_IMAGE_UPLOAD_COPY = {
  filesLabel: "Images à importer",
  filesDescription:
    "Formats acceptés : JPEG, PNG, WebP, AVIF. La sélection multiple est autorisée.",
  makePrimaryLabel: "Définir comme image principale",
  makePrimaryCheckboxLabel: "Utiliser comme image principale",
  altTextLabel: "Texte alternatif",
  altTextDescription: "Champ optionnel appliqué aux images importées.",
  altTextPlaceholder: "Décris brièvement l'image",
  submitButton: "Importer les images",
  submitPending: "Import…",
} as const;

// ─── Variant editor sheet ─────────────────────────────────────────────────────

export const PRODUCT_VARIANT_EDITOR_COPY = {
  editTitle: "Modifier la variante",
  createTitle: "Ajouter une variante",
  editDescription: "Mise à jour des informations principales de la variante.",
  createDescription: "Création d'une nouvelle variante pour ce produit.",
  identityEyebrow: "Identité",
  identityTitle: "Identité de la variante",
  attributesEyebrow: "Attributs",
  attributesTitle: "Attributs de la variante",
  attributesDescription:
    "Associez cette variante aux valeurs d'options qui la différencient (couleur, taille…).",
  publicationEyebrow: "Publication",
  publicationTitle: "Publication et ordre",
  publicationDescription:
    "Choisissez le statut de la variante, son ordre d'apparition et son éventuel statut par défaut.",
  imageEyebrow: "Image",
  imageTitle: "Image principale",
  imageDescription:
    "La variante choisit son image principale parmi les médias déjà rattachés au produit.",
  technicalEyebrow: "Repères",
  technicalTitle: "Repères techniques",
  dimensionsEyebrow: "Dimensions",
  dimensionsTitle: "Dimensions et poids",
  dimensionsDescription:
    "Renseignez les mesures de la variante lorsqu'elles sont utiles au pilotage.",
  noOptions: "Ce produit ne possède pas d'axes d'option configurés.",
  noImages: "Aucune image produit n'est encore disponible pour cette variante.",
  optionNone: "— Aucune —",
  statusDraft: "Brouillon",
  statusActive: "Actif",
  statusInactive: "Inactif",
  statusArchived: "Archivé",
  defaultYes: "Oui",
  defaultNo: "Non",
  nameLabel: "Nom",
  skuLabel: "Référence interne",
  slugLabel: "Adresse de la variante",
  statusLabel: "Statut",
  defaultLabel: "Variante par défaut",
  sortOrderLabel: "Ordre",
  barcodeLabel: "Code-barres",
  externalRefLabel: "Référence externe",
  weightLabel: "Poids (g)",
  widthLabel: "Largeur (mm)",
  heightLabel: "Hauteur (mm)",
  depthLabel: "Profondeur (mm)",
  cancelButton: "Annuler",
  saveButton: "Enregistrer",
  createButton: "Créer",
  savePending: "Enregistrement…",
} as const;

// ─── Variant item ─────────────────────────────────────────────────────────────

export const PRODUCT_VARIANT_ITEM_COPY = {
  defaultBadge: "Par défaut",
  noAttributes: "Aucun attribut défini.",
  noAttributesFallback: "Aucun attribut",
  editButton: "Modifier",
  setDefaultButton: "Définir par défaut",
  deleteButton: "Supprimer",
  defaultWarning: "Choisissez une autre variante par défaut avant de supprimer celle-ci.",
  noImage: "Aucune image",
  imageDefined: "Image principale.",
  imageUndefined: "À choisir dans la galerie.",
  attrSectionLabel: "Attributs",
  technicalSectionLabel: "Repères techniques",
  imageSectionLabel: "Image",
  addressLabel: "Adresse",
  sortOrderLabel: "Ordre interne",
  barcodeLabel: "Code-barres",
  externalRefLabel: "Réf. externe",
  weightLabel: "Poids",
  dimensionsLabel: "Dimensions",
  internalRefPrefix: "Réf. interne",
  positionLabel: (pos: number, total: number): string => `Position ${pos}/${total}`,
  weightUnit: (g: string): string => `${g} g`,
  dimensionsFormat: (w: string | null, h: string | null, d: string | null): string =>
    `${w ?? "—"} × ${h ?? "—"} × ${d ?? "—"} mm`,
  stockNotTracked: "Stock non suivi",
  stockOut: "Rupture",
  stockLow: (qty: number): string => `Stock faible · ${qty}`,
  stockOk: (qty: number): string => `Stock · ${qty}`,
  availabilityAvailable: "Disponible",
  availabilityPreorder: "Précommande",
  availabilityBackorder: "Sur commande",
  availabilityDiscontinued: "Arrêté",
  availabilityArchived: "Archivé",
  availabilityUnavailable: "Indisponible",
  statusDraft: "Brouillon",
  statusActive: "Actif",
  statusInactive: "Inactif",
  statusArchived: "Archivé",
} as const;

// ─── Variant image picker ─────────────────────────────────────────────────────

export const PRODUCT_VARIANT_IMAGE_PICKER_COPY = {
  selectedBadge: "Sélectionnée",
  imageFallbackAlt: "Image produit",
  mediaFallbackName: "Média",
  mediaUnavailable: "Média indisponible",
} as const;

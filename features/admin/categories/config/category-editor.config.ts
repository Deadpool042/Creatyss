type CategorySectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

export const CATEGORY_FIELD_COPY = {
  nameLabel: "Nom",
  slugLabel: "Adresse de la catégorie",
  slugHint: "Visible dans l’URL. Utilisez des lettres minuscules, des chiffres et des tirets.",
  descriptionLabel: "Description",
  parentLabel: "Catégorie parente",
  parentNoneOptionLabel: "Aucune catégorie parente",
  featuredLabel: "Afficher cette catégorie en avant dans l’administration",
} as const;

export const CATEGORY_GENERAL_SECTION_COPY = {
  eyebrow: "Informations",
  title: "Informations principales",
  description: "Mettez à jour le nom, l’adresse et le texte affichés dans le catalogue.",
} satisfies CategorySectionCopy;

export const CATEGORY_CREATE_GENERAL_SECTION_COPY = {
  ...CATEGORY_GENERAL_SECTION_COPY,
  description:
    "Renseignez les éléments visibles dans le catalogue. Vous pourrez compléter le visuel et le référencement ensuite.",
} satisfies CategorySectionCopy;

export const CATEGORY_SEO_SECTION_COPY = {
  eyebrow: "Référencement",
  title: "Référencement",
  description:
    "Aidez les moteurs de recherche et les aperçus de partage à présenter correctement la catégorie.",
} satisfies CategorySectionCopy;

export const CATEGORY_IMAGE_SECTION_COPY = {
  eyebrow: "Visuel",
  title: "Image principale",
  description:
    "Ajoutez un visuel pour identifier plus facilement la catégorie dans l’administration.",
} satisfies CategorySectionCopy;

export const CATEGORY_ARCHIVE_SECTION_COPY = {
  eyebrow: "Suppression",
  title: "Archiver la catégorie",
  description:
    "À utiliser seulement si cette catégorie ne doit plus apparaître dans l’administration. Elle pourra ensuite être restaurée depuis la vue archives.",
} satisfies CategorySectionCopy;

export const CATEGORY_RESTORE_SECTION_COPY = {
  eyebrow: "Archives",
  title: "Restaurer la catégorie",
  description:
    "Cette catégorie est archivée. Restaurez-la pour la remettre en brouillon et la réutiliser dans l’administration.",
} satisfies CategorySectionCopy;

export const CATEGORY_ARCHIVED_NOTICE_COPY =
  "Cette catégorie est archivée. Restaurez-la avant de modifier ses informations, son image ou son SEO.";

export const CATEGORY_ARCHIVE_DIALOG_COPY = {
  triggerLabel: "Archiver la catégorie",
  confirmLabel: "Archiver la catégorie",
  pendingLabel: "Archivage…",
  title: (categoryName: string) => `Archiver "${categoryName}" ?`,
  description:
    "La catégorie sera retirée de l’administration active. Vous pourrez la restaurer plus tard depuis les catégories archivées.",
} as const;

export const CATEGORY_MEDIA_EMPTY_STATE_COPY = {
  body: "Aucun média disponible.",
  linkLabel: "Ouvrir la médiathèque",
  linkHref: "/admin/media",
} as const;

export const CATEGORY_IMAGE_FORM_COPY = {
  emptyImageLabel: "Aucun visuel associé",
  mediaFieldLabel: "Choisir un média",
  emptyMediaOptionLabel: "Aucun média",
  setImagePendingLabel: "Mise à jour…",
  setImageSubmitLabel: "Mettre à jour le visuel",
  deleteImagePendingLabel: "Suppression…",
  deleteImageSubmitLabel: "Supprimer l’image",
} as const;

export const CATEGORY_SEO_FORM_COPY = {
  titleLabel: "Titre pour Google",
  descriptionLabel: "Description pour Google",
  descriptionPlaceholder: (categoryName: string) => `Sélection de produits : ${categoryName}`,
  canonicalPathLabel: "Adresse canonique",
  canonicalPathPlaceholder: "/boutique/categories/...",
  indexingModeLabel: "Visibilité dans les moteurs de recherche",
  sitemapIncludedLabel: "Inclure cette catégorie dans le sitemap",
  openGraphTitleLabel: "Titre d’aperçu de partage",
  openGraphDescriptionLabel: "Description d’aperçu de partage",
  twitterTitleLabel: "Titre réseau social",
  twitterDescriptionLabel: "Description réseau social",
  submitPendingLabel: "Enregistrement…",
  submitLabel: "Enregistrer le référencement",
} as const;

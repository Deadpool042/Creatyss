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
  description: "Édition du produit, de ses variantes, de ses médias, de ses catégories et de son SEO.",
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
} as const;

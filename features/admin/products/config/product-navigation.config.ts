type productNavigationCopyType = {
  homeLabel: string;
  backLabel: string;
  productsLabel: string | string[];
};

export const PRODUCT_NAVIGATION_COPY = {
  homeLabel: "Accueil",
  backLabel: "Retour",
  productsLabel: "Produits",
} satisfies productNavigationCopyType;

export const PRODUCT_LIST_PAGE_COPY = {
  eyebrow: "Produits",
  title: "Catalogue de produits",
  titleTrash: "Corbeille produits",
  description: "Gérez les produits disponibles dans votre boutique.",
  descriptionTrash: "Produits archivés, restaurables plus tard.",
  navHomeLabel: "Accueil",
  navProductsLabel: "Produits",
} as const;

export const PRODUCT_NEW_PAGE_COPY = {
  eyebrow: "Produits",
  title: "Nouvelle fiche produit",
  description: "Créez rapidement une fiche produit simple pour démarrer.",
} as const;

export const PRODUCT_EDIT_PAGE_COPY = {
  eyebrow: "Produits",
  title: "Modifier le produit",
  description:
    "Mettez à jour les informations visibles dans le catalogue, puis complétez le visuel et le référencement si nécessaire.",
} as const;

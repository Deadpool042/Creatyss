export type CatalogOverviewStats = {
  products: {
    total: number;
    active: number;
    draft: number;
    archived: number;
  };
  categories: {
    total: number;
    active: number;
    draft: number;
    archived: number;
  };
  media: {
    total: number;
    archived: number;
  };
  alerts: {
    productsWithoutImages: number;
    productsWithoutCategories: number;
    categoriesWithoutProducts: number;
  };
};

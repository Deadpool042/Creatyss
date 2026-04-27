export type CatalogCategoryFilterItem = {
  id: string;
  slug: string;
  name: string;
};

export type CatalogSitemapProduct = {
  slug: string;
  updatedAt: Date;
  sitemapIncluded: boolean;
};

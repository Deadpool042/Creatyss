export type CatalogCategoryFilterItem = {
  id: string;
  parentId: string | null;
  slug: string;
  name: string;
};

export type CatalogSitemapProduct = {
  slug: string;
  updatedAt: Date;
  sitemapIncluded: boolean;
};

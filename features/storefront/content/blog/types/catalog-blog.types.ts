export type CatalogBlogListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
};

export type CatalogBlogDetail = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  coverImagePath: string | null;
};

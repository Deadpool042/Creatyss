export type CategoryStatus = "draft" | "active" | "archived";
export type CategorySeoIndexingState = "index" | "noindex";

export type CategorySeoSnapshot = {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  indexingState: CategorySeoIndexingState;
};

export type CategoryTreeParent = {
  id: string;
  slug: string;
  name: string;
} | null;

export type CategorySummary = {
  id: string;
  storeId: string;
  parentId: string | null;
  slug: string;
  name: string;
  description: string | null;
  status: CategoryStatus;
  sortOrder: number;
  isFeatured: boolean;
  seo: CategorySeoSnapshot | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryChildSummary = Pick<
  CategorySummary,
  "id" | "storeId" | "parentId" | "slug" | "name" | "description" | "status" | "sortOrder" | "isFeatured"
>;

export type CategoryDetail = CategorySummary & {
  parent: CategoryTreeParent;
  children: CategoryChildSummary[];
};

export type CategoryTreeNode = CategorySummary & {
  children: CategoryTreeNode[];
};

export class CategoryRepositoryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "CategoryRepositoryError";
    this.code = code;
  }
}

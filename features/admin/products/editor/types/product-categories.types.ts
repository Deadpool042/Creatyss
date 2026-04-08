export type ProductCategoryOption = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parentName: string | null;
};

export type CategoryNode = ProductCategoryOption;

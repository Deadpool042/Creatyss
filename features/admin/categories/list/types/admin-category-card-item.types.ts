export type AdminCategoryStatus = "draft" | "active" | "inactive" | "archived";

export type AdminCategoryCardItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isFeatured: boolean;
  status: AdminCategoryStatus;
  primaryImageUrl: string | null;
  primaryImageAlt: string | null;
};

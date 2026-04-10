export type AdminProductDisplayStatus = "draft" | "active" | "inactive" | "archived";

export type AdminProductDetails = {
  id: string;
  slug: string;
  name: string;
  status: AdminProductDisplayStatus;
  isFeatured: boolean;
  description: string | null;
  shortDescription: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  productTypeName: string | null;
  categoryNames: string[];
};

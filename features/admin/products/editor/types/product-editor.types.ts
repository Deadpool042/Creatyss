//features/admin/products/editor/types/product-editor.types.ts
export type AdminProductEditorStatus = "draft" | "published" | "archived";

export type AdminProductEditorImage = {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
};

export type AdminProductEditorVariant = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  status: AdminProductEditorStatus;
  amount: string;
  compareAtAmount: string;
  primaryImageUrl: string | null;
  primaryImageAlt: string | null;
};

export type AdminProductEditorCategory = {
  id: string;
  slug: string;
  name: string;
  parentName: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

export type AdminProductEditorData = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  status: AdminProductEditorStatus;
  isFeatured: boolean;
  primaryCategoryId: string | null;
  categoryIds: string[];
  categories: AdminProductEditorCategory[];
  images: AdminProductEditorImage[];
  variants: AdminProductEditorVariant[];
  seo: {
    title: string;
    description: string;
  };
};

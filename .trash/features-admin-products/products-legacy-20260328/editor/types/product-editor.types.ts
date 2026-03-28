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
  name: string | null;
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
  categoryIds: string[];
  categories: AdminProductEditorCategory[];
  images: AdminProductEditorImage[];
  variants: AdminProductEditorVariant[];
  seo: {
    title: string;
    description: string;
  };
};

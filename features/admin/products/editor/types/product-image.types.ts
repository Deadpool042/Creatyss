import type { AdminProductActionResult } from "@/features/admin/products/types";

export type UploadProductImageFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<Record<"file" | "altText" | "productId" | "setAsPrimary", string>>;
};

export const uploadProductImageFormInitialState: UploadProductImageFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type AdminProductImageItem = {
  id: string;
  mediaAssetId: string;
  subjectType: "product" | "product_variant";
  subjectId: string;
  role: "primary" | "cover" | "gallery" | "thumbnail" | "other";
  sortOrder: number;
  isPrimary: boolean;
  publicUrl: string | null;
  storageKey: string;
  altText: string | null;
  originalName: string | null;
  mimeType: string | null;
  widthPx: number | null;
  heightPx: number | null;
};

export type AdminProductImagesData = {
  productId: string;
  productSlug: string;
  primaryImageId: string | null;
  images: AdminProductImageItem[];
};

export type AttachableMediaAssetItem = {
  id: string;
  publicUrl: string;
  altText: string | null;
  originalFilename: string | null;
  createdAt: string;
};

export type AttachableMediaAssetsData = {
  productId: string;
  items: AttachableMediaAssetItem[];
};

export type UpdateProductImageAltTextInput = {
  productId: string;
  imageId: string;
  altText: string;
};

export type UpdateProductImageAltTextResult = AdminProductActionResult;

export type GenerateMissingProductImageAltTextInput = {
  productId: string;
};

export type GenerateMissingProductImageAltTextResult = AdminProductActionResult & {
  generatedCount?: number;
};

export type AttachProductImagesInput = {
  images: Array<{
    productId: string;
    mediaAssetId: string;
    subjectType: "product" | "product_variant";
    subjectId: string;
    role: "gallery" | "thumbnail" | "other";
    sortOrder: number;
  }>;
};

export type AttachProductImagesResult = AdminProductActionResult;

export type DeleteProductImageInput = {
  productId: string;
  imageId: string;
};

export type DeleteProductImageResult = AdminProductActionResult;

export type SetProductPrimaryImageInput = {
  productId: string;
  mediaAssetId: string | null;
};

export type SetProductPrimaryImageResult = AdminProductActionResult;

export type ProductImageReorderDirection = "up" | "down";

export type ReorderProductImageInput = {
  productId: string;
  imageId: string;
  sortOrder: number;
};

export type ReorderProductImageResult = AdminProductActionResult;

export type UploadProductImagesInput = {
  productId: string;
  altText: string;
  makePrimary: boolean;
};

export type UploadProductImagesFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: {
    productId?: string;
    files?: string;
    altText?: string;
    makePrimary?: string;
  };
};

export const uploadProductImagesFormInitialState: UploadProductImagesFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

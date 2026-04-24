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

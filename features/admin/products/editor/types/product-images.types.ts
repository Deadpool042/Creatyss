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
  assetId: string;
  referenceId: string;
  publicUrl: string;
  altText: string | null;
  role: "primary" | "gallery";
  isPrimary: boolean;
  sortOrder: number;
};

export type AdminProductImagesData = {
  productId: string;
  productSlug: string;
  primaryImageId: string | null;
  images: AdminProductImageItem[];
};

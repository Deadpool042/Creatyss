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

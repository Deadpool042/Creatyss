export type ProductGeneralFormValues = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
};

export type ProductGeneralFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<
    Record<
      "id" | "name" | "slug" | "shortDescription" | "description" | "status" | "isFeatured",
      string
    >
  >;
};

export const productGeneralFormInitialState: ProductGeneralFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type ProductGeneralFormAction = (
  prevState: ProductGeneralFormState,
  formData: FormData
) => Promise<ProductGeneralFormState>;

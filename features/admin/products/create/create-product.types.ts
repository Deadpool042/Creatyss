export type AdminCreatableProductTypeCode = "simple" | "variable";

export type CreateProductFormValues = {
  name: string;
  slug: string;
};

export type CreateProductActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<Record<"name" | "slug", string>>;
};

export const initialCreateProductActionState: CreateProductActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

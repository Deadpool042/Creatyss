export type CreateProductFormValues = {
  name: string;
  slug: string;
  shortDescription: string;
  status: "draft" | "published";
};

export type CreateProductActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<Record<keyof CreateProductFormValues, string>>;
};

export const initialCreateProductActionState: CreateProductActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

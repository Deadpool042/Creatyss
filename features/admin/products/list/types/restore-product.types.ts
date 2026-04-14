export type RestoreProductInput = {
  productSlug: string;
};

export type RestoreProductResult = {
  status: "success" | "error";
  message: string;
};

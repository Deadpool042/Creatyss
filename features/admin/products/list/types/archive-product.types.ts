export type ArchiveProductInput = {
  productSlug: string;
};

export type ArchiveProductResult = {
  status: "success" | "error";
  message: string;
};

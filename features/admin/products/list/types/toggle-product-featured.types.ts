export type ToggleProductFeaturedInput = {
  productId: string;
};

export type ToggleProductFeaturedResult = {
  status: "success" | "error";
  message: string;
  isFeatured?: boolean;
};

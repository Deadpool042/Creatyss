export type ToggleProductFeaturedResult = {
  status: "success" | "error";
  message: string;
  isFeatured?: boolean;
};

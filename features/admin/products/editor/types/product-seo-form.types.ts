import type { SeoIndexingMode } from "@/prisma-generated/client";

export type ProductSeoFormValues = {
  productId: string;
  title: string;
  description: string;
  canonicalPath: string;
  indexingMode: SeoIndexingMode;
  sitemapIncluded: boolean;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImageId: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImageId: string;
};

export type ProductSeoFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<
    Record<
      | "productId"
      | "title"
      | "description"
      | "canonicalPath"
      | "indexingMode"
      | "sitemapIncluded"
      | "openGraphTitle"
      | "openGraphDescription"
      | "openGraphImageId"
      | "twitterTitle"
      | "twitterDescription"
      | "twitterImageId",
      string
    >
  >;
};

export const productSeoFormInitialState: ProductSeoFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type ProductSeoFormAction = (
  prevState: ProductSeoFormState,
  formData: FormData
) => Promise<ProductSeoFormState>;

import { updateProductVariantSchema } from "./update-product-variant.schema";

export const createProductVariantSchema = updateProductVariantSchema.omit({
  id: true,
});

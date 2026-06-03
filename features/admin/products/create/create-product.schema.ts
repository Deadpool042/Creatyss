import { z } from "zod";

import { PRODUCT_TYPE_VALUES } from "@/entities/product";

const adminCreatableProductTypeCodeSchema = z.enum(PRODUCT_TYPE_VALUES);

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Le nom est obligatoire."),
  slug: z
    .string()
    .trim()
    .min(1, "Le slug est obligatoire.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Le slug doit être en kebab-case."),
  productTypeCode: adminCreatableProductTypeCodeSchema.default("simple"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

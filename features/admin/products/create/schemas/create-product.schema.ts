import { z } from "zod";

const adminCreatableProductTypeCodeSchema = z.enum(["simple", "variable"]);

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Le nom est obligatoire."),
  slug: z
    .string()
    .trim()
    .min(1, "Le slug est obligatoire.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Le slug doit être en kebab-case."),
  productTypeCode: adminCreatableProductTypeCodeSchema,
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Le nom est obligatoire."),
  slug: z
    .string()
    .trim()
    .min(1, "Le slug est obligatoire.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Le slug doit être en kebab-case."),
  shortDescription: z.string().trim().default(""),
  status: z.enum(["draft", "published"]),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

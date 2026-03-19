import { z } from "zod";

function formText(min = 1) {
  return z.preprocess((v) => (typeof v === "string" ? v.trim() : ""), z.string().min(min));
}

function formOptionalText() {
  return z.preprocess(
    (v) => (typeof v === "string" && v.trim().length > 0 ? v.trim() : null),
    z.string().nullable()
  );
}

function formCheckbox() {
  return z.preprocess((v) => v === "on" || v === "true" || v === "1", z.boolean());
}

function formEnum<T extends string>(values: readonly [T, ...T[]]) {
  return z.preprocess((v) => (typeof v === "string" ? v.trim() : ""), z.enum(values));
}

export const ProductFormSchema = z.object({
  name: formText(),
  slug: formText(),
  shortDescription: formOptionalText(),
  description: formOptionalText(),
  seoTitle: formOptionalText(),
  seoDescription: formOptionalText(),
  status: formEnum(["draft", "published"] as const),
  productType: formEnum(["simple", "variable"] as const),
  isFeatured: formCheckbox(),
  categoryIds: z.preprocess(
    (v) => (Array.isArray(v) ? v : []),
    z.array(z.string().regex(/^[0-9]+$/))
  ),
});

export type ProductFormInput = z.infer<typeof ProductFormSchema>;

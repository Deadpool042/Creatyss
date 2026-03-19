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

export const CategoryFormSchema = z.object({
  name: formText(),
  slug: formText(),
  description: formOptionalText(),
  isFeatured: formCheckbox(),
});

export type CategoryFormInput = z.infer<typeof CategoryFormSchema>;

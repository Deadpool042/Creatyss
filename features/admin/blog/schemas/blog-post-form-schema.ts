// [PRÉPARATOIRE] Ce schéma n'est pas encore branché dans les actions blog.
// Il sera utilisé pour remplacer validateBlogPostInput (@/entities/blog/blog-post-input)
// dans un prochain lot. La sélection de cover image (logique __keep_current__ / numeric id)
// sera traitée séparément quand l'entity validator correspondant sera migré.
import { z } from "zod";

function formText(min = 1) {
  return z.preprocess(
    v => (typeof v === "string" ? v.trim() : ""),
    z.string().min(min)
  );
}

function formOptionalText() {
  return z.preprocess(
    v => (typeof v === "string" && v.trim().length > 0 ? v.trim() : null),
    z.string().nullable()
  );
}

function formEnum<T extends string>(values: readonly [T, ...T[]]) {
  return z.preprocess(
    v => (typeof v === "string" ? v.trim() : ""),
    z.enum(values)
  );
}

// Note : la sélection de l'image de couverture (cover image) reste gérée
// par l'entity validator — sa logique (__keep_current__, numeric id) est
// spécifique au domaine et sera migrée dans un lot ultérieur.
export const BlogPostFormSchema = z.object({
  title: formText(),
  slug: formText(),
  excerpt: formOptionalText(),
  content: formOptionalText(),
  seoTitle: formOptionalText(),
  seoDescription: formOptionalText(),
  status: formEnum(["draft", "published"] as const)
});

export type BlogPostFormInput = z.infer<typeof BlogPostFormSchema>;

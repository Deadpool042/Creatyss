// [PRÉPARATOIRE] Ce schéma n'est pas encore branché dans l'action homepage.
// Il couvre uniquement les champs texte simples. Les sélections de produits /
// catégories / articles en vedette avec sort orders restent dans validateHomepageInput
// (@/entities/homepage/homepage-input) jusqu'à leur migration dans un prochain lot.
import { z } from "zod";
import {
  HOMEPAGE_HERO_TITLE_MAX_LENGTH,
  HOMEPAGE_HERO_TEXT_MAX_LENGTH,
  HOMEPAGE_EDITORIAL_TITLE_MAX_LENGTH,
  HOMEPAGE_EDITORIAL_TEXT_MAX_LENGTH
} from "@/entities/homepage/homepage-input";

function formOptionalText(max?: number) {
  const base = max !== undefined ? z.string().max(max) : z.string();
  return z.preprocess(
    v => (typeof v === "string" && v.trim().length > 0 ? v.trim() : null),
    base.nullable()
  );
}

// Note : la sélection d'image hero et les sélections de produits/catégories/
// articles en vedette (avec sort orders) restent gérées par l'entity validator —
// leur logique est spécifique au domaine et sera migrée dans un lot ultérieur.
export const HomepageFormSchema = z.object({
  heroTitle: formOptionalText(HOMEPAGE_HERO_TITLE_MAX_LENGTH),
  heroText: formOptionalText(HOMEPAGE_HERO_TEXT_MAX_LENGTH),
  editorialTitle: formOptionalText(HOMEPAGE_EDITORIAL_TITLE_MAX_LENGTH),
  editorialText: formOptionalText(HOMEPAGE_EDITORIAL_TEXT_MAX_LENGTH)
});

export type HomepageFormInput = z.infer<typeof HomepageFormSchema>;

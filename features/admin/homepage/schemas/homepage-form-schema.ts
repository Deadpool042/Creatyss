// Ce schéma valide les champs texte du formulaire homepage.
//
// Périmètre dans ce lot :
//   - heroTitle, heroText, editorialTitle, editorialText
//
// Hors périmètre (reste dans validateHomepageInput / @/entities/homepage/homepage-input) :
//   - homepageId (parsing ID numérique)
//   - heroImageMediaAssetId (sélection image hero — 3 états)
//   - sélections featured (produits / catégories / articles) avec sort orders
//     → logique de déduplication + validation d'ordre trop complexe pour ce lot
//
// Utilisation dans update-homepage-action.ts :
//   1. ce schéma s'exécute en premier (fail-fast sur les champs texte)
//   2. validateHomepageInput() prend ensuite le relais pour tout le reste
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

export const HomepageFormSchema = z.object({
  heroTitle: formOptionalText(HOMEPAGE_HERO_TITLE_MAX_LENGTH),
  heroText: formOptionalText(HOMEPAGE_HERO_TEXT_MAX_LENGTH),
  editorialTitle: formOptionalText(HOMEPAGE_EDITORIAL_TITLE_MAX_LENGTH),
  editorialText: formOptionalText(HOMEPAGE_EDITORIAL_TEXT_MAX_LENGTH)
});

export type HomepageFormInput = z.infer<typeof HomepageFormSchema>;

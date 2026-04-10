import { z } from "zod";
import {
  HOMEPAGE_EDITORIAL_TEXT_MAX_LENGTH,
  HOMEPAGE_EDITORIAL_TITLE_MAX_LENGTH,
  HOMEPAGE_HERO_TEXT_MAX_LENGTH,
  HOMEPAGE_HERO_TITLE_MAX_LENGTH,
} from "@/entities/homepage/homepage-input";

function formOptionalText(max?: number) {
  const base = max !== undefined ? z.string().max(max) : z.string();

  return z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return null;
      }

      const normalizedValue = value.trim();

      return normalizedValue.length > 0 ? normalizedValue : null;
    },
    base.nullable(),
  );
}

export const HomepageFormSchema = z.object({
  heroTitle: formOptionalText(HOMEPAGE_HERO_TITLE_MAX_LENGTH),
  heroText: formOptionalText(HOMEPAGE_HERO_TEXT_MAX_LENGTH),
  editorialTitle: formOptionalText(HOMEPAGE_EDITORIAL_TITLE_MAX_LENGTH),
  editorialText: formOptionalText(HOMEPAGE_EDITORIAL_TEXT_MAX_LENGTH),
});

export type HomepageFormInput = z.infer<typeof HomepageFormSchema>;

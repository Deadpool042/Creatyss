/**
 * Contrat de copy des pages de contenu d'instance.
 *
 * La forme reste consommée par `a-propos`, `les-marches` et `contact`.
 * Le contenu de référence est désormais porté par le dictionnaire français,
 * selon la convention commune `entities/languages/<locale>/`.
 *
 * La bascule future vers des pages DB à blocs reste indépendante de ce
 * contrat éditorial.
 */
import { CONTENT_PAGES_COPY_FR } from "@/entities/languages/fr/content-pages/content-pages-copy_fr";
import { resolveLocaleContent } from "@/entities/languages/resolve-locale-content";

export type ContentPagesCopy = typeof CONTENT_PAGES_COPY_FR;

const CONTENT_PAGES_COPY_DEFAULT_LOCALE = "fr";

const contentPagesCopyDictionaries: Readonly<Record<string, ContentPagesCopy>> = {
  fr: CONTENT_PAGES_COPY_FR,
};

export const contentPagesCopyConfig: ContentPagesCopy = resolveLocaleContent({
  dictionaries: contentPagesCopyDictionaries,
  defaultLocaleCode: CONTENT_PAGES_COPY_DEFAULT_LOCALE,
});

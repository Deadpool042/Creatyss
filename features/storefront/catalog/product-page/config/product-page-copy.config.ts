/**
 * Copy éditorial de la fiche produit (Horizon 4 — lot R1 ; convention copy
 * unifiée — généralisation `LocalizedValue`, pilote n°2 après `homepage`).
 *
 * Cette config est le CONTRAT consommé par les composants (forme et clés du
 * copy ; valeurs par défaut éditoriales). Son CONTENU est résolu par locale
 * via `entities/languages/<locale>/product-page/`.
 *
 * Aujourd'hui une seule locale est servie (la locale par défaut, fr) : la
 * résolution est constante, mais suit déjà le chemin qu'empruntera une
 * future locale secondaire à l'activation du niveau `multilingual` de
 * `platform.localization` — aucun second remaniement des composants.
 */
import { resolveLocaleContent } from "@/entities/languages/resolve-locale-content";
import { PRODUCT_PAGE_COPY_FR } from "@/entities/languages/fr/product-page/product-page-copy_fr";

export type ProductPageCopy = typeof PRODUCT_PAGE_COPY_FR;

const PRODUCT_PAGE_COPY_DEFAULT_LOCALE = "fr";

const productPageCopyDictionaries: Readonly<Record<string, ProductPageCopy>> = {
  fr: PRODUCT_PAGE_COPY_FR,
};

export const productPageCopyConfig: ProductPageCopy = resolveLocaleContent({
  dictionaries: productPageCopyDictionaries,
  defaultLocaleCode: PRODUCT_PAGE_COPY_DEFAULT_LOCALE,
});

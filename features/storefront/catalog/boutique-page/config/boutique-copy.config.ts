/**
 * Copy éditorial de la page boutique (Horizon 4 — lot R1 ; convention copy
 * unifiée — généralisation `LocalizedValue`, pilote n°3 après `homepage` et
 * `product-page`).
 *
 * Cette config est le CONTRAT consommé par les composants (forme et clés du
 * copy ; valeurs par défaut éditoriales). Son CONTENU est résolu par locale
 * via `entities/languages/<locale>/boutique-page/`.
 *
 * Aujourd'hui une seule locale est servie (la locale par défaut, fr) : la
 * résolution est constante, mais suit déjà le chemin qu'empruntera une
 * future locale secondaire à l'activation du niveau `multilingual` de
 * `platform.localization` — aucun second remaniement des composants.
 */
import { resolveLocaleContent } from "@/entities/languages/resolve-locale-content";
import { BOUTIQUE_PAGE_COPY_FR } from "@/entities/languages/fr/boutique-page/boutique-page-copy_fr";

export type BoutiquePageCopy = typeof BOUTIQUE_PAGE_COPY_FR;

export type BoutiqueMarketEvent = BoutiquePageCopy["marketAside"]["events"][number];

const BOUTIQUE_PAGE_COPY_DEFAULT_LOCALE = "fr";

const boutiquePageCopyDictionaries: Readonly<Record<string, BoutiquePageCopy>> = {
  fr: BOUTIQUE_PAGE_COPY_FR,
};

export const boutiqueCopyConfig: BoutiquePageCopy = resolveLocaleContent({
  dictionaries: boutiquePageCopyDictionaries,
  defaultLocaleCode: BOUTIQUE_PAGE_COPY_DEFAULT_LOCALE,
});

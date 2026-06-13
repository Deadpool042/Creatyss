/**
 * Copy éditorial et fallbacks de la homepage (Horizon 4 — lot R1 ; convention
 * copy unifiée — lot 3, cf. docs/lots/2026-06-12-localization-l1-cadrage.md).
 *
 * Cette config est le CONTRAT consommé par les composants (forme et clés du
 * copy ; valeurs par défaut éditoriales pour la homepage éditable). Son
 * CONTENU est résolu par locale via `entities/languages/<locale>/homepage/`.
 *
 * Aujourd'hui une seule locale est servie (la locale par défaut, fr) : la
 * résolution est constante, mais suit déjà le chemin qu'empruntera une
 * future locale secondaire à l'activation du niveau `multilingual` de
 * `platform.localization` — aucun second remaniement des composants.
 */
import { resolveLocaleContent } from "@/entities/languages/resolve-locale-content";
import { HOMEPAGE_COPY_FR } from "@/entities/languages/fr/homepage/homepage-copy_fr";

export type HomepageCopy = typeof HOMEPAGE_COPY_FR;

const HOMEPAGE_COPY_DEFAULT_LOCALE = "fr";

const homepageCopyDictionaries: Readonly<Record<string, HomepageCopy>> = {
  fr: HOMEPAGE_COPY_FR,
};

export const homepageCopyConfig: HomepageCopy = resolveLocaleContent({
  dictionaries: homepageCopyDictionaries,
  defaultLocaleCode: HOMEPAGE_COPY_DEFAULT_LOCALE,
});

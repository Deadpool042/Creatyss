/**
 * Doctrine de largeur admin
 * ---------------------------------------------------------------------------
 * AdminPageShell est l'owner du container global de page via contentPreset.
 * Les features ne doivent pas compenser localement un défaut de shell avec
 * du padding ou du max-width de page.
 *
 * Responsabilités :
 * - AdminShell / safe-px-layout : alignement horizontal global avec la topbar.
 * - AdminPageShell / contentPreset : padding, scrolling et largeur globale.
 * - Feature UI : contraintes internes uniquement, jamais le cadrage de page.
 *
 * Familles cibles :
 * - dashboard       : cockpit large et cadré, max-width global dédié à stabiliser.
 * - overview        : vues métier centrées, max-width global cohérent.
 * - table/list      : pleine largeur utile, pas de max-width global.
 * - split view      : pleine largeur, les panes possèdent leurs dimensions.
 * - form/settings   : colonne lisible centrée, max-width global dédié.
 * - detail/editor   : layout dense, max-width local toléré tant que l'éditeur
 *                     possède des scroll containers ou asides spécifiques.
 *
 * Exceptions locales autorisées :
 * - max-w-* sur textes, descriptions et empty states pour la lisibilité.
 * - max-w-* sur sous-grilles internes, modales, sheets ou asides spécialisés.
 * - product editor dense : migration différée, car ses modules contrôlent leur
 *   propre scrolling, leurs footers sticky et leurs colonnes secondaires.
 *
 * Dette de naming :
 * - "full-width" est historique et ambigu. Aujourd'hui il signifie "page
 *   standard paddée" via ADMIN_CONTENT_PAGE, pas "table/split plein écran".
 * - Ne pas le renommer avant migration complète. Les presets explicites
 *   (overview, table, form, detail) servent aux migrations progressives.
 */

// Page standard historique : overviews, contenus et certains formulaires.
// Le wrapper AdminPageShell fournit flex/min-h-full/min-w-0/flex-col.
// Ici : uniquement espacement et padding. Pas de max-width pour préserver la
// compatibilité de "full-width" jusqu'aux migrations explicites.
export const ADMIN_CONTENT_PAGE =
  "safe-px-layout gap-4 overflow-x-hidden pt-4 max-sm:landscape:gap-3 max-sm:landscape:pt-3 md:gap-6 md:pt-5 lg:gap-6 lg:pt-0 lg:pb-8";

// Overview métier : page paddée, cadrée et centrée pour les grilles/cards.
export const ADMIN_CONTENT_OVERVIEW = `${ADMIN_CONTENT_PAGE} mx-auto w-full max-w-7xl`;

// Table/list : page paddée, pleine largeur réelle, sans max-width global.
export const ADMIN_CONTENT_TABLE = ADMIN_CONTENT_PAGE;

// Form/settings simples : page paddée, largeur de lecture courte.
export const ADMIN_CONTENT_FORM = `${ADMIN_CONTENT_PAGE} mx-auto w-full max-w-3xl`;

// Detail/editor dense : page paddée, largeur cadrée sans contraindre les sous-grilles.
export const ADMIN_CONTENT_DETAIL = `${ADMIN_CONTENT_PAGE} mx-auto w-full max-w-7xl`;

// Dashboard : page paddée et cockpit large cadré. Ce preset est l'owner du
// container global dashboard ; les sections internes ne portent plus safe-px.
// Le bottom spacing dépendant de la bottom nav est centralisé dans
// app/styles/safe-area.css via .admin-content-bottom-spacing.
// Le shell admin ajoute déjà son spacer universel ; ici le preset dashboard
// n'ajoute que sa largeur/gap/padding horizontal/top.
export const ADMIN_CONTENT_DASHBOARD =
  "mx-auto w-full max-w-7xl safe-px-layout gap-4 overflow-x-hidden pt-4 admin-content-bottom-spacing max-sm:landscape:gap-3 max-sm:landscape:pt-3 md:gap-6 md:pt-5 lg:gap-6 lg:pt-6";

// Panneau split-view : aucun max-width global.
// Les panes et leurs scroll containers sont propriétaires de leurs dimensions.
// Ne pas utiliser ADMIN_CONTENT_PAGE ici : cela ajouterait un padding de page
// autour d'une UI mail-like qui doit coller aux rails du split.
// export const ADMIN_CONTENT_SPLIT_PANEL = "px-4 pb-4 md:px-5 md:pb-5 lg:px-6 lg:pb-6";
export const ADMIN_CONTENT_SPLIT_PANEL = "";

// Presets consommables. "full-width" reste rétro-compatible et conserve sa
// sémantique historique de page standard paddée.
export type AdminContentPreset =
  | "none"
  | "full-width"
  | "dashboard"
  | "split-panel"
  | "overview"
  | "table"
  | "form"
  | "detail";

export function getAdminContentClassName(preset: AdminContentPreset): string {
  switch (preset) {
    case "full-width":
      return ADMIN_CONTENT_PAGE;
    case "overview":
      return ADMIN_CONTENT_OVERVIEW;
    case "table":
      return ADMIN_CONTENT_TABLE;
    case "form":
      return ADMIN_CONTENT_FORM;
    case "detail":
      return ADMIN_CONTENT_DETAIL;
    case "dashboard":
      return ADMIN_CONTENT_DASHBOARD;
    case "split-panel":
      return ADMIN_CONTENT_SPLIT_PANEL;
    case "none":
    default:
      return "";
  }
}

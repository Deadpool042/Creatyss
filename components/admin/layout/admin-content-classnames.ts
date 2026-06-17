/**
 * Doctrine de cadrage admin
 * ---------------------------------------------------------------------------
 * AdminPageShell possède le cadrage global des pages admin via contentPreset.
 *
 * Le wrapper de scroll et les fonds restent pleine largeur afin de fonctionner
 * avec `viewport-fit=cover`. Le padding horizontal safe-area est appliqué
 * uniquement au wrapper intérieur du contenu.
 *
 * Responsabilités :
 * - AdminShell : structure générale et compensation de la navigation mobile.
 * - AdminPageShell : scroll et wrapper intérieur de contenu.
 * - contentPreset : padding horizontal, espacement et largeur globale.
 * - Feature UI : contraintes internes uniquement.
 *
 * Les features ne doivent pas ajouter de padding ou de max-width pour corriger
 * le cadrage global d’une page.
 */

const ADMIN_CONTENT_BASE =
  "safe-px-layout w-full min-w-0 gap-4 overflow-x-hidden pt-4 " +
  "max-sm:landscape:gap-3 max-sm:landscape:pt-3 " +
  "md:gap-6 md:pt-5 lg:gap-6 lg:pt-0 lg:pb-8";

const ADMIN_CONTENT_WIDE = `${ADMIN_CONTENT_BASE} mx-auto max-w-7xl`;

const ADMIN_CONTENT_PRESETS = {
  dashboard:
    "safe-px-layout mx-auto w-full min-w-0 max-w-7xl gap-4 overflow-x-hidden pt-4 " +
    "max-sm:landscape:gap-3 max-sm:landscape:pt-3 " +
    "md:gap-6 md:pt-5 lg:gap-6 lg:pt-6 landscape:pb-2",

  overview: ADMIN_CONTENT_WIDE,

  table: ADMIN_CONTENT_BASE,

  form: `${ADMIN_CONTENT_BASE} mx-auto max-w-3xl`,

  detail: ADMIN_CONTENT_WIDE,
} as const satisfies Record<string, string>;

export type AdminContentPreset = keyof typeof ADMIN_CONTENT_PRESETS;

export function getAdminContentClassName(preset: AdminContentPreset): string {
  return ADMIN_CONTENT_PRESETS[preset];
}

// Page standard : overview, formulaires, contenus
// Le wrapper AdminPageShell fournit flex/min-h-full/min-w-0/flex-col
// Ici : uniquement l'espacement et le padding
export const ADMIN_CONTENT_PAGE =
  "gap-4 overflow-x-hidden px-4 pt-4 max-sm:landscape:gap-3 max-sm:landscape:px-3 max-sm:landscape:pt-3 md:gap-6 md:px-5 md:pt-5 lg:gap-6 lg:px-6 lg:pt-0 lg:pb-8";

// Dashboard : sections gèrent leur propre padding, mais il faut une réserve
// basse explicite sur mobile pour que la dernière carte passe au-dessus de la
// bottom nav fixe.
export const ADMIN_CONTENT_DASHBOARD =
  "overflow-x-hidden pb-[calc(3.5rem+env(safe-area-inset-bottom)+6rem)] [@media(max-height:480px)]:pb-0 lg:pb-0";

// Panneau split-view : pas de safe-area (bottom nav masqué sur mobile en split view)
export const ADMIN_CONTENT_SPLIT_PANEL = "px-4 pb-4 md:px-5 md:pb-5 lg:px-6 lg:pb-6";

export type AdminContentPreset = "none" | "full-width" | "dashboard" | "split-panel";

export function getAdminContentClassName(preset: AdminContentPreset): string {
  switch (preset) {
    case "full-width":
      return ADMIN_CONTENT_PAGE;
    case "dashboard":
      return ADMIN_CONTENT_DASHBOARD;
    case "split-panel":
      return ADMIN_CONTENT_SPLIT_PANEL;
    case "none":
    default:
      return "";
  }
}

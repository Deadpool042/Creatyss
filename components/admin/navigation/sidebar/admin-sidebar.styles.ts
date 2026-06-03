/**
 * Styles canoniques de la sidebar admin.
 * Source de vérité unique — tout changement visuel passe par ici.
 * Tokens : --sidebar-*, --brand, --text-muted-* (creatyss.light/dark.css)
 */

// ── Item de navigation ────────────────────────────────────────────────────
// h-10 = 40px — standard Apple sidebar item
// Active : left-border brand + bg sidebar-accent, pas de shadow
// Icon mode (collapsible) : pill centré, taille fixe 40×40
export const ADMIN_SIDEBAR_ITEM_CLASSNAME = [
  "h-10 rounded-r-xl rounded-l-sm",
  "border-l-2 border-transparent px-2.5",
  "text-[13px] text-text-muted-strong",
  "transition-colors duration-150",
  "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
  "data-[active=true]:border-brand",
  "data-[active=true]:bg-sidebar-accent",
  "data-[active=true]:text-sidebar-accent-foreground",
  "data-[active=true]:font-medium",
  "group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10",
  "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-xl",
  "group-data-[collapsible=icon]:border-l-0 group-data-[collapsible=icon]:px-0",
].join(" ");

// ── Icône de navigation ───────────────────────────────────────────────────
export const ADMIN_SIDEBAR_ITEM_ICON_CLASSNAME =
  "shrink-0 transition-colors duration-150 group-data-[collapsible=icon]:mx-auto";

// ── Label de navigation ───────────────────────────────────────────────────
export const ADMIN_SIDEBAR_ITEM_LABEL_CLASSNAME =
  "truncate group-data-[collapsible=icon]:hidden";

// ── Trigger de groupe ─────────────────────────────────────────────────────
// Sobre : label discret (muted/80), pas de bg agressif sur open
export const ADMIN_SIDEBAR_GROUP_TRIGGER_CLASSNAME = [
  "flex w-full items-center gap-2",
  "rounded-r-xl rounded-l-sm border-l-2 border-transparent",
  "px-2.5 py-1.5",
  "text-[10px] font-semibold uppercase tracking-[0.14em]",
  "text-text-muted-soft/90",
  "transition-colors duration-150",
  "hover:bg-sidebar-accent/40 hover:text-text-muted-strong",
  "data-[state=open]:text-sidebar-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
].join(" ");

// ── Contenu groupe (accordion) ────────────────────────────────────────────
export const ADMIN_SIDEBAR_GROUP_CONTENT_CLASSNAME =
  "ml-1.5 overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up";

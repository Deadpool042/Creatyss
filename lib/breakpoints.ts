/**
 * Canonical TS breakpoint constants.
 * Keep in sync with app/styles/theme.css @theme inline breakpoints.
 *
 * --breakpoint-tablet:  48rem  (768px)
 * --breakpoint-laptop:  64rem  (1024px)
 * --breakpoint-desktop: 75rem  (1200px)
 * --breakpoint-wide:    90rem  (1440px)
 */
export const BREAKPOINTS = {
  tablet: 768,
  laptop: 1024,
  desktop: 1200,
  wide: 1440,
} as const;

/**
 * Admin sidebar treats viewports below laptop as mobile.
 * Used by:
 *   - SidebarProvider mobileBreakpoint prop in AdminShell
 *   - useIsAdminMobile hook
 */
export const ADMIN_SIDEBAR_MOBILE_BREAKPOINT = BREAKPOINTS.laptop;

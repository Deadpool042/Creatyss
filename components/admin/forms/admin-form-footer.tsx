import type { ReactNode } from "react";

import { AdminFormActions } from "./admin-form-actions";
import { cn } from "@/lib/utils";

type AdminFormFooterProps = Readonly<{
  children: ReactNode;
  className?: string;
  actionsClassName?: string;
  overlay?: boolean;
}>;

/**
 * En mode "overlay", flotte au-dessus du contenu plutôt que de rester à plat en fin de flux —
 * en pill pleine largeur au-dessus de la bottom nav sur mobile, en pill compacte ancrée en bas
 * à droite sur desktop (esprit macOS : les actions d'un panneau vivent en bas à droite, jamais
 * en bande coupée à la largeur de la colonne de formulaire).
 * Repose sur `position: fixed`, indépendant de toute chaîne de hauteur bornée. Un spacer en flux
 * garantit que la fin du formulaire n'est jamais masquée par la pill, quel que soit le viewport.
 */
export function AdminFormFooter({
  children,
  className,
  actionsClassName,
  overlay = false,
}: AdminFormFooterProps) {
  const footer = (
    <div
      className={cn(
        overlay
          ? [
              "site-header-blur fixed z-30 rounded-2xl border border-shell-border-strong shadow-lg",
              "inset-x-3 px-4 py-2.5",
              "bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.5rem)]",
              "[@media(max-height:480px)]:bottom-[calc(2.75rem+env(safe-area-inset-bottom)+0.4rem)]",
              "lg:inset-x-auto lg:right-6 lg:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] lg:w-auto lg:px-4 lg:py-2.5",
            ].join(" ")
          : [
              "site-header-blur w-full shrink-0",
              "border-t border-shell-border shadow-card",
              "px-4 pt-2 pb-1.5 md:px-6 md:pt-2.5 md:pb-2",
              "[@media(max-height:480px)]:py-1",
            ].join(" "),
        className
      )}
    >
      <div className="flex w-full items-center">
        <AdminFormActions
          className={cn("flex w-full items-center justify-between gap-3", actionsClassName)}
        >
          {children}
        </AdminFormActions>
      </div>
    </div>
  );

  if (!overlay) {
    return footer;
  }

  return (
    <>
      {/* Dégagement en flux : la pill fixe ne doit jamais recouvrir la fin du formulaire. */}
      <div aria-hidden className="h-16 shrink-0 lg:h-20" />
      {footer}
    </>
  );
}

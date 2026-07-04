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
 * en pill sur mobile (même esprit que la barre de bulk actions mobile des listes), en bande
 * pleine largeur classique sur desktop (assez d'espace pour ne pas avoir besoin de flotter).
 * Repose sur `position: fixed`, indépendant de toute chaîne de hauteur bornée — contrairement à
 * l'ancien `position: absolute` qui exigeait un ancêtre positionné et borné en hauteur, absent
 * des pages produit (scrollBehavior="page", scroll de page naturel, pas de conteneur borné).
 */
export function AdminFormFooter({
  children,
  className,
  actionsClassName,
  overlay = false,
}: AdminFormFooterProps) {
  return (
    <div
      className={cn(
        overlay
          ? [
              "site-header-blur fixed inset-x-3 z-30 rounded-2xl border border-shell-border-strong px-4 py-2.5 shadow-lg",
              "bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.5rem)]",
              "[@media(max-height:480px)]:bottom-[calc(2.75rem+env(safe-area-inset-bottom)+0.4rem)]",
              "lg:sticky lg:inset-x-auto lg:bottom-0 lg:z-auto lg:w-full lg:rounded-none",
              "lg:border-x-0 lg:border-b-0 lg:border-t lg:border-shell-border lg:px-6 lg:py-2.5 lg:shadow-card",
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
}

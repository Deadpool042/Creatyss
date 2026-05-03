"use client";

import { Heart } from "lucide-react";

import { useFavorites } from "@/features/storefront/favorites/hooks/use-favorites";

type FavoriteButtonProps = {
  productId: string;
  initialFavoriteProductIds: readonly string[];
  className?: string;
};

export function FavoriteButton({
  productId,
  initialFavoriteProductIds,
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, pendingProductId } = useFavorites(
    initialFavoriteProductIds as string[]
  );

  const isFavoriteNow = isFavorite(productId);
  const isThisPending = pendingProductId === productId;

  const baseClasses =
    "relative inline-flex items-center justify-center rounded-full p-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const activeClasses = "text-brand bg-surface-panel/90 border border-brand/30";
  const inactiveClasses =
    "text-text-muted-strong/80 hover:text-foreground bg-surface-panel/60 hover:bg-surface-panel/90 backdrop-blur-sm border border-surface-border-subtle/60";
  const pendingClasses = "opacity-50 cursor-wait";

  const stateClasses = isFavoriteNow ? activeClasses : inactiveClasses;
  const combinedClasses = [
    baseClasses,
    stateClasses,
    isThisPending ? pendingClasses : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={combinedClasses}
      aria-pressed={isFavoriteNow}
      aria-label={isFavoriteNow ? "Retirer des favoris" : "Ajouter aux favoris"}
      disabled={isThisPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(productId);
      }}
    >
      <Heart
        className={isFavoriteNow ? "h-4 w-4 fill-current" : "h-4 w-4"}
      />
    </button>
  );
}

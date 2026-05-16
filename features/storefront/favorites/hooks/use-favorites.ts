"use client";

import { useState, useTransition } from "react";

import { toggleFavoriteAction } from "@/features/storefront/favorites/actions/toggle-favorite.action";

export function useFavorites(initialProductIds: string[]) {
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>(initialProductIds);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function isFavorite(productId: string): boolean {
    return favoriteProductIds.includes(productId);
  }

  function toggleFavorite(productId: string): void {
    const previousIds = favoriteProductIds;

    const alreadyFavorite = favoriteProductIds.includes(productId);
    const optimisticIds = alreadyFavorite
      ? favoriteProductIds.filter((id) => id !== productId)
      : [productId, ...favoriteProductIds].slice(0, 50);
    setFavoriteProductIds(optimisticIds);
    setPendingProductId(productId);

    startTransition(async () => {
      try {
        const result = await toggleFavoriteAction(productId);
        setFavoriteProductIds(result.productIds);
      } catch {
        setFavoriteProductIds(previousIds);
      } finally {
        setPendingProductId(null);
      }
    });
  }

  return {
    favoriteProductIds,
    isFavorite,
    toggleFavorite,
    pendingProductId,
  };
}

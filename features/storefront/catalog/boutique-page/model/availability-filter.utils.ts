import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

/**
 * Parse un paramètre URL `availability` brut vers la valeur métier normalisée.
 * Gère les alias historiques ("available" → "in-stock").
 */
export function normalizeAvailabilityParam(
  value: string | null
): "" | BoutiquePageViewModel["availabilityOptions"][number]["id"] {
  if (value === null) {
    return "";
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "available" || normalized === "in-stock") {
    return "in-stock";
  }

  if (normalized === "made-to-order") {
    return "made-to-order";
  }

  if (normalized === "unavailable") {
    return "unavailable";
  }

  return "";
}

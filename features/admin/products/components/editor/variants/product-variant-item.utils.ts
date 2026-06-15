import type { ComponentProps } from "react";

import type { Badge } from "@/components/ui/badge";
import type { AdminProductVariantListItem } from "@/features/admin/products/editor/types";

export function getStatusLabel(status: AdminProductVariantListItem["status"]): string {
  switch (status) {
    case "draft":
      return "Brouillon";
    case "active":
      return "Actif";
    case "inactive":
      return "Inactif";
    case "archived":
      return "Archivé";
  }
}

export type BadgeDescriptor = {
  label: string;
  variant: ComponentProps<typeof Badge>["variant"];
};

export function getAvailabilityBadge(
  availability: AdminProductVariantListItem["availability"]
): BadgeDescriptor {
  if (!availability.isSellable) {
    return { label: "Indisponible", variant: "outline" };
  }

  switch (availability.status) {
    case "available":
      return { label: "Disponible", variant: "secondary" };
    case "preorder":
      return { label: "Précommande", variant: "secondary" };
    case "backorder":
      return { label: "Sur commande", variant: "secondary" };
    case "discontinued":
      return { label: "Arrêté", variant: "outline" };
    case "archived":
      return { label: "Archivé", variant: "outline" };
    case "unavailable":
    default:
      return { label: "Indisponible", variant: "outline" };
  }
}

const DEFAULT_LOW_STOCK_THRESHOLD = 2;

export function getStockBadge(inventory: AdminProductVariantListItem["inventory"]): BadgeDescriptor {
  if (!inventory.hasInventoryRecord) {
    return { label: "Stock non suivi", variant: "outline" };
  }

  const availableQuantity = Math.max(0, inventory.availableQuantity);
  if (availableQuantity <= 0) {
    return { label: "Rupture", variant: "destructive" };
  }

  const lowStockThreshold = inventory.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD;
  if (availableQuantity <= lowStockThreshold) {
    return { label: `Stock faible · ${availableQuantity}`, variant: "outline" };
  }

  return { label: `Stock · ${availableQuantity}`, variant: "outline" };
}

export function getStatusVariant(status: AdminProductVariantListItem["status"]) {
  switch (status) {
    case "active":
      return "secondary" as const;
    case "draft":
      return "outline" as const;
    case "inactive":
      return "outline" as const;
    case "archived":
      return "outline" as const;
  }
}

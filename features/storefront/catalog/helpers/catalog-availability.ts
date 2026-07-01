import type { AvailabilityStatus } from "@/prisma-generated/client";

export type CatalogStorefrontAvailabilityStatus = "in-stock" | "made-to-order" | "unavailable";

export type InventoryCarrier = {
  inventoryItems: Array<{
    onHandQuantity: number;
    reservedQuantity: number;
  }>;
};

export type AvailabilityRecordCarrier = {
  availabilityRecords?: Array<{
    status: AvailabilityStatus;
    isSellable: boolean;
  }>;
};

export type VariantAvailabilityCarrier = InventoryCarrier & AvailabilityRecordCarrier;

function getCatalogAvailabilityStatusFromInventory(
  variant: InventoryCarrier
): CatalogStorefrontAvailabilityStatus {
  return variant.inventoryItems.some((item) => item.onHandQuantity - item.reservedQuantity > 0)
    ? "in-stock"
    : "unavailable";
}

function mapAvailabilityRecordStatus(
  status: AvailabilityStatus,
  hasPhysicalStock: boolean
): CatalogStorefrontAvailabilityStatus {
  if (status === "AVAILABLE") {
    return hasPhysicalStock ? "in-stock" : "unavailable";
  }

  if (status === "PREORDER" || status === "BACKORDER") {
    return "made-to-order";
  }

  return "unavailable";
}

export function getCatalogVariantAvailabilityStatus(
  variant: VariantAvailabilityCarrier
): CatalogStorefrontAvailabilityStatus {
  const availabilityRecords = variant.availabilityRecords ?? [];

  if (availabilityRecords.length === 0) {
    return getCatalogAvailabilityStatusFromInventory(variant);
  }

  const hasPhysicalStock = variant.inventoryItems.some(
    (item) => item.onHandQuantity - item.reservedQuantity > 0
  );

  const sellableRecord = availabilityRecords.find(
    (record) =>
      record.isSellable &&
      (record.status === "AVAILABLE" ||
        record.status === "PREORDER" ||
        record.status === "BACKORDER")
  );

  if (sellableRecord) {
    return mapAvailabilityRecordStatus(sellableRecord.status, hasPhysicalStock);
  }

  const mappedStatuses = availabilityRecords.map((record) =>
    mapAvailabilityRecordStatus(record.status, hasPhysicalStock)
  );

  if (mappedStatuses.includes("in-stock")) {
    return "in-stock";
  }

  if (mappedStatuses.includes("made-to-order")) {
    return "made-to-order";
  }

  return "unavailable";
}

export function getCatalogVariantAvailability(variant: VariantAvailabilityCarrier): boolean {
  const availabilityStatus = getCatalogVariantAvailabilityStatus(variant);

  return availabilityStatus === "in-stock" || availabilityStatus === "made-to-order";
}

export function getCatalogProductAvailabilityStatus(
  variants: VariantAvailabilityCarrier[]
): CatalogStorefrontAvailabilityStatus {
  const statuses = variants.map((variant) => getCatalogVariantAvailabilityStatus(variant));

  if (statuses.includes("in-stock")) {
    return "in-stock";
  }

  if (statuses.includes("made-to-order")) {
    return "made-to-order";
  }

  return "unavailable";
}

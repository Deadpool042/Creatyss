export type InventoryCarrier = {
  inventoryItems: Array<{
    onHandQuantity: number;
    reservedQuantity: number;
  }>;
};

export function getCatalogVariantAvailability(variant: InventoryCarrier): boolean {
  return variant.inventoryItems.some(
    (item) => item.onHandQuantity - item.reservedQuantity > 0
  );
}

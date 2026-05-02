-- AlterTable
ALTER TABLE "products" ADD COLUMN     "catalogPriceCents" INTEGER,
ADD COLUMN     "catalogPriceCurrencyCode" "CurrencyCode",
ADD COLUMN     "catalogPriceSource" "PriceTargetType";

-- CreateIndex
CREATE INDEX "products_catalogPriceCents_idx" ON "products"("catalogPriceCents");

-- CreateIndex
CREATE INDEX "products_status_archivedAt_catalogPriceCents_idx" ON "products"("status", "archivedAt", "catalogPriceCents");

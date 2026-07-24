-- AlterEnum
ALTER TYPE "MarketingIntentSubjectType" ADD VALUE 'PUBLIC_EVENT';
ALTER TYPE "MarketingIntentSubjectType" ADD VALUE 'PRODUCT';

-- AlterEnum
ALTER TYPE "MarketingIntentType" ADD VALUE 'PROMOTE_COMMERCE_EVENT';
ALTER TYPE "MarketingIntentType" ADD VALUE 'PROMOTE_PRODUCT';

-- AlterTable
ALTER TABLE "customers"
  ADD COLUMN "sourceId" TEXT,
  ADD COLUMN "sourceSystem" TEXT;

-- AlterTable
ALTER TABLE "orders"
  ADD COLUMN "sourceId" TEXT,
  ADD COLUMN "sourceSystem" TEXT;

-- AlterTable
ALTER TABLE "public_events"
  ADD COLUMN "hasSpecialConditions" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "specialConditionsNote" TEXT;

-- AlterTable
ALTER TABLE "stores"
  ADD COLUMN "logoImageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "customers_storeId_sourceSystem_sourceId_key"
  ON "customers"("storeId", "sourceSystem", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_storeId_sourceSystem_sourceId_key"
  ON "orders"("storeId", "sourceSystem", "sourceId");

-- AddForeignKey
ALTER TABLE "stores"
  ADD CONSTRAINT "stores_logoImageId_fkey"
  FOREIGN KEY ("logoImageId")
  REFERENCES "media_assets"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;

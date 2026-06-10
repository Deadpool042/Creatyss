-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "bankTransferEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "bankTransferInstructions" TEXT,
ADD COLUMN     "cashOnDeliveryEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cashOnDeliveryInstructions" TEXT;

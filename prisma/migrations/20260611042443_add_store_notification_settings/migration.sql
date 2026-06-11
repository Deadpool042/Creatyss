-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "emailConfirmationEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailShippingEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "replyToEmail" TEXT;

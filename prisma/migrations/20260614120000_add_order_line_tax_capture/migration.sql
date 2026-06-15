-- Capture de la TVA par ligne de commande (cadrage commerce.taxation, D4).
ALTER TABLE "order_lines" ADD COLUMN "taxRatePercent" DECIMAL(7,4);
ALTER TABLE "order_lines" ADD COLUMN "taxTerritory" TEXT;

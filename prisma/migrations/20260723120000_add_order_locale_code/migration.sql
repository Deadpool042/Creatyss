-- Capture de la locale client sur la commande (H4, lot-multilangue-generalise).
-- Nullable : la resolution order.localeCode ?? store.defaultLocaleCode se fait au niveau applicatif.
ALTER TABLE "orders" ADD COLUMN "localeCode" TEXT;

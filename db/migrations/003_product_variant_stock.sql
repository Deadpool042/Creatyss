BEGIN;

ALTER TABLE product_variants
ADD COLUMN stock_quantity integer NOT NULL DEFAULT 0;

ALTER TABLE product_variants
ADD CONSTRAINT product_variants_stock_quantity_check
CHECK (stock_quantity >= 0);

COMMIT;

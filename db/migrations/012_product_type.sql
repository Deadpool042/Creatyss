BEGIN;

ALTER TABLE products
ADD COLUMN product_type text NOT NULL DEFAULT 'variable';

ALTER TABLE products
ADD CONSTRAINT products_product_type_check
CHECK (product_type in ('simple', 'variable'));

COMMIT;

BEGIN;

ALTER TABLE products
ADD COLUMN simple_sku text,
ADD COLUMN simple_price numeric(12,2),
ADD COLUMN simple_compare_at_price numeric(12,2),
ADD COLUMN simple_stock_quantity integer;

ALTER TABLE products
ADD CONSTRAINT products_simple_price_non_negative
CHECK (simple_price IS NULL OR simple_price >= 0),
ADD CONSTRAINT products_simple_compare_at_price_non_negative
CHECK (simple_compare_at_price IS NULL OR simple_compare_at_price >= 0),
ADD CONSTRAINT products_simple_compare_at_price_gte_price
CHECK (
  simple_compare_at_price IS NULL
  OR simple_price IS NULL
  OR simple_compare_at_price >= simple_price
),
ADD CONSTRAINT products_simple_stock_quantity_non_negative
CHECK (simple_stock_quantity IS NULL OR simple_stock_quantity >= 0);

UPDATE products p
SET
  simple_sku = pv.sku,
  simple_price = pv.price,
  simple_compare_at_price = pv.compare_at_price,
  simple_stock_quantity = pv.stock_quantity
FROM product_variants pv
WHERE p.product_type = 'simple'
  AND pv.id = (
    SELECT pv2.id
    FROM product_variants pv2
    WHERE pv2.product_id = p.id
    ORDER BY pv2.is_default DESC, pv2.id ASC
    LIMIT 1
  );

COMMIT;

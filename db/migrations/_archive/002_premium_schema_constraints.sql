BEGIN;

-- ============================================================
-- 016_premium_schema_constraints.sql
--
-- PostgreSQL advanced constraints and partial unique indexes
-- that are not expressed directly in prisma/schema.prisma.
-- Intended to run after 015_premium_schema_core.sql.
-- ============================================================
-- ------------------------------------------------------------
-- Product image constraints
-- ------------------------------------------------------------
CREATE UNIQUE INDEX product_images_primary_per_product_unique ON product_images (product_id)
WHERE
  is_primary = TRUE;

CREATE UNIQUE INDEX product_variant_images_primary_per_variant_unique ON product_variant_images (product_variant_id)
WHERE
  is_primary = TRUE;

CREATE UNIQUE INDEX product_variants_default_per_product_unique ON product_variants (product_id)
WHERE
  is_default = TRUE;

-- ------------------------------------------------------------
-- Quantity constraints
-- ------------------------------------------------------------
ALTER TABLE guest_cart_lines ADD CONSTRAINT guest_cart_lines_quantity_positive CHECK (quantity > 0);

ALTER TABLE order_lines ADD CONSTRAINT order_lines_quantity_positive CHECK (quantity > 0);

ALTER TABLE shipment_lines ADD CONSTRAINT shipment_lines_quantity_positive CHECK (quantity > 0);

ALTER TABLE refund_lines ADD CONSTRAINT refund_lines_quantity_positive CHECK (
  quantity IS NULL
  OR quantity > 0
);

ALTER TABLE products ADD CONSTRAINT products_simple_stock_quantity_non_negative CHECK (
  simple_stock_quantity IS NULL
  OR simple_stock_quantity >= 0
);

ALTER TABLE product_variants ADD CONSTRAINT product_variants_stock_quantity_non_negative CHECK (
  stock_quantity IS NULL
  OR stock_quantity >= 0
);

ALTER TABLE products ADD CONSTRAINT products_simple_price_cents_non_negative CHECK (
  simple_price_cents IS NULL
  OR simple_price_cents >= 0
);

ALTER TABLE products ADD CONSTRAINT products_simple_compare_at_cents_non_negative CHECK (
  simple_compare_at_cents IS NULL
  OR simple_compare_at_cents >= 0
);

ALTER TABLE product_variants ADD CONSTRAINT product_variants_price_cents_non_negative CHECK (
  price_cents IS NULL
  OR price_cents >= 0
);

ALTER TABLE product_variants ADD CONSTRAINT product_variants_compare_at_cents_non_negative CHECK (
  compare_at_cents IS NULL
  OR compare_at_cents >= 0
);

ALTER TABLE categories ADD CONSTRAINT categories_display_order_non_negative CHECK (display_order >= 0);

ALTER TABLE product_variants ADD CONSTRAINT product_variants_sort_order_non_negative CHECK (sort_order >= 0);

ALTER TABLE product_images ADD CONSTRAINT product_images_sort_order_non_negative CHECK (sort_order >= 0);

ALTER TABLE product_variant_images ADD CONSTRAINT product_variant_images_sort_order_non_negative CHECK (sort_order >= 0);

-- ------------------------------------------------------------
-- Monetary constraints
-- ------------------------------------------------------------
ALTER TABLE orders ADD CONSTRAINT orders_subtotal_cents_non_negative CHECK (subtotal_cents >= 0);

ALTER TABLE orders ADD CONSTRAINT orders_shipping_cents_non_negative CHECK (shipping_cents >= 0);

ALTER TABLE orders ADD CONSTRAINT orders_total_cents_non_negative CHECK (total_cents >= 0);

ALTER TABLE order_lines ADD CONSTRAINT order_lines_unit_price_cents_non_negative CHECK (unit_price_cents >= 0);

ALTER TABLE order_lines ADD CONSTRAINT order_lines_subtotal_cents_non_negative CHECK (line_subtotal_cents >= 0);

ALTER TABLE order_lines ADD CONSTRAINT order_lines_total_cents_non_negative CHECK (line_total_cents >= 0);

ALTER TABLE payments ADD CONSTRAINT payments_amount_cents_positive CHECK (amount_cents > 0);

ALTER TABLE refunds ADD CONSTRAINT refunds_amount_cents_positive CHECK (amount_cents > 0);

ALTER TABLE refund_lines ADD CONSTRAINT refund_lines_amount_cents_positive CHECK (amount_cents > 0);

COMMIT;

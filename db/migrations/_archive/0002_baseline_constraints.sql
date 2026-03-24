BEGIN;

-- ============================================================
-- 0002_baseline_constraints.sql
--
-- Contraintes SQL complementaires de la baseline active.
-- Ce fichier ne recopie pas l'historique legacy. Il ne garde
-- que des invariants encore coherents avec le schema Prisma
-- courant et utiles au niveau PostgreSQL.
-- ============================================================

-- ------------------------------------------------------------
-- Partial unique indexes
-- ------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS product_media_primary_per_product_unique
  ON product_media (product_id)
  WHERE is_primary = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS product_variant_media_primary_per_variant_unique
  ON product_variant_media (variant_id)
  WHERE is_primary = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS product_categories_primary_per_product_unique
  ON product_categories (product_id)
  WHERE is_primary = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS shipping_methods_default_per_store_unique
  ON shipping_methods (store_id)
  WHERE is_default = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS blog_post_categories_primary_per_post_unique
  ON blog_post_categories (post_id)
  WHERE is_primary = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS template_variants_default_per_definition_unique
  ON template_variants (template_definition_id)
  WHERE is_default = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS locale_definitions_default_per_store_unique
  ON locale_definitions (store_id)
  WHERE is_default = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_lists_default_per_store_unique
  ON newsletter_lists (store_id)
  WHERE is_default = TRUE;

-- ------------------------------------------------------------
-- Quantity checks
-- ------------------------------------------------------------
ALTER TABLE cart_lines ADD CONSTRAINT cart_lines_quantity_positive CHECK (quantity > 0);

ALTER TABLE bundle_items ADD CONSTRAINT bundle_items_quantity_positive CHECK (quantity > 0);

ALTER TABLE fulfillment_lines ADD CONSTRAINT fulfillment_lines_quantity_positive CHECK (quantity > 0);

ALTER TABLE return_lines ADD CONSTRAINT return_lines_quantity_positive CHECK (quantity > 0);

ALTER TABLE order_lines ADD CONSTRAINT order_lines_quantity_positive CHECK (quantity > 0);

-- ------------------------------------------------------------
-- Monetary checks
-- ------------------------------------------------------------
ALTER TABLE gift_cards ADD CONSTRAINT gift_cards_amounts_non_negative CHECK (
  initial_amount >= 0
  AND balance_amount >= 0
);

ALTER TABLE product_prices ADD CONSTRAINT product_prices_amounts_valid CHECK (
  amount >= 0
  AND (compare_at_amount IS NULL OR compare_at_amount >= 0)
);

ALTER TABLE product_variant_prices ADD CONSTRAINT product_variant_prices_amounts_valid CHECK (
  amount >= 0
  AND (compare_at_amount IS NULL OR compare_at_amount >= 0)
);

ALTER TABLE shipping_rates ADD CONSTRAINT shipping_rates_amounts_non_negative CHECK (
  price_amount >= 0
  AND (min_subtotal_amount IS NULL OR min_subtotal_amount >= 0)
  AND (max_subtotal_amount IS NULL OR max_subtotal_amount >= 0)
);

ALTER TABLE order_shipping_selections ADD CONSTRAINT order_shipping_selections_price_amount_non_negative CHECK (
  price_amount >= 0
);

ALTER TABLE checkouts ADD CONSTRAINT checkouts_amounts_non_negative CHECK (
  (shipping_price_amount IS NULL OR shipping_price_amount >= 0)
  AND subtotal_amount >= 0
  AND discount_amount >= 0
  AND tax_amount >= 0
  AND total_amount >= 0
);

ALTER TABLE orders ADD CONSTRAINT orders_amounts_non_negative CHECK (
  subtotal_amount >= 0
  AND discount_amount >= 0
  AND shipping_amount >= 0
  AND tax_amount >= 0
  AND total_amount >= 0
);

ALTER TABLE order_lines ADD CONSTRAINT order_lines_amounts_non_negative CHECK (
  unit_price_amount >= 0
  AND line_subtotal_amount >= 0
  AND line_discount_amount >= 0
  AND line_tax_amount >= 0
  AND line_total_amount >= 0
);

ALTER TABLE payments ADD CONSTRAINT payments_amount_positive CHECK (amount > 0);

ALTER TABLE payment_refunds ADD CONSTRAINT payment_refunds_amount_positive CHECK (amount > 0);

COMMIT;

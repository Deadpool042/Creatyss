BEGIN;

CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reference text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  customer_email text NOT NULL,
  customer_first_name text NOT NULL,
  customer_last_name text NOT NULL,
  customer_phone text,
  shipping_address_line_1 text NOT NULL,
  shipping_address_line_2 text,
  shipping_postal_code text NOT NULL,
  shipping_city text NOT NULL,
  shipping_country_code text NOT NULL,
  billing_same_as_shipping boolean NOT NULL DEFAULT true,
  billing_first_name text,
  billing_last_name text,
  billing_phone text,
  billing_address_line_1 text,
  billing_address_line_2 text,
  billing_postal_code text,
  billing_city text,
  billing_country_code text,
  total_amount numeric(10, 2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT orders_status_check
    CHECK (status IN ('pending', 'cancelled')),
  CONSTRAINT orders_total_amount_check
    CHECK (total_amount >= 0),
  CONSTRAINT orders_shipping_country_code_check
    CHECK (shipping_country_code = 'FR'),
  CONSTRAINT orders_billing_country_code_check
    CHECK (billing_country_code IS NULL OR billing_country_code = 'FR')
);

CREATE TABLE order_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id bigint NOT NULL,
  source_product_variant_id bigint,
  product_name text NOT NULL,
  variant_name text NOT NULL,
  color_name text NOT NULL,
  color_hex text,
  sku text NOT NULL,
  unit_price numeric(10, 2) NOT NULL,
  quantity integer NOT NULL,
  line_total numeric(10, 2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT order_items_order_id_fkey
    FOREIGN KEY (order_id)
    REFERENCES orders (id)
    ON DELETE CASCADE,
  CONSTRAINT order_items_source_product_variant_id_fkey
    FOREIGN KEY (source_product_variant_id)
    REFERENCES product_variants (id)
    ON DELETE SET NULL,
  CONSTRAINT order_items_quantity_check
    CHECK (quantity >= 1),
  CONSTRAINT order_items_unit_price_check
    CHECK (unit_price >= 0),
  CONSTRAINT order_items_line_total_check
    CHECK (line_total >= 0)
);

CREATE INDEX order_items_order_id_idx
  ON order_items (order_id);

CREATE TRIGGER orders_set_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;

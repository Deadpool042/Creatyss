BEGIN;

CREATE TABLE carts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  token text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cart_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cart_id bigint NOT NULL,
  product_variant_id bigint NOT NULL,
  quantity integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT cart_items_cart_id_fkey
    FOREIGN KEY (cart_id)
    REFERENCES carts (id)
    ON DELETE CASCADE,
  CONSTRAINT cart_items_product_variant_id_fkey
    FOREIGN KEY (product_variant_id)
    REFERENCES product_variants (id)
    ON DELETE CASCADE,
  CONSTRAINT cart_items_quantity_check
    CHECK (quantity >= 1),
  CONSTRAINT cart_items_cart_id_product_variant_id_key
    UNIQUE (cart_id, product_variant_id)
);

CREATE INDEX cart_items_product_variant_id_idx
  ON cart_items (product_variant_id);

CREATE TRIGGER carts_set_updated_at
BEFORE UPDATE ON carts
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER cart_items_set_updated_at
BEFORE UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;

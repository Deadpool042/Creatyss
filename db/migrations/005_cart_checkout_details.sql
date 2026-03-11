BEGIN;

CREATE TABLE cart_checkout_details (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cart_id bigint NOT NULL UNIQUE,
  customer_email text,
  customer_first_name text,
  customer_last_name text,
  customer_phone text,
  shipping_address_line_1 text,
  shipping_address_line_2 text,
  shipping_postal_code text,
  shipping_city text,
  shipping_country_code text,
  billing_same_as_shipping boolean NOT NULL DEFAULT true,
  billing_first_name text,
  billing_last_name text,
  billing_phone text,
  billing_address_line_1 text,
  billing_address_line_2 text,
  billing_postal_code text,
  billing_city text,
  billing_country_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT cart_checkout_details_cart_id_fkey
    FOREIGN KEY (cart_id)
    REFERENCES carts (id)
    ON DELETE CASCADE,
  CONSTRAINT cart_checkout_details_shipping_country_code_check
    CHECK (shipping_country_code IS NULL OR shipping_country_code = 'FR'),
  CONSTRAINT cart_checkout_details_billing_country_code_check
    CHECK (billing_country_code IS NULL OR billing_country_code = 'FR')
);

CREATE TRIGGER cart_checkout_details_set_updated_at
BEFORE UPDATE ON cart_checkout_details
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;

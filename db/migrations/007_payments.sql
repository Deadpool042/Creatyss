BEGIN;

ALTER TABLE orders
  DROP CONSTRAINT orders_status_check;

ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'paid', 'cancelled'));

CREATE TABLE payments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id bigint NOT NULL UNIQUE,
  provider text NOT NULL,
  method text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  amount numeric(10, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'eur',
  stripe_checkout_session_id text UNIQUE,
  stripe_payment_intent_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT payments_order_id_fkey
    FOREIGN KEY (order_id)
    REFERENCES orders (id)
    ON DELETE CASCADE,
  CONSTRAINT payments_provider_check
    CHECK (provider = 'stripe'),
  CONSTRAINT payments_method_check
    CHECK (method = 'card'),
  CONSTRAINT payments_status_check
    CHECK (status IN ('pending', 'succeeded', 'failed')),
  CONSTRAINT payments_amount_check
    CHECK (amount >= 0),
  CONSTRAINT payments_currency_check
    CHECK (currency = 'eur')
);

CREATE INDEX payments_status_idx
  ON payments (status);

CREATE TRIGGER payments_set_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

INSERT INTO payments (
  order_id,
  provider,
  method,
  status,
  amount,
  currency
)
SELECT
  o.id,
  'stripe',
  'card',
  'pending',
  o.total_amount,
  'eur'
FROM orders o
WHERE NOT EXISTS (
  SELECT 1
  FROM payments p
  WHERE p.order_id = o.id
);

COMMIT;

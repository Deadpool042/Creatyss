BEGIN;

ALTER TABLE orders
  ADD COLUMN shipped_at timestamptz,
  ADD COLUMN tracking_reference text;

ALTER TABLE orders
  DROP CONSTRAINT orders_status_check;

ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'paid', 'preparing', 'shipped', 'cancelled'));

COMMIT;

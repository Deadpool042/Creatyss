BEGIN;

CREATE TABLE order_email_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id bigint NOT NULL,
  event_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  recipient_email text NOT NULL,
  provider text NOT NULL,
  provider_message_id text,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT order_email_events_order_id_fkey
    FOREIGN KEY (order_id)
    REFERENCES orders (id)
    ON DELETE CASCADE,
  CONSTRAINT order_email_events_order_event_key
    UNIQUE (order_id, event_type),
  CONSTRAINT order_email_events_event_type_check
    CHECK (event_type IN ('order_created', 'payment_succeeded', 'order_shipped')),
  CONSTRAINT order_email_events_status_check
    CHECK (status IN ('pending', 'sent', 'failed')),
  CONSTRAINT order_email_events_provider_check
    CHECK (provider = 'resend')
);

CREATE INDEX order_email_events_order_id_idx
  ON order_email_events (order_id);

CREATE TRIGGER order_email_events_set_updated_at
BEFORE UPDATE ON order_email_events
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;

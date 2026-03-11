BEGIN;

ALTER TABLE order_email_events
  DROP CONSTRAINT order_email_events_provider_check;

ALTER TABLE order_email_events
  ADD CONSTRAINT order_email_events_provider_check
  CHECK (provider IN ('resend', 'brevo'));

COMMIT;

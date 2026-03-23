BEGIN;

-- ============================================================
-- 003_lot1_additive.sql
--
-- Migration additive du Lot 1 Prisma.
-- Aucune table, colonne, contrainte ou index existant n'est
-- supprimé ou modifié.
--
-- Périmètre :
--   A. checkouts         — ajout de completion_idempotency_key + index composé partial
--   B. orders            — ajout de checkout_id + FK vers checkouts + index unique partial
--   C. coupon_redemptions — création de table
--   D. payment_refund_status — création de l'enum PostgreSQL
--   E. payment_refunds   — création de table
--
-- Hors périmètre :
--   - redeemedCount sur coupons (inchangé)
--   - refundedAt sur payments (inchangé)
--   - backfill de coupon_redemptions ou payment_refunds
--   - toute autre table, colonne, contrainte ou index
-- ============================================================

-- ------------------------------------------------------------
-- A. Table checkouts
--    Ajout de la colonne completion_idempotency_key (nullable)
--    et d'un index unique partiel composé (store_id, completion_idempotency_key)
--    sur les lignes où completion_idempotency_key IS NOT NULL.
--
--    Conforme au modèle Prisma :
--      completionIdempotencyKey String?
--      @@unique([storeId, completionIdempotencyKey])
-- ------------------------------------------------------------
ALTER TABLE checkouts
  ADD COLUMN IF NOT EXISTS completion_idempotency_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS checkouts_store_id_completion_idempotency_key_unique
  ON checkouts (store_id, completion_idempotency_key)
  WHERE completion_idempotency_key IS NOT NULL;

-- ------------------------------------------------------------
-- B. Table orders
--    Ajout de la colonne checkout_id (nullable), d'un index
--    unique partiel et d'une FK vers checkouts(id).
--
--    Conforme au modèle Prisma :
--      checkoutId String? @unique
--      checkout Checkout? @relation(..., onDelete: Restrict)
-- ------------------------------------------------------------
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS checkout_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS orders_checkout_id_unique
  ON orders (checkout_id)
  WHERE checkout_id IS NOT NULL;

ALTER TABLE orders
  ADD CONSTRAINT orders_checkout_id_fkey
  FOREIGN KEY (checkout_id)
  REFERENCES checkouts (id)
  ON DELETE RESTRICT
  ON UPDATE CASCADE
  NOT VALID;

-- Valider la contrainte sans bloquer les lectures existantes.
-- NOT VALID + VALIDATE permet de ne pas poser de lock exclusif
-- sur toute la table si elle contient déjà des données.
ALTER TABLE orders
  VALIDATE CONSTRAINT orders_checkout_id_fkey;

-- ------------------------------------------------------------
-- C. Table coupon_redemptions
--
--    Conforme au modèle Prisma CouponRedemption :
--      id       String @id @default(cuid())
--      couponId String
--      orderId  String
--      codeSnapshot String
--      redeemedAt   DateTime @default(now())
--      coupon Coupon @relation(..., onDelete: Restrict)
--      order  Order  @relation(..., onDelete: Restrict)
--      @@unique([couponId, orderId])
--      @@index([orderId])
--      @@map("coupon_redemptions")
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id               TEXT        NOT NULL,
  coupon_id        TEXT        NOT NULL,
  order_id         TEXT        NOT NULL,
  code_snapshot    TEXT        NOT NULL,
  redeemed_at      TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),

  CONSTRAINT coupon_redemptions_pkey
    PRIMARY KEY (id),

  CONSTRAINT coupon_redemptions_coupon_id_fkey
    FOREIGN KEY (coupon_id)
    REFERENCES coupons (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT coupon_redemptions_order_id_fkey
    FOREIGN KEY (order_id)
    REFERENCES orders (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT coupon_redemptions_coupon_id_order_id_unique
    UNIQUE (coupon_id, order_id)
);

CREATE INDEX IF NOT EXISTS coupon_redemptions_order_id_idx
  ON coupon_redemptions (order_id);

-- ------------------------------------------------------------
-- D. Enum payment_refund_status
--
--    Conforme à l'enum Prisma PaymentRefundStatus :
--      PENDING | SUCCEEDED | FAILED | CANCELLED
-- ------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'payment_refund_status'
  ) THEN
    CREATE TYPE payment_refund_status AS ENUM (
      'PENDING',
      'SUCCEEDED',
      'FAILED',
      'CANCELLED'
    );
  END IF;
END
$$;

-- ------------------------------------------------------------
-- E. Table payment_refunds
--
--    Conforme au modèle Prisma PaymentRefund :
--      id                      String @id @default(cuid())
--      paymentId               String
--      amount                  Decimal @db.Decimal(12, 2)
--      currencyCode            CurrencyCode
--      status                  PaymentRefundStatus @default(PENDING)
--      reason                  String?
--      idempotencyKey          String
--      providerRefundReference String?
--      succeededAt             DateTime?
--      failedAt                DateTime?
--      cancelledAt             DateTime?
--      failureCode             String?
--      failureMessage          String?
--      createdAt               DateTime @default(now())
--      updatedAt               DateTime @updatedAt
--      payment Payment @relation(..., onDelete: Restrict)
--      @@unique([paymentId, idempotencyKey])
--      @@index([paymentId])
--      @@index([status])
--      @@map("payment_refunds")
--
--    Note: currencyCode est stocké en TEXT pour que cette
--    migration soit indépendante de l'enum CurrencyCode géré
--    par prisma db push. La contrainte métier est portée par
--    la couche applicative et le schéma Prisma.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_refunds (
  id                        TEXT              NOT NULL,
  payment_id                TEXT              NOT NULL,
  amount                    DECIMAL (12, 2)   NOT NULL,
  currency_code             TEXT              NOT NULL,
  status                    payment_refund_status NOT NULL DEFAULT 'PENDING',
  reason                    TEXT,
  idempotency_key           TEXT              NOT NULL,
  provider_refund_reference TEXT,
  succeeded_at              TIMESTAMPTZ (6),
  failed_at                 TIMESTAMPTZ (6),
  cancelled_at              TIMESTAMPTZ (6),
  failure_code              TEXT,
  failure_message           TEXT,
  created_at                TIMESTAMPTZ (6)   NOT NULL DEFAULT NOW (),
  updated_at                TIMESTAMPTZ (6)   NOT NULL DEFAULT NOW (),

  CONSTRAINT payment_refunds_pkey
    PRIMARY KEY (id),

  CONSTRAINT payment_refunds_payment_id_fkey
    FOREIGN KEY (payment_id)
    REFERENCES payments (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT payment_refunds_payment_id_idempotency_key_unique
    UNIQUE (payment_id, idempotency_key)
);

CREATE INDEX IF NOT EXISTS payment_refunds_payment_id_idx
  ON payment_refunds (payment_id);

CREATE INDEX IF NOT EXISTS payment_refunds_status_idx
  ON payment_refunds (status);

COMMIT;

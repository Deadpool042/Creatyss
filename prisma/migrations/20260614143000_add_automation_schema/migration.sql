-- Automations marketing : schéma minimal de définition, sans exécution
-- (cf. docs/lots/2026-06-14-engagement-automations-schema-cadrage.md).

CREATE TYPE "AutomationStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');
CREATE TYPE "AutomationTriggerType" AS ENUM (
  'CART_ABANDONED',
  'ORDER_PLACED',
  'NEWSLETTER_SUBSCRIBED',
  'CUSTOMER_CREATED',
  'MANUAL',
  'OTHER'
);
CREATE TYPE "AutomationActionType" AS ENUM (
  'EMAIL_MESSAGE',
  'NEWSLETTER_CAMPAIGN',
  'NOTIFICATION',
  'WEBHOOK',
  'OTHER'
);

CREATE TABLE "automations" (
  "id" TEXT NOT NULL,
  "storeId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" "AutomationStatus" NOT NULL DEFAULT 'DRAFT',
  "triggerType" "AutomationTriggerType" NOT NULL,
  "actionType" "AutomationActionType" NOT NULL,
  "delayMinutes" INTEGER NOT NULL DEFAULT 0,
  "templateCode" TEXT,
  "configJson" JSONB,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "archivedAt" TIMESTAMP(3),

  CONSTRAINT "automations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "automations_storeId_code_key" ON "automations"("storeId", "code");
CREATE INDEX "automations_storeId_status_idx" ON "automations"("storeId", "status");
CREATE INDEX "automations_triggerType_status_idx" ON "automations"("triggerType", "status");
CREATE INDEX "automations_actionType_status_idx" ON "automations"("actionType", "status");
CREATE INDEX "automations_createdByUserId_idx" ON "automations"("createdByUserId");

ALTER TABLE "automations"
  ADD CONSTRAINT "automations_storeId_fkey"
  FOREIGN KEY ("storeId") REFERENCES "stores"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "automations"
  ADD CONSTRAINT "automations_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

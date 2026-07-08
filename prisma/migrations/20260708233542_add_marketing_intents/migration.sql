-- CreateEnum
CREATE TYPE "MarketingIntentStatus" AS ENUM ('PROPOSED', 'APPROVED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MarketingIntentType" AS ENUM ('PROMOTE_EDITORIAL_CONTENT');

-- CreateEnum
CREATE TYPE "MarketingIntentSubjectType" AS ENUM ('BLOG_POST', 'HOMEPAGE', 'EDITORIAL_PAGE', 'LEGAL_PAGE');

-- CreateEnum
CREATE TYPE "MarketingIntentChannel" AS ENUM ('NEWSLETTER', 'SOCIAL');

-- CreateTable
CREATE TABLE "marketing_intents" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "status" "MarketingIntentStatus" NOT NULL DEFAULT 'PROPOSED',
    "intentType" "MarketingIntentType" NOT NULL,
    "subjectType" "MarketingIntentSubjectType" NOT NULL,
    "subjectId" TEXT NOT NULL,
    "suggestedChannels" "MarketingIntentChannel"[] DEFAULT ARRAY[]::"MarketingIntentChannel"[],
    "deduplicationKey" TEXT NOT NULL,
    "sourceDomainEventId" TEXT,
    "lastSourceDomainEventId" TEXT,
    "contextJson" JSONB,
    "reviewedAt" TIMESTAMP(3),
    "reviewedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketing_intents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "marketing_intents_storeId_status_idx" ON "marketing_intents"("storeId", "status");

-- CreateIndex
CREATE INDEX "marketing_intents_subjectType_subjectId_idx" ON "marketing_intents"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "marketing_intents_sourceDomainEventId_idx" ON "marketing_intents"("sourceDomainEventId");

-- CreateIndex
CREATE INDEX "marketing_intents_lastSourceDomainEventId_idx" ON "marketing_intents"("lastSourceDomainEventId");

-- CreateIndex
CREATE INDEX "marketing_intents_reviewedByUserId_idx" ON "marketing_intents"("reviewedByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "marketing_intents_deduplicationKey_key" ON "marketing_intents"("deduplicationKey");

-- AddForeignKey
ALTER TABLE "marketing_intents" ADD CONSTRAINT "marketing_intents_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_intents" ADD CONSTRAINT "marketing_intents_sourceDomainEventId_fkey" FOREIGN KEY ("sourceDomainEventId") REFERENCES "domain_events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_intents" ADD CONSTRAINT "marketing_intents_lastSourceDomainEventId_fkey" FOREIGN KEY ("lastSourceDomainEventId") REFERENCES "domain_events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_intents" ADD CONSTRAINT "marketing_intents_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'PREORDER', 'BACKORDER', 'DISCONTINUED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AvailabilityPolicyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AvailabilityOverrideType" AS ENUM ('FORCE_AVAILABLE', 'FORCE_UNAVAILABLE', 'FORCE_PREORDER', 'FORCE_BACKORDER');

-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MediaAssetStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MediaAssetKind" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaReferenceSubjectType" AS ENUM ('PRODUCT', 'PRODUCT_VARIANT', 'CATEGORY', 'PAGE', 'BLOG_POST', 'HOMEPAGE', 'HOMEPAGE_SECTION', 'PUBLIC_EVENT', 'EMAIL_TEMPLATE', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaReferenceRole" AS ENUM ('PRIMARY', 'COVER', 'GALLERY', 'THUMBNAIL', 'HERO', 'INLINE', 'ATTACHMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "PriceListStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PriceTargetType" AS ENUM ('PRODUCT', 'PRODUCT_VARIANT');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProductVariantStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RelatedProductType" AS ENUM ('RELATED', 'CROSS_SELL', 'UP_SELL', 'ACCESSORY', 'SIMILAR');

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CONVERTED', 'ABANDONED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CheckoutStatus" AS ENUM ('OPEN', 'READY', 'COMPLETED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CheckoutAddressType" AS ENUM ('BILLING', 'SHIPPING');

-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('LEAD', 'ACTIVE', 'INACTIVE', 'BLOCKED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CustomerAddressType" AS ENUM ('BILLING', 'SHIPPING', 'BOTH');

-- CreateEnum
CREATE TYPE "ContactChannel" AS ENUM ('EMAIL', 'SMS', 'PHONE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OrderAddressType" AS ENUM ('BILLING', 'SHIPPING');

-- CreateEnum
CREATE TYPE "BlogPostStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BlogCategoryStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "HomepageStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "HomepageSectionType" AS ENUM ('HERO', 'RICH_TEXT', 'FEATURED_PRODUCTS', 'FEATURED_CATEGORIES', 'EDITORIAL', 'BLOG_POSTS', 'CTA');

-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PageBlockType" AS ENUM ('RICH_TEXT', 'IMAGE', 'IMAGE_TEXT_SPLIT', 'FEATURED_PRODUCTS', 'FEATURED_CATEGORIES', 'CTA', 'HTML');

-- CreateEnum
CREATE TYPE "SeoStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SeoSubjectType" AS ENUM ('PAGE', 'BLOG_POST', 'BLOG_CATEGORY', 'PRODUCT', 'PRODUCT_VARIANT', 'CATEGORY', 'HOMEPAGE', 'PUBLIC_EVENT');

-- CreateEnum
CREATE TYPE "SeoIndexingMode" AS ENUM ('INDEX_FOLLOW', 'INDEX_NOFOLLOW', 'NOINDEX_FOLLOW', 'NOINDEX_NOFOLLOW');

-- CreateEnum
CREATE TYPE "ApiClientStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'REVOKED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ApiClientSecretStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('STORE');

-- CreateEnum
CREATE TYPE "CredentialType" AS ENUM ('PASSWORD', 'MAGIC_LINK', 'OAUTH', 'API_TOKEN');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "StoreStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "StoreDomainType" AS ENUM ('PRIMARY', 'SECONDARY', 'PREVIEW', 'INTERNAL');

-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM ('EUR', 'USD', 'GBP', 'CHF', 'CAD');

-- CreateEnum
CREATE TYPE "AuditActorType" AS ENUM ('USER', 'API_CLIENT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "AuditLevel" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "DomainEventStatus" AS ENUM ('PENDING', 'PUBLISHED', 'FAILED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FeatureFlagStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FeatureFlagScopeType" AS ENUM ('GLOBAL', 'STORE', 'USER');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "JobPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "MonitoringCheckStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MonitoringCheckResultStatus" AS ENUM ('OK', 'WARNING', 'CRITICAL', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ObservabilitySignalLevel" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ObservabilitySignalStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AiProviderStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AiTaskStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AiTaskType" AS ENUM ('TEXT_GENERATION', 'TEXT_SUMMARIZATION', 'SEO_SUGGESTION', 'PRODUCT_ENRICHMENT', 'CONTENT_ASSIST', 'CLASSIFICATION', 'OTHER');

-- CreateEnum
CREATE TYPE "BundleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DiscountStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING');

-- CreateEnum
CREATE TYPE "DiscountScopeType" AS ENUM ('ORDER', 'PRODUCT', 'PRODUCT_VARIANT', 'CATEGORY');

-- CreateEnum
CREATE TYPE "DiscountCodeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'GENERATED', 'ISSUED', 'SENT', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DocumentTypeCode" AS ENUM ('ORDER_CONFIRMATION', 'INVOICE', 'CREDIT_NOTE', 'DELIVERY_NOTE', 'RECEIPT', 'OTHER');

-- CreateEnum
CREATE TYPE "FulfillmentStatus" AS ENUM ('PENDING', 'READY', 'PARTIALLY_FULFILLED', 'FULFILLED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FulfillmentItemStatus" AS ENUM ('PENDING', 'FULFILLED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "GiftCardStatus" AS ENUM ('DRAFT', 'ACTIVE', 'REDEEMED', 'EXPIRED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "GiftCardTransactionType" AS ENUM ('ISSUE', 'REDEEM', 'REFUND', 'ADJUSTMENT', 'EXPIRATION', 'CANCELLATION');

-- CreateEnum
CREATE TYPE "GiftRequestStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENT', 'CLAIMED', 'CANCELLED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "InventoryItemStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "InventoryReservationStatus" AS ENUM ('ACTIVE', 'RELEASED', 'CONSUMED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InventoryMovementType" AS ENUM ('MANUAL_ADJUSTMENT', 'RECEIPT', 'RESERVATION', 'RELEASE', 'CONSUMPTION', 'RETURN', 'CORRECTION');

-- CreateEnum
CREATE TYPE "LoyaltyAccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'AUTHORIZED', 'CAPTURED', 'PARTIALLY_REFUNDED', 'REFUNDED', 'FAILED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentAttemptStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CARD', 'BANK_TRANSFER', 'WALLET', 'CASH_ON_DELIVERY', 'OTHER');

-- CreateEnum
CREATE TYPE "ReturnRequestStatus" AS ENUM ('REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RECEIVED', 'REFUNDED', 'CLOSED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ReturnItemCondition" AS ENUM ('NEW', 'OPENED', 'USED', 'DAMAGED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ReturnDecisionType" AS ENUM ('APPROVE', 'REJECT', 'PARTIAL_APPROVE');

-- CreateEnum
CREATE TYPE "SalesPolicyStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SellabilityStatus" AS ENUM ('SELLABLE', 'NOT_SELLABLE', 'CONDITIONAL');

-- CreateEnum
CREATE TYPE "SalesPolicyScopeType" AS ENUM ('STORE', 'CATEGORY', 'PRODUCT', 'PRODUCT_VARIANT');

-- CreateEnum
CREATE TYPE "ShippingMethodStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ShippingZoneStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING', 'READY', 'SHIPPED', 'DELIVERED', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SubscriptionItemStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TaxRuleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TaxRuleScopeType" AS ENUM ('STORE', 'CATEGORY', 'PRODUCT', 'PRODUCT_VARIANT');

-- CreateEnum
CREATE TYPE "AnalyticsMetricStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AnalyticsSnapshotStatus" AS ENUM ('PENDING', 'READY', 'FAILED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AttributionModelStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BehaviorSegmentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BehaviorProfileStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ConversionFlowStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ConversionFlowType" AS ENUM ('CART_RECOVERY', 'UPSELL', 'CROSS_SELL', 'THRESHOLD');

-- CreateEnum
CREATE TYPE "CrmContactStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CrmTagStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NewsletterSubscriberStatus" AS ENUM ('PENDING', 'SUBSCRIBED', 'UNSUBSCRIBED', 'BOUNCED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NewsletterCampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'FAILED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PublicEventStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'CANCELLED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EventAudienceStatus" AS ENUM ('OPEN', 'CLOSED', 'WAITLIST');

-- CreateEnum
CREATE TYPE "EventRegistrationStatus" AS ENUM ('REGISTERED', 'WAITLISTED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "EventReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "RecommendationRuleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RecommendationTargetType" AS ENUM ('PRODUCT', 'PRODUCT_VARIANT', 'CATEGORY');

-- CreateEnum
CREATE TYPE "SocialPublicationStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SupportTicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'RESOLVED', 'CLOSED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SupportMessageAuthorType" AS ENUM ('USER', 'CUSTOMER', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ApprovalRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'RETURNED_FOR_REVISION', 'CANCELLED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ApprovalDecisionType" AS ENUM ('APPROVE', 'REJECT', 'RETURN_FOR_REVISION');

-- CreateEnum
CREATE TYPE "ConsentStatus" AS ENUM ('GRANTED', 'DENIED', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ConsentSubjectType" AS ENUM ('CUSTOMER', 'USER', 'VISITOR');

-- CreateEnum
CREATE TYPE "EmailMessageStatus" AS ENUM ('DRAFT', 'PREPARED', 'SENT', 'FAILED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EmailRecipientType" AS ENUM ('TO', 'CC', 'BCC');

-- CreateEnum
CREATE TYPE "EmailCategory" AS ENUM ('TRANSACTIONAL', 'SUPPORT', 'NEWSLETTER', 'MARKETING', 'SYSTEM', 'OTHER');

-- CreateEnum
CREATE TYPE "ExportRequestStatus" AS ENUM ('REQUESTED', 'RUNNING', 'GENERATED', 'FAILED', 'CANCELLED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FraudRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "FraudRiskDecisionType" AS ENUM ('ALLOW', 'REVIEW', 'BLOCK', 'CONDITIONAL_ALLOW');

-- CreateEnum
CREATE TYPE "FraudRiskReviewStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ImportRequestStatus" AS ENUM ('REQUESTED', 'VALIDATED', 'REJECTED', 'RUNNING', 'PARTIALLY_APPLIED', 'APPLIED', 'FAILED', 'CANCELLED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "IntegrationStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'FAILED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('PAYMENT_PROVIDER', 'SHIPPING_PROVIDER', 'EMAIL_PROVIDER', 'SOCIAL_PROVIDER', 'ERP', 'CRM', 'MARKETPLACE', 'STORAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "IntegrationCredentialStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "IntegrationSyncStatus" AS ENUM ('IDLE', 'PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LocalizationLocaleStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LocalizationValueStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'READ', 'FAILED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'REALTIME');

-- CreateEnum
CREATE TYPE "NotificationRecipientType" AS ENUM ('USER', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "SchedulePlanStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ScheduleSubjectType" AS ENUM ('MARKETING_CAMPAIGN', 'NEWSLETTER_CAMPAIGN', 'SOCIAL_PUBLICATION', 'PUBLIC_EVENT', 'PAGE', 'BLOG_POST', 'HOMEPAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "WebhookEndpointStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'FAILED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WebhookDeliveryStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "WorkflowDefinitionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WorkflowInstanceStatus" AS ENUM ('PENDING', 'RUNNING', 'BLOCKED', 'COMPLETED', 'FAILED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WorkflowStepStatus" AS ENUM ('PENDING', 'READY', 'RUNNING', 'BLOCKED', 'COMPLETED', 'FAILED', 'SKIPPED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ChannelStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('GOOGLE_SHOPPING', 'META_CATALOG', 'MARKETPLACE', 'INTERNAL_FEED', 'OTHER');

-- CreateEnum
CREATE TYPE "ChannelPublicationStatus" AS ENUM ('PENDING', 'ELIGIBLE', 'INELIGIBLE', 'PUBLISHED', 'REJECTED', 'EXCLUDED', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SearchDocumentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "availability_records" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "status" "AvailabilityStatus" NOT NULL DEFAULT 'UNAVAILABLE',
    "isSellable" BOOLEAN NOT NULL DEFAULT false,
    "sellableFrom" TIMESTAMP(3),
    "sellableUntil" TIMESTAMP(3),
    "preorderStartsAt" TIMESTAMP(3),
    "preorderEndsAt" TIMESTAMP(3),
    "backorderAllowed" BOOLEAN NOT NULL DEFAULT false,
    "reasonCode" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "availability_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability_policies" (
    "id" TEXT NOT NULL,
    "availabilityRecordId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "AvailabilityPolicyStatus" NOT NULL DEFAULT 'ACTIVE',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isBlocking" BOOLEAN NOT NULL DEFAULT false,
    "reasonCode" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "availability_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability_overrides" (
    "id" TEXT NOT NULL,
    "availabilityRecordId" TEXT NOT NULL,
    "type" "AvailabilityOverrideType" NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "availability_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "parentId" TEXT,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "primaryImageId" TEXT,
    "coverImageId" TEXT,
    "status" "CategoryStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "kind" "MediaAssetKind" NOT NULL DEFAULT 'IMAGE',
    "status" "MediaAssetStatus" NOT NULL DEFAULT 'DRAFT',
    "slug" TEXT,
    "title" TEXT,
    "altText" TEXT,
    "caption" TEXT,
    "description" TEXT,
    "originalFilename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "extension" TEXT,
    "storageKey" TEXT NOT NULL,
    "publicUrl" TEXT,
    "widthPx" INTEGER,
    "heightPx" INTEGER,
    "sizeBytes" INTEGER,
    "checksumSha256" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_variants" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT,
    "storageKey" TEXT NOT NULL,
    "publicUrl" TEXT,
    "mimeType" TEXT NOT NULL,
    "extension" TEXT,
    "widthPx" INTEGER,
    "heightPx" INTEGER,
    "sizeBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_references" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "subjectType" "MediaReferenceSubjectType" NOT NULL,
    "subjectId" TEXT NOT NULL,
    "role" "MediaReferenceRole" NOT NULL DEFAULT 'OTHER',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "media_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_lists" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "currencyCode" "CurrencyCode" NOT NULL,
    "status" "PriceListStatus" NOT NULL DEFAULT 'DRAFT',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "price_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_prices" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "priceListId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "compareAtAmount" DECIMAL(12,2),
    "costAmount" DECIMAL(12,2),
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "product_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_prices" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "priceListId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "compareAtAmount" DECIMAL(12,2),
    "costAmount" DECIMAL(12,2),
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "product_variant_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_types" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "product_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_characteristics" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_characteristics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "productTypeId" TEXT,
    "primaryImageId" TEXT,
    "skuRoot" TEXT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isStandalone" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "primaryImageId" TEXT,
    "sku" TEXT NOT NULL,
    "slug" TEXT,
    "name" TEXT,
    "status" "ProductVariantStatus" NOT NULL DEFAULT 'DRAFT',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "barcode" TEXT,
    "externalReference" TEXT,
    "weightGrams" INTEGER,
    "widthMm" INTEGER,
    "heightMm" INTEGER,
    "depthMm" INTEGER,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_options" (
    "id" TEXT NOT NULL,
    "productTypeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isVariantAxis" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "product_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_option_values" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "product_option_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_option_values" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "optionValueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_variant_option_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "related_products" (
    "id" TEXT NOT NULL,
    "sourceProductId" TEXT NOT NULL,
    "targetProductId" TEXT NOT NULL,
    "type" "RelatedProductType" NOT NULL DEFAULT 'RELATED',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "related_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT,
    "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE',
    "currencyCode" "CurrencyCode" NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "convertedAt" TIMESTAMP(3),
    "abandonedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_lines" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPriceAmount" DECIMAL(12,2) NOT NULL,
    "compareAtAmount" DECIMAL(12,2),
    "productName" TEXT NOT NULL,
    "variantName" TEXT,
    "sku" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkouts" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT,
    "cartId" TEXT,
    "status" "CheckoutStatus" NOT NULL DEFAULT 'OPEN',
    "currencyCode" "CurrencyCode" NOT NULL,
    "email" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "checkouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkout_lines" (
    "id" TEXT NOT NULL,
    "checkoutId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPriceAmount" DECIMAL(12,2) NOT NULL,
    "compareAtAmount" DECIMAL(12,2),
    "productName" TEXT NOT NULL,
    "variantName" TEXT,
    "sku" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checkout_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkout_addresses" (
    "id" TEXT NOT NULL,
    "checkoutId" TEXT NOT NULL,
    "type" "CheckoutAddressType" NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "company" TEXT,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "countryCode" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checkout_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkout_shipping_selections" (
    "id" TEXT NOT NULL,
    "checkoutId" TEXT NOT NULL,
    "shippingMethodId" TEXT,
    "methodCode" TEXT NOT NULL,
    "methodName" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currencyCode" "CurrencyCode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checkout_shipping_selections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "displayName" TEXT,
    "phone" TEXT,
    "status" "CustomerStatus" NOT NULL DEFAULT 'LEAD',
    "isGuest" BOOLEAN NOT NULL DEFAULT false,
    "acceptsEmail" BOOLEAN NOT NULL DEFAULT false,
    "acceptsSms" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "firstSeenAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "blockedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_addresses" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" "CustomerAddressType" NOT NULL DEFAULT 'SHIPPING',
    "label" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "company" TEXT,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "countryCode" TEXT NOT NULL,
    "phone" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "customer_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_contact_preferences" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "channel" "ContactChannel" NOT NULL,
    "topic" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enabledAt" TIMESTAMP(3),
    "disabledAt" TIMESTAMP(3),

    CONSTRAINT "customer_contact_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT,
    "checkoutId" TEXT,
    "cartId" TEXT,
    "orderNumber" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "currencyCode" "CurrencyCode" NOT NULL,
    "subtotalAmount" DECIMAL(12,2) NOT NULL,
    "shippingAmount" DECIMAL(12,2) NOT NULL,
    "discountAmount" DECIMAL(12,2) NOT NULL,
    "taxAmount" DECIMAL(12,2) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "customerEmail" TEXT,
    "customerFirstName" TEXT,
    "customerLastName" TEXT,
    "notes" TEXT,
    "placedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_lines" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPriceAmount" DECIMAL(12,2) NOT NULL,
    "compareAtAmount" DECIMAL(12,2),
    "lineSubtotalAmount" DECIMAL(12,2) NOT NULL,
    "lineDiscountAmount" DECIMAL(12,2) NOT NULL,
    "lineTaxAmount" DECIMAL(12,2) NOT NULL,
    "lineTotalAmount" DECIMAL(12,2) NOT NULL,
    "productName" TEXT NOT NULL,
    "variantName" TEXT,
    "sku" TEXT,
    "productSlug" TEXT,
    "variantSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_addresses" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "type" "OrderAddressType" NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "company" TEXT,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "countryCode" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_shipping_selections" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "shippingMethodId" TEXT,
    "methodCode" TEXT NOT NULL,
    "methodName" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currencyCode" "CurrencyCode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_shipping_selections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_status_history" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "reasonCode" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_categories" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "status" "BlogCategoryStatus" NOT NULL DEFAULT 'DRAFT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "primaryImageId" TEXT,
    "coverImageId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" TEXT,
    "status" "BlogPostStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "authorName" TEXT,
    "readingTimeMinutes" INTEGER,
    "primaryImageId" TEXT,
    "coverImageId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_post_categories" (
    "id" TEXT NOT NULL,
    "blogPostId" TEXT NOT NULL,
    "blogCategoryId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_post_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepages" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT,
    "status" "HomepageStatus" NOT NULL DEFAULT 'DRAFT',
    "isDefault" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_sections" (
    "id" TEXT NOT NULL,
    "homepageId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "HomepageSectionType" NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "body" TEXT,
    "primaryImageId" TEXT,
    "secondaryImageId" TEXT,
    "ctaLabel" TEXT,
    "ctaHref" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "homepage_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_featured_products" (
    "id" TEXT NOT NULL,
    "homepageSectionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_featured_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_featured_categories" (
    "id" TEXT NOT NULL,
    "homepageSectionId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_featured_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_featured_blog_posts" (
    "id" TEXT NOT NULL,
    "homepageSectionId" TEXT NOT NULL,
    "blogPostId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_featured_blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT,
    "body" TEXT,
    "status" "PageStatus" NOT NULL DEFAULT 'DRAFT',
    "isSystemPage" BOOLEAN NOT NULL DEFAULT false,
    "primaryImageId" TEXT,
    "coverImageId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_sections" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "body" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "primaryImageId" TEXT,
    "coverImageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_blocks" (
    "id" TEXT NOT NULL,
    "pageSectionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "PageBlockType" NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "body" TEXT,
    "primaryImageId" TEXT,
    "secondaryImageId" TEXT,
    "ctaLabel" TEXT,
    "ctaHref" TEXT,
    "htmlContent" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "page_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_metadata" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "subjectType" "SeoSubjectType" NOT NULL,
    "subjectId" TEXT NOT NULL,
    "status" "SeoStatus" NOT NULL DEFAULT 'DRAFT',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "canonicalUrl" TEXT,
    "canonicalPath" TEXT,
    "indexingMode" "SeoIndexingMode" NOT NULL DEFAULT 'INDEX_FOLLOW',
    "sitemapIncluded" BOOLEAN NOT NULL DEFAULT true,
    "openGraphTitle" TEXT,
    "openGraphDescription" TEXT,
    "openGraphImageId" TEXT,
    "twitterTitle" TEXT,
    "twitterDescription" TEXT,
    "twitterImageId" TEXT,
    "structuredDataJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "seo_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_clients" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ApiClientStatus" NOT NULL DEFAULT 'DRAFT',
    "clientId" TEXT NOT NULL,
    "publicKey" TEXT,
    "lastUsedAt" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_client_secrets" (
    "id" TEXT NOT NULL,
    "apiClientId" TEXT NOT NULL,
    "secretHash" TEXT NOT NULL,
    "secretPrefix" TEXT,
    "status" "ApiClientSecretStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_client_secrets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_client_permissions" (
    "id" TEXT NOT NULL,
    "apiClientId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "grantedByUserId" TEXT,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_client_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "displayName" TEXT,
    "type" "UserType" NOT NULL DEFAULT 'STORE',
    "status" "UserStatus" NOT NULL DEFAULT 'INVITED',
    "emailVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "invitedAt" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_credentials" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "CredentialType" NOT NULL,
    "identifier" TEXT,
    "secretHash" TEXT,
    "provider" TEXT,
    "providerAccountId" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "grantedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "StoreStatus" NOT NULL DEFAULT 'DRAFT',
    "legalName" TEXT,
    "supportEmail" TEXT,
    "supportPhone" TEXT,
    "defaultLocaleCode" TEXT NOT NULL,
    "defaultCurrency" "CurrencyCode" NOT NULL DEFAULT 'EUR',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Paris',
    "isProduction" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_domains" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "type" "StoreDomainType" NOT NULL DEFAULT 'SECONDARY',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isCanonical" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disabledAt" TIMESTAMP(3),

    CONSTRAINT "store_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "actorType" "AuditActorType" NOT NULL,
    "actorUserId" TEXT,
    "actorApiClientId" TEXT,
    "actionCode" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "level" "AuditLevel" NOT NULL DEFAULT 'INFO',
    "message" TEXT,
    "reasonCode" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log_changes" (
    "id" TEXT NOT NULL,
    "auditLogId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_changes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domain_events" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "eventType" TEXT NOT NULL,
    "eventVersion" INTEGER NOT NULL DEFAULT 1,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "status" "DomainEventStatus" NOT NULL DEFAULT 'PENDING',
    "idempotencyKey" TEXT,
    "payloadJson" TEXT NOT NULL,
    "metadataJson" TEXT,
    "occurredAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "domain_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domain_event_deliveries" (
    "id" TEXT NOT NULL,
    "domainEventId" TEXT NOT NULL,
    "consumerCode" TEXT NOT NULL,
    "status" "DomainEventStatus" NOT NULL DEFAULT 'PENDING',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "deliveredAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "domain_event_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "FeatureFlagStatus" NOT NULL DEFAULT 'DRAFT',
    "scopeType" "FeatureFlagScopeType" NOT NULL DEFAULT 'GLOBAL',
    "isEnabledByDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flag_overrides" (
    "id" TEXT NOT NULL,
    "featureFlagId" TEXT NOT NULL,
    "scopeType" "FeatureFlagScopeType" NOT NULL,
    "scopeId" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "reasonCode" TEXT,
    "notes" TEXT,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "feature_flag_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "typeCode" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "JobPriority" NOT NULL DEFAULT 'NORMAL',
    "subjectType" TEXT,
    "subjectId" TEXT,
    "idempotencyKey" TEXT,
    "deduplicationKey" TEXT,
    "payloadJson" TEXT,
    "resultJson" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "maxAttempts" INTEGER NOT NULL DEFAULT 1,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_attempts" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "workerRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoring_checks" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "checkType" TEXT NOT NULL,
    "targetType" TEXT,
    "targetId" TEXT,
    "status" "MonitoringCheckStatus" NOT NULL DEFAULT 'ACTIVE',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "intervalSeconds" INTEGER,
    "timeoutMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "monitoring_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoring_check_results" (
    "id" TEXT NOT NULL,
    "monitoringCheckId" TEXT NOT NULL,
    "status" "MonitoringCheckResultStatus" NOT NULL DEFAULT 'UNKNOWN',
    "message" TEXT,
    "reasonCode" TEXT,
    "measuredAt" TIMESTAMP(3),
    "durationMs" INTEGER,
    "payloadJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monitoring_check_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observability_signals" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "subjectType" TEXT,
    "subjectId" TEXT,
    "level" "ObservabilitySignalLevel" NOT NULL DEFAULT 'INFO',
    "status" "ObservabilitySignalStatus" NOT NULL DEFAULT 'OPEN',
    "reasonCode" TEXT,
    "sourceType" TEXT,
    "sourceRef" TEXT,
    "detectedAt" TIMESTAMP(3),
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "observability_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observability_signal_events" (
    "id" TEXT NOT NULL,
    "observabilitySignalId" TEXT NOT NULL,
    "actorUserId" TEXT,
    "eventType" TEXT NOT NULL,
    "message" TEXT,
    "payloadJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "observability_signal_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_providers" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "provider" TEXT NOT NULL,
    "modelCode" TEXT,
    "status" "AiProviderStatus" NOT NULL DEFAULT 'DRAFT',
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "ai_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_tasks" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "aiProviderId" TEXT,
    "type" "AiTaskType" NOT NULL,
    "status" "AiTaskStatus" NOT NULL DEFAULT 'PENDING',
    "subjectType" TEXT,
    "subjectId" TEXT,
    "inputText" TEXT,
    "inputJson" TEXT,
    "outputText" TEXT,
    "outputJson" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "requestedByUserId" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundles" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "BundleStatus" NOT NULL DEFAULT 'DRAFT',
    "primaryImageId" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "bundles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle_items" (
    "id" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bundle_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discounts" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "DiscountStatus" NOT NULL DEFAULT 'DRAFT',
    "type" "DiscountType" NOT NULL,
    "scopeType" "DiscountScopeType" NOT NULL DEFAULT 'ORDER',
    "percentageValue" DECIMAL(5,2),
    "fixedAmountValue" DECIMAL(12,2),
    "currencyCode" "CurrencyCode",
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "isAutomatic" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "maxRedemptions" INTEGER,
    "maxRedemptionsPerCode" INTEGER,
    "maxRedemptionsPerUser" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_codes" (
    "id" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "DiscountCodeStatus" NOT NULL DEFAULT 'ACTIVE',
    "maxRedemptions" INTEGER,
    "redeemedCount" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "discount_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_redemptions" (
    "id" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "discountCodeId" TEXT,
    "orderId" TEXT,
    "customerId" TEXT,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amountApplied" DECIMAL(12,2),
    "currencyCode" "CurrencyCode",

    CONSTRAINT "discount_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_product_targets" (
    "id" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discount_product_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_variant_targets" (
    "id" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discount_variant_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_category_targets" (
    "id" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discount_category_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "orderId" TEXT,
    "typeCode" "DocumentTypeCode" NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "documentNumber" TEXT,
    "title" TEXT,
    "currencyCode" "CurrencyCode",
    "issuedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "fileName" TEXT,
    "mimeType" TEXT,
    "storageKey" TEXT,
    "publicUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_versions" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "fileName" TEXT,
    "mimeType" TEXT,
    "storageKey" TEXT,
    "publicUrl" TEXT,
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fulfillments" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "shipmentId" TEXT,
    "status" "FulfillmentStatus" NOT NULL DEFAULT 'PENDING',
    "fulfilledAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fulfillments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fulfillment_items" (
    "id" TEXT NOT NULL,
    "fulfillmentId" TEXT NOT NULL,
    "orderLineId" TEXT NOT NULL,
    "status" "FulfillmentItemStatus" NOT NULL DEFAULT 'PENDING',
    "quantity" INTEGER NOT NULL,
    "fulfilledAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fulfillment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_cards" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT,
    "code" TEXT NOT NULL,
    "status" "GiftCardStatus" NOT NULL DEFAULT 'DRAFT',
    "initialAmount" DECIMAL(12,2) NOT NULL,
    "balanceAmount" DECIMAL(12,2) NOT NULL,
    "currencyCode" "CurrencyCode" NOT NULL,
    "purchasedOrderId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "redeemedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gift_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_card_transactions" (
    "id" TEXT NOT NULL,
    "giftCardId" TEXT NOT NULL,
    "orderId" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "currencyCode" "CurrencyCode" NOT NULL,
    "transactionType" "GiftCardTransactionType" NOT NULL,
    "reasonCode" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gift_card_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_requests" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "orderId" TEXT,
    "customerId" TEXT,
    "status" "GiftRequestStatus" NOT NULL DEFAULT 'DRAFT',
    "senderName" TEXT,
    "senderEmail" TEXT,
    "recipientName" TEXT,
    "recipientEmail" TEXT,
    "message" TEXT,
    "scheduledSendAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "claimedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gift_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_request_items" (
    "id" TEXT NOT NULL,
    "giftRequestId" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gift_request_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "sku" TEXT,
    "status" "InventoryItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "onHandQuantity" INTEGER NOT NULL DEFAULT 0,
    "reservedQuantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_reservations" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "cartId" TEXT,
    "checkoutId" TEXT,
    "orderId" TEXT,
    "quantity" INTEGER NOT NULL,
    "status" "InventoryReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "reason" TEXT,
    "notes" TEXT,
    "expiresAt" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),
    "consumedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cartLineId" TEXT,

    CONSTRAINT "inventory_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_movements" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "type" "InventoryMovementType" NOT NULL,
    "quantityDelta" INTEGER NOT NULL,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "reason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_accounts" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "LoyaltyAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "pointsBalance" INTEGER NOT NULL DEFAULT 0,
    "lifetimePoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "loyalty_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_transactions" (
    "id" TEXT NOT NULL,
    "loyaltyAccountId" TEXT NOT NULL,
    "orderId" TEXT,
    "pointsDelta" INTEGER NOT NULL,
    "reasonCode" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "methodType" "PaymentMethodType" NOT NULL,
    "currencyCode" "CurrencyCode" NOT NULL,
    "amountAuthorized" DECIMAL(12,2),
    "amountCaptured" DECIMAL(12,2),
    "amountRefunded" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "provider" TEXT,
    "providerReference" TEXT,
    "providerPaymentId" TEXT,
    "authorizedAt" TIMESTAMP(3),
    "capturedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_attempts" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "status" "PaymentAttemptStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "providerReference" TEXT,
    "idempotencyKey" TEXT,
    "requestedAmount" DECIMAL(12,2) NOT NULL,
    "responseCode" TEXT,
    "responseMessage" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_refunds" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currencyCode" "CurrencyCode" NOT NULL,
    "provider" TEXT,
    "providerReference" TEXT,
    "reasonCode" TEXT,
    "notes" TEXT,
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_requests" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT,
    "returnNumber" TEXT NOT NULL,
    "status" "ReturnRequestStatus" NOT NULL DEFAULT 'REQUESTED',
    "reasonCode" TEXT,
    "notes" TEXT,
    "requestedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "return_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_items" (
    "id" TEXT NOT NULL,
    "returnRequestId" TEXT NOT NULL,
    "orderLineId" TEXT,
    "quantity" INTEGER NOT NULL,
    "condition" "ReturnItemCondition" NOT NULL DEFAULT 'UNKNOWN',
    "reasonCode" TEXT,
    "notes" TEXT,
    "productName" TEXT NOT NULL,
    "variantName" TEXT,
    "sku" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "return_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_decisions" (
    "id" TEXT NOT NULL,
    "returnRequestId" TEXT NOT NULL,
    "decidedByUserId" TEXT,
    "type" "ReturnDecisionType" NOT NULL,
    "reasonCode" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "return_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_policies" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "SalesPolicyStatus" NOT NULL DEFAULT 'DRAFT',
    "scopeType" "SalesPolicyScopeType" NOT NULL DEFAULT 'STORE',
    "countryCode" TEXT,
    "customerTypeCode" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "sales_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sellability_decisions" (
    "id" TEXT NOT NULL,
    "salesPolicyId" TEXT,
    "storeId" TEXT NOT NULL,
    "subjectType" "SalesPolicyScopeType" NOT NULL,
    "subjectId" TEXT NOT NULL,
    "status" "SellabilityStatus" NOT NULL,
    "reasonCode" TEXT,
    "notes" TEXT,
    "decidedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "sellability_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_policy_product_targets" (
    "id" TEXT NOT NULL,
    "salesPolicyId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_policy_product_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_policy_variant_targets" (
    "id" TEXT NOT NULL,
    "salesPolicyId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_policy_variant_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_policy_category_targets" (
    "id" TEXT NOT NULL,
    "salesPolicyId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_policy_category_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_zones" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ShippingZoneStatus" NOT NULL DEFAULT 'ACTIVE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "shipping_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_methods" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "shippingZoneId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ShippingMethodStatus" NOT NULL DEFAULT 'DRAFT',
    "currencyCode" "CurrencyCode" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "minSubtotalAmount" DECIMAL(12,2),
    "maxSubtotalAmount" DECIMAL(12,2),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "shipping_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "shippingMethodId" TEXT,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PENDING',
    "carrier" TEXT,
    "trackingNumber" TEXT,
    "trackingUrl" TEXT,
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'DRAFT',
    "currencyCode" "CurrencyCode" NOT NULL,
    "intervalCode" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3),
    "nextBillingAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_items" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "status" "SubscriptionItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPriceAmount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "subscription_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_rules" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaxRuleStatus" NOT NULL DEFAULT 'DRAFT',
    "scopeType" "TaxRuleScopeType" NOT NULL DEFAULT 'STORE',
    "countryCode" TEXT NOT NULL,
    "regionCode" TEXT,
    "ratePercent" DECIMAL(7,4) NOT NULL,
    "isIncludedInPrice" BOOLEAN NOT NULL DEFAULT false,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "tax_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_rule_product_targets" (
    "id" TEXT NOT NULL,
    "taxRuleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tax_rule_product_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_rule_variant_targets" (
    "id" TEXT NOT NULL,
    "taxRuleId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tax_rule_variant_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_rule_category_targets" (
    "id" TEXT NOT NULL,
    "taxRuleId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tax_rule_category_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_metrics" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "metricType" TEXT NOT NULL,
    "unitCode" TEXT,
    "status" "AnalyticsMetricStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "analytics_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_snapshots" (
    "id" TEXT NOT NULL,
    "analyticsMetricId" TEXT NOT NULL,
    "dimensionType" TEXT,
    "dimensionKey" TEXT,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "valueDecimal" DECIMAL(18,4),
    "valueInteger" INTEGER,
    "valueText" TEXT,
    "status" "AnalyticsSnapshotStatus" NOT NULL DEFAULT 'READY',
    "sourceRef" TEXT,
    "computedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "analytics_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribution_models" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "AttributionModelStatus" NOT NULL DEFAULT 'ACTIVE',
    "modelType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "attribution_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribution_credits" (
    "id" TEXT NOT NULL,
    "attributionModelId" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "sourceCode" TEXT NOT NULL,
    "channelCode" TEXT,
    "campaignCode" TEXT,
    "creditValue" DECIMAL(8,4) NOT NULL,
    "attributedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attribution_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "behavior_segments" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "BehaviorSegmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "behavior_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "behavior_profiles" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "status" "BehaviorProfileStatus" NOT NULL DEFAULT 'ACTIVE',
    "journeyState" TEXT,
    "interestLevel" TEXT,
    "frictionLevel" TEXT,
    "computedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "behavior_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "behavior_profile_segments" (
    "id" TEXT NOT NULL,
    "behaviorProfileId" TEXT NOT NULL,
    "behaviorSegmentId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" DECIMAL(8,4),

    CONSTRAINT "behavior_profile_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversion_flows" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ConversionFlowType" NOT NULL,
    "status" "ConversionFlowStatus" NOT NULL DEFAULT 'DRAFT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "thresholdAmount" DECIMAL(12,2),
    "currencyCode" "CurrencyCode",
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "conversion_flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversion_flow_products" (
    "id" TEXT NOT NULL,
    "conversionFlowId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversion_flow_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_contacts" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT,
    "status" "CrmContactStatus" NOT NULL DEFAULT 'ACTIVE',
    "source" TEXT,
    "lifecycleStage" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "crm_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_tags" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "CrmTagStatus" NOT NULL DEFAULT 'ACTIVE',
    "colorToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "crm_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_contact_tags" (
    "id" TEXT NOT NULL,
    "crmContactId" TEXT NOT NULL,
    "crmTagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_contact_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "customerId" TEXT,
    "status" "NewsletterSubscriberStatus" NOT NULL DEFAULT 'PENDING',
    "source" TEXT,
    "subscribedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "bouncedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_campaigns" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subjectLine" TEXT NOT NULL,
    "previewText" TEXT,
    "bodyText" TEXT,
    "bodyHtml" TEXT,
    "status" "NewsletterCampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledAt" TIMESTAMP(3),
    "sendingStartedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "provider" TEXT,
    "providerReference" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_campaign_recipients" (
    "id" TEXT NOT NULL,
    "newsletterCampaignId" TEXT NOT NULL,
    "newsletterSubscriberId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_campaign_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_events" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "status" "PublicEventStatus" NOT NULL DEFAULT 'DRAFT',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "locationName" TEXT,
    "locationAddress" TEXT,
    "audienceStatus" "EventAudienceStatus" NOT NULL DEFAULT 'OPEN',
    "primaryImageId" TEXT,
    "coverImageId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_registrations" (
    "id" TEXT NOT NULL,
    "publicEventId" TEXT NOT NULL,
    "customerId" TEXT,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "status" "EventRegistrationStatus" NOT NULL DEFAULT 'REGISTERED',
    "notes" TEXT,
    "registeredAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_reservations" (
    "id" TEXT NOT NULL,
    "publicEventId" TEXT NOT NULL,
    "customerId" TEXT,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "status" "EventReservationStatus" NOT NULL DEFAULT 'PENDING',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "reservedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_rules" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "targetType" "RecommendationTargetType" NOT NULL DEFAULT 'PRODUCT',
    "status" "RecommendationRuleStatus" NOT NULL DEFAULT 'DRAFT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "recommendation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_links" (
    "id" TEXT NOT NULL,
    "recommendationRuleId" TEXT NOT NULL,
    "sourceType" "RecommendationTargetType" NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetType" "RecommendationTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "score" DECIMAL(8,4),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recommendation_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_publications" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "subjectType" TEXT,
    "subjectId" TEXT,
    "channelCode" TEXT NOT NULL,
    "status" "SocialPublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT,
    "body" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "provider" TEXT,
    "providerReference" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_publication_assets" (
    "id" TEXT NOT NULL,
    "socialPublicationId" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_publication_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "customerId" TEXT,
    "orderId" TEXT,
    "ticketNumber" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN',
    "reasonCode" TEXT,
    "notes" TEXT,
    "assignedToUserId" TEXT,
    "openedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_messages" (
    "id" TEXT NOT NULL,
    "supportTicketId" TEXT NOT NULL,
    "authorType" "SupportMessageAuthorType" NOT NULL,
    "authorUserId" TEXT,
    "authorCustomerId" TEXT,
    "body" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_requests" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "requestedByUserId" TEXT,
    "status" "ApprovalRequestStatus" NOT NULL DEFAULT 'PENDING',
    "policyCode" TEXT,
    "title" TEXT,
    "description" TEXT,
    "reasonCode" TEXT,
    "notes" TEXT,
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "approval_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_decisions" (
    "id" TEXT NOT NULL,
    "approvalRequestId" TEXT NOT NULL,
    "decidedByUserId" TEXT,
    "type" "ApprovalDecisionType" NOT NULL,
    "reasonCode" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "approval_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_purposes" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "consent_purposes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_records" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "subjectType" "ConsentSubjectType" NOT NULL,
    "subjectId" TEXT NOT NULL,
    "purposeId" TEXT NOT NULL,
    "status" "ConsentStatus" NOT NULL,
    "source" TEXT,
    "legalBasis" TEXT,
    "grantedAt" TIMESTAMP(3),
    "deniedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "evidenceRef" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_messages" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "subjectType" TEXT,
    "subjectId" TEXT,
    "category" "EmailCategory" NOT NULL DEFAULT 'TRANSACTIONAL',
    "status" "EmailMessageStatus" NOT NULL DEFAULT 'DRAFT',
    "subjectLine" TEXT NOT NULL,
    "bodyText" TEXT,
    "bodyHtml" TEXT,
    "provider" TEXT,
    "providerReference" TEXT,
    "preparedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_recipients" (
    "id" TEXT NOT NULL,
    "emailMessageId" TEXT NOT NULL,
    "type" "EmailRecipientType" NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_definitions" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sourceType" TEXT NOT NULL,
    "formatCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "export_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_requests" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "exportDefinitionId" TEXT NOT NULL,
    "requestedByUserId" TEXT,
    "status" "ExportRequestStatus" NOT NULL DEFAULT 'REQUESTED',
    "scopeType" TEXT,
    "scopeId" TEXT,
    "filterJson" TEXT,
    "resultJson" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "requestedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "export_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_artifacts" (
    "id" TEXT NOT NULL,
    "exportRequestId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "fileName" TEXT,
    "mimeType" TEXT,
    "storageKey" TEXT,
    "publicUrl" TEXT,
    "sizeBytes" INTEGER,
    "payloadJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "export_artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fraud_risk_assessments" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "level" "FraudRiskLevel" NOT NULL,
    "score" DECIMAL(8,2),
    "decisionType" "FraudRiskDecisionType" NOT NULL,
    "reasonCode" TEXT,
    "notes" TEXT,
    "assessedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "fraud_risk_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fraud_risk_decisions" (
    "id" TEXT NOT NULL,
    "fraudRiskAssessmentId" TEXT NOT NULL,
    "decidedByUserId" TEXT,
    "type" "FraudRiskDecisionType" NOT NULL,
    "reasonCode" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fraud_risk_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fraud_risk_reviews" (
    "id" TEXT NOT NULL,
    "fraudRiskAssessmentId" TEXT NOT NULL,
    "assignedToUserId" TEXT,
    "status" "FraudRiskReviewStatus" NOT NULL DEFAULT 'OPEN',
    "reasonCode" TEXT,
    "notes" TEXT,
    "openedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "fraud_risk_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_definitions" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "targetType" TEXT NOT NULL,
    "formatCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "import_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_requests" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "importDefinitionId" TEXT NOT NULL,
    "requestedByUserId" TEXT,
    "status" "ImportRequestStatus" NOT NULL DEFAULT 'REQUESTED',
    "scopeType" TEXT,
    "scopeId" TEXT,
    "sourceFileName" TEXT,
    "sourceMimeType" TEXT,
    "sourceStorageKey" TEXT,
    "sourcePublicUrl" TEXT,
    "mappingJson" TEXT,
    "validationJson" TEXT,
    "resultJson" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "requestedAt" TIMESTAMP(3),
    "validatedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "import_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_artifacts" (
    "id" TEXT NOT NULL,
    "importRequestId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "fileName" TEXT,
    "mimeType" TEXT,
    "storageKey" TEXT,
    "publicUrl" TEXT,
    "payloadJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "import_artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "IntegrationType" NOT NULL,
    "provider" TEXT NOT NULL,
    "status" "IntegrationStatus" NOT NULL DEFAULT 'DRAFT',
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isSandbox" BOOLEAN NOT NULL DEFAULT true,
    "baseUrl" TEXT,
    "webhookBaseUrl" TEXT,
    "lastCheckedAt" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_credentials" (
    "id" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "secretHash" TEXT,
    "secretPrefix" TEXT,
    "valueHint" TEXT,
    "status" "IntegrationCredentialStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integration_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_sync_states" (
    "id" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "scopeType" TEXT NOT NULL,
    "scopeId" TEXT,
    "status" "IntegrationSyncStatus" NOT NULL DEFAULT 'IDLE',
    "lastJobId" TEXT,
    "lastRunAt" TIMESTAMP(3),
    "lastSuccessAt" TIMESTAMP(3),
    "lastFailureAt" TIMESTAMP(3),
    "cursor" TEXT,
    "externalReference" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integration_sync_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localization_locales" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "countryCode" TEXT,
    "name" TEXT NOT NULL,
    "status" "LocalizationLocaleStatus" NOT NULL DEFAULT 'ACTIVE',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "localization_locales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localized_values" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "localeId" TEXT NOT NULL,
    "status" "LocalizationValueStatus" NOT NULL DEFAULT 'DRAFT',
    "valueText" TEXT NOT NULL,
    "isFallback" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "localized_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "recipientType" "NotificationRecipientType" NOT NULL,
    "recipientUserId" TEXT,
    "recipientCustomerId" TEXT,
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "subjectType" TEXT,
    "subjectId" TEXT,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "recipientKey" TEXT NOT NULL,
    "recipientType" "NotificationRecipientType" NOT NULL,
    "recipientUserId" TEXT,
    "recipientCustomerId" TEXT,
    "channel" "NotificationChannel" NOT NULL,
    "topic" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_plans" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "subjectType" "ScheduleSubjectType" NOT NULL,
    "subjectId" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT,
    "description" TEXT,
    "status" "SchedulePlanStatus" NOT NULL DEFAULT 'DRAFT',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Paris',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cancelledAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "schedule_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_windows" (
    "id" TEXT NOT NULL,
    "schedulePlanId" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "schedule_windows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_occurrences" (
    "id" TEXT NOT NULL,
    "schedulePlanId" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "executedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedule_occurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_endpoints" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "integrationId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "WebhookEndpointStatus" NOT NULL DEFAULT 'DRAFT',
    "targetUrl" TEXT NOT NULL,
    "secretHash" TEXT,
    "secretPrefix" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "eventType" TEXT NOT NULL,
    "version" TEXT,
    "timeoutMs" INTEGER,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "lastTriggeredAt" TIMESTAMP(3),
    "lastSucceededAt" TIMESTAMP(3),
    "lastFailedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_deliveries" (
    "id" TEXT NOT NULL,
    "webhookEndpointId" TEXT NOT NULL,
    "status" "WebhookDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "eventType" TEXT NOT NULL,
    "eventId" TEXT,
    "idempotencyKey" TEXT,
    "requestUrl" TEXT NOT NULL,
    "requestMethod" TEXT NOT NULL DEFAULT 'POST',
    "requestHeadersJson" TEXT,
    "requestBodyJson" TEXT,
    "responseStatusCode" INTEGER,
    "responseHeadersJson" TEXT,
    "responseBodyText" TEXT,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_definitions" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subjectType" TEXT NOT NULL,
    "status" "WorkflowDefinitionStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "workflow_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_definition_steps" (
    "id" TEXT NOT NULL,
    "workflowDefinitionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isTerminal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_definition_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_instances" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "workflowDefinitionId" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "status" "WorkflowInstanceStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_step_instances" (
    "id" TEXT NOT NULL,
    "workflowInstanceId" TEXT NOT NULL,
    "workflowDefinitionStepId" TEXT NOT NULL,
    "status" "WorkflowStepStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "reasonCode" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_step_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ChannelType" NOT NULL,
    "status" "ChannelStatus" NOT NULL DEFAULT 'DRAFT',
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_product_statuses" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "publicationStatus" "ChannelPublicationStatus" NOT NULL DEFAULT 'PENDING',
    "isEligible" BOOLEAN NOT NULL DEFAULT false,
    "reasonCode" TEXT,
    "notes" TEXT,
    "publishedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_product_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_variant_statuses" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "publicationStatus" "ChannelPublicationStatus" NOT NULL DEFAULT 'PENDING',
    "isEligible" BOOLEAN NOT NULL DEFAULT false,
    "reasonCode" TEXT,
    "notes" TEXT,
    "publishedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_variant_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_documents" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "localeCode" TEXT,
    "status" "SearchDocumentStatus" NOT NULL DEFAULT 'ACTIVE',
    "indexedText" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "search_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "availability_records_storeId_status_idx" ON "availability_records"("storeId", "status");

-- CreateIndex
CREATE INDEX "availability_records_storeId_isSellable_idx" ON "availability_records"("storeId", "isSellable");

-- CreateIndex
CREATE INDEX "availability_records_variantId_isSellable_idx" ON "availability_records"("variantId", "isSellable");

-- CreateIndex
CREATE INDEX "availability_records_status_sellableFrom_sellableUntil_idx" ON "availability_records"("status", "sellableFrom", "sellableUntil");

-- CreateIndex
CREATE INDEX "availability_records_backorderAllowed_idx" ON "availability_records"("backorderAllowed");

-- CreateIndex
CREATE UNIQUE INDEX "availability_records_storeId_variantId_key" ON "availability_records"("storeId", "variantId");

-- CreateIndex
CREATE INDEX "availability_policies_availabilityRecordId_status_idx" ON "availability_policies"("availabilityRecordId", "status");

-- CreateIndex
CREATE INDEX "availability_policies_availabilityRecordId_priority_idx" ON "availability_policies"("availabilityRecordId", "priority");

-- CreateIndex
CREATE INDEX "availability_policies_status_isBlocking_idx" ON "availability_policies"("status", "isBlocking");

-- CreateIndex
CREATE UNIQUE INDEX "availability_policies_availabilityRecordId_code_key" ON "availability_policies"("availabilityRecordId", "code");

-- CreateIndex
CREATE INDEX "availability_overrides_availabilityRecordId_type_idx" ON "availability_overrides"("availabilityRecordId", "type");

-- CreateIndex
CREATE INDEX "availability_overrides_availabilityRecordId_isActive_idx" ON "availability_overrides"("availabilityRecordId", "isActive");

-- CreateIndex
CREATE INDEX "availability_overrides_startsAt_endsAt_idx" ON "availability_overrides"("startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "categories_storeId_status_idx" ON "categories"("storeId", "status");

-- CreateIndex
CREATE INDEX "categories_parentId_sortOrder_idx" ON "categories"("parentId", "sortOrder");

-- CreateIndex
CREATE INDEX "categories_isFeatured_idx" ON "categories"("isFeatured");

-- CreateIndex
CREATE INDEX "categories_primaryImageId_idx" ON "categories"("primaryImageId");

-- CreateIndex
CREATE INDEX "categories_coverImageId_idx" ON "categories"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_storeId_code_key" ON "categories"("storeId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "categories_storeId_slug_key" ON "categories"("storeId", "slug");

-- CreateIndex
CREATE INDEX "product_categories_categoryId_isPrimary_idx" ON "product_categories"("categoryId", "isPrimary");

-- CreateIndex
CREATE INDEX "product_categories_categoryId_sortOrder_idx" ON "product_categories"("categoryId", "sortOrder");

-- CreateIndex
CREATE INDEX "product_categories_productId_isPrimary_idx" ON "product_categories"("productId", "isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_productId_categoryId_key" ON "product_categories"("productId", "categoryId");

-- CreateIndex
CREATE INDEX "media_assets_storeId_status_idx" ON "media_assets"("storeId", "status");

-- CreateIndex
CREATE INDEX "media_assets_kind_status_idx" ON "media_assets"("kind", "status");

-- CreateIndex
CREATE INDEX "media_assets_mimeType_idx" ON "media_assets"("mimeType");

-- CreateIndex
CREATE INDEX "media_assets_checksumSha256_idx" ON "media_assets"("checksumSha256");

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_storeId_storageKey_key" ON "media_assets"("storeId", "storageKey");

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_storeId_slug_key" ON "media_assets"("storeId", "slug");

-- CreateIndex
CREATE INDEX "media_variants_assetId_idx" ON "media_variants"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "media_variants_assetId_key_key" ON "media_variants"("assetId", "key");

-- CreateIndex
CREATE INDEX "media_references_subjectType_subjectId_isActive_idx" ON "media_references"("subjectType", "subjectId", "isActive");

-- CreateIndex
CREATE INDEX "media_references_subjectType_subjectId_role_sortOrder_idx" ON "media_references"("subjectType", "subjectId", "role", "sortOrder");

-- CreateIndex
CREATE INDEX "media_references_assetId_isPrimary_idx" ON "media_references"("assetId", "isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "media_references_assetId_subjectType_subjectId_role_key" ON "media_references"("assetId", "subjectType", "subjectId", "role");

-- CreateIndex
CREATE INDEX "price_lists_storeId_status_idx" ON "price_lists"("storeId", "status");

-- CreateIndex
CREATE INDEX "price_lists_storeId_isDefault_idx" ON "price_lists"("storeId", "isDefault");

-- CreateIndex
CREATE INDEX "price_lists_currencyCode_status_idx" ON "price_lists"("currencyCode", "status");

-- CreateIndex
CREATE INDEX "price_lists_startsAt_endsAt_idx" ON "price_lists"("startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "price_lists_storeId_code_key" ON "price_lists"("storeId", "code");

-- CreateIndex
CREATE INDEX "product_prices_priceListId_isActive_idx" ON "product_prices"("priceListId", "isActive");

-- CreateIndex
CREATE INDEX "product_prices_productId_isActive_idx" ON "product_prices"("productId", "isActive");

-- CreateIndex
CREATE INDEX "product_prices_startsAt_endsAt_idx" ON "product_prices"("startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "product_prices_productId_priceListId_key" ON "product_prices"("productId", "priceListId");

-- CreateIndex
CREATE INDEX "product_variant_prices_priceListId_isActive_idx" ON "product_variant_prices"("priceListId", "isActive");

-- CreateIndex
CREATE INDEX "product_variant_prices_variantId_isActive_idx" ON "product_variant_prices"("variantId", "isActive");

-- CreateIndex
CREATE INDEX "product_variant_prices_startsAt_endsAt_idx" ON "product_variant_prices"("startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_prices_variantId_priceListId_key" ON "product_variant_prices"("variantId", "priceListId");

-- CreateIndex
CREATE INDEX "product_types_storeId_isActive_idx" ON "product_types"("storeId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "product_types_storeId_code_key" ON "product_types"("storeId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "product_types_storeId_slug_key" ON "product_types"("storeId", "slug");

-- CreateIndex
CREATE INDEX "product_characteristics_productId_sortOrder_idx" ON "product_characteristics"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "products_storeId_idx" ON "products"("storeId");

-- CreateIndex
CREATE INDEX "products_productTypeId_idx" ON "products"("productTypeId");

-- CreateIndex
CREATE INDEX "products_primaryImageId_idx" ON "products"("primaryImageId");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "products"("status");

-- CreateIndex
CREATE INDEX "products_isFeatured_idx" ON "products"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "products_storeId_slug_key" ON "products"("storeId", "slug");

-- CreateIndex
CREATE INDEX "product_variants_productId_status_idx" ON "product_variants"("productId", "status");

-- CreateIndex
CREATE INDEX "product_variants_productId_isDefault_idx" ON "product_variants"("productId", "isDefault");

-- CreateIndex
CREATE INDEX "product_variants_primaryImageId_idx" ON "product_variants"("primaryImageId");

-- CreateIndex
CREATE INDEX "product_variants_sortOrder_idx" ON "product_variants"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_productId_sku_key" ON "product_variants"("productId", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_productId_slug_key" ON "product_variants"("productId", "slug");

-- CreateIndex
CREATE INDEX "product_options_productTypeId_isActive_idx" ON "product_options"("productTypeId", "isActive");

-- CreateIndex
CREATE INDEX "product_options_sortOrder_idx" ON "product_options"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "product_options_productTypeId_code_key" ON "product_options"("productTypeId", "code");

-- CreateIndex
CREATE INDEX "product_option_values_optionId_isActive_idx" ON "product_option_values"("optionId", "isActive");

-- CreateIndex
CREATE INDEX "product_option_values_sortOrder_idx" ON "product_option_values"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "product_option_values_optionId_code_key" ON "product_option_values"("optionId", "code");

-- CreateIndex
CREATE INDEX "product_variant_option_values_optionValueId_idx" ON "product_variant_option_values"("optionValueId");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_option_values_variantId_optionValueId_key" ON "product_variant_option_values"("variantId", "optionValueId");

-- CreateIndex
CREATE INDEX "related_products_targetProductId_type_idx" ON "related_products"("targetProductId", "type");

-- CreateIndex
CREATE INDEX "related_products_sourceProductId_sortOrder_idx" ON "related_products"("sourceProductId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "related_products_sourceProductId_targetProductId_type_key" ON "related_products"("sourceProductId", "targetProductId", "type");

-- CreateIndex
CREATE INDEX "carts_storeId_status_idx" ON "carts"("storeId", "status");

-- CreateIndex
CREATE INDEX "carts_customerId_status_idx" ON "carts"("customerId", "status");

-- CreateIndex
CREATE INDEX "carts_expiresAt_idx" ON "carts"("expiresAt");

-- CreateIndex
CREATE INDEX "cart_lines_cartId_idx" ON "cart_lines"("cartId");

-- CreateIndex
CREATE INDEX "cart_lines_productId_idx" ON "cart_lines"("productId");

-- CreateIndex
CREATE INDEX "cart_lines_variantId_idx" ON "cart_lines"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_lines_cartId_variantId_key" ON "cart_lines"("cartId", "variantId");

-- CreateIndex
CREATE INDEX "checkouts_storeId_status_idx" ON "checkouts"("storeId", "status");

-- CreateIndex
CREATE INDEX "checkouts_customerId_status_idx" ON "checkouts"("customerId", "status");

-- CreateIndex
CREATE INDEX "checkouts_cartId_idx" ON "checkouts"("cartId");

-- CreateIndex
CREATE INDEX "checkouts_expiresAt_idx" ON "checkouts"("expiresAt");

-- CreateIndex
CREATE INDEX "checkout_lines_checkoutId_idx" ON "checkout_lines"("checkoutId");

-- CreateIndex
CREATE INDEX "checkout_lines_productId_idx" ON "checkout_lines"("productId");

-- CreateIndex
CREATE INDEX "checkout_lines_variantId_idx" ON "checkout_lines"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "checkout_lines_checkoutId_variantId_key" ON "checkout_lines"("checkoutId", "variantId");

-- CreateIndex
CREATE INDEX "checkout_addresses_checkoutId_idx" ON "checkout_addresses"("checkoutId");

-- CreateIndex
CREATE UNIQUE INDEX "checkout_addresses_checkoutId_type_key" ON "checkout_addresses"("checkoutId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "checkout_shipping_selections_checkoutId_key" ON "checkout_shipping_selections"("checkoutId");

-- CreateIndex
CREATE INDEX "checkout_shipping_selections_shippingMethodId_idx" ON "checkout_shipping_selections"("shippingMethodId");

-- CreateIndex
CREATE INDEX "customers_storeId_idx" ON "customers"("storeId");

-- CreateIndex
CREATE INDEX "customers_status_idx" ON "customers"("status");

-- CreateIndex
CREATE INDEX "customers_isGuest_idx" ON "customers"("isGuest");

-- CreateIndex
CREATE INDEX "customers_email_idx" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_storeId_email_key" ON "customers"("storeId", "email");

-- CreateIndex
CREATE INDEX "customer_addresses_customerId_type_idx" ON "customer_addresses"("customerId", "type");

-- CreateIndex
CREATE INDEX "customer_addresses_customerId_isDefault_idx" ON "customer_addresses"("customerId", "isDefault");

-- CreateIndex
CREATE INDEX "customer_addresses_countryCode_postalCode_idx" ON "customer_addresses"("countryCode", "postalCode");

-- CreateIndex
CREATE INDEX "customer_contact_preferences_customerId_isEnabled_idx" ON "customer_contact_preferences"("customerId", "isEnabled");

-- CreateIndex
CREATE INDEX "customer_contact_preferences_channel_topic_isEnabled_idx" ON "customer_contact_preferences"("channel", "topic", "isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "customer_contact_preferences_customerId_channel_topic_key" ON "customer_contact_preferences"("customerId", "channel", "topic");

-- CreateIndex
CREATE INDEX "orders_storeId_status_idx" ON "orders"("storeId", "status");

-- CreateIndex
CREATE INDEX "orders_customerId_status_idx" ON "orders"("customerId", "status");

-- CreateIndex
CREATE INDEX "orders_checkoutId_idx" ON "orders"("checkoutId");

-- CreateIndex
CREATE INDEX "orders_cartId_idx" ON "orders"("cartId");

-- CreateIndex
CREATE INDEX "orders_placedAt_idx" ON "orders"("placedAt");

-- CreateIndex
CREATE UNIQUE INDEX "orders_storeId_orderNumber_key" ON "orders"("storeId", "orderNumber");

-- CreateIndex
CREATE INDEX "order_lines_orderId_idx" ON "order_lines"("orderId");

-- CreateIndex
CREATE INDEX "order_lines_productId_idx" ON "order_lines"("productId");

-- CreateIndex
CREATE INDEX "order_lines_variantId_idx" ON "order_lines"("variantId");

-- CreateIndex
CREATE INDEX "order_addresses_orderId_idx" ON "order_addresses"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "order_addresses_orderId_type_key" ON "order_addresses"("orderId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "order_shipping_selections_orderId_key" ON "order_shipping_selections"("orderId");

-- CreateIndex
CREATE INDEX "order_shipping_selections_shippingMethodId_idx" ON "order_shipping_selections"("shippingMethodId");

-- CreateIndex
CREATE INDEX "order_status_history_orderId_createdAt_idx" ON "order_status_history"("orderId", "createdAt");

-- CreateIndex
CREATE INDEX "order_status_history_status_createdAt_idx" ON "order_status_history"("status", "createdAt");

-- CreateIndex
CREATE INDEX "blog_categories_storeId_status_idx" ON "blog_categories"("storeId", "status");

-- CreateIndex
CREATE INDEX "blog_categories_storeId_isFeatured_idx" ON "blog_categories"("storeId", "isFeatured");

-- CreateIndex
CREATE INDEX "blog_categories_sortOrder_idx" ON "blog_categories"("sortOrder");

-- CreateIndex
CREATE INDEX "blog_categories_primaryImageId_idx" ON "blog_categories"("primaryImageId");

-- CreateIndex
CREATE INDEX "blog_categories_coverImageId_idx" ON "blog_categories"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_storeId_code_key" ON "blog_categories"("storeId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_storeId_slug_key" ON "blog_categories"("storeId", "slug");

-- CreateIndex
CREATE INDEX "blog_posts_storeId_status_idx" ON "blog_posts"("storeId", "status");

-- CreateIndex
CREATE INDEX "blog_posts_storeId_isFeatured_idx" ON "blog_posts"("storeId", "isFeatured");

-- CreateIndex
CREATE INDEX "blog_posts_publishedAt_idx" ON "blog_posts"("publishedAt");

-- CreateIndex
CREATE INDEX "blog_posts_primaryImageId_idx" ON "blog_posts"("primaryImageId");

-- CreateIndex
CREATE INDEX "blog_posts_coverImageId_idx" ON "blog_posts"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_storeId_slug_key" ON "blog_posts"("storeId", "slug");

-- CreateIndex
CREATE INDEX "blog_post_categories_blogCategoryId_isPrimary_idx" ON "blog_post_categories"("blogCategoryId", "isPrimary");

-- CreateIndex
CREATE INDEX "blog_post_categories_blogCategoryId_sortOrder_idx" ON "blog_post_categories"("blogCategoryId", "sortOrder");

-- CreateIndex
CREATE INDEX "blog_post_categories_blogPostId_isPrimary_idx" ON "blog_post_categories"("blogPostId", "isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_categories_blogPostId_blogCategoryId_key" ON "blog_post_categories"("blogPostId", "blogCategoryId");

-- CreateIndex
CREATE INDEX "homepages_storeId_status_idx" ON "homepages"("storeId", "status");

-- CreateIndex
CREATE INDEX "homepages_storeId_isDefault_idx" ON "homepages"("storeId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "homepages_storeId_code_key" ON "homepages"("storeId", "code");

-- CreateIndex
CREATE INDEX "homepage_sections_homepageId_isActive_idx" ON "homepage_sections"("homepageId", "isActive");

-- CreateIndex
CREATE INDEX "homepage_sections_homepageId_sortOrder_idx" ON "homepage_sections"("homepageId", "sortOrder");

-- CreateIndex
CREATE INDEX "homepage_sections_type_idx" ON "homepage_sections"("type");

-- CreateIndex
CREATE INDEX "homepage_sections_primaryImageId_idx" ON "homepage_sections"("primaryImageId");

-- CreateIndex
CREATE INDEX "homepage_sections_secondaryImageId_idx" ON "homepage_sections"("secondaryImageId");

-- CreateIndex
CREATE UNIQUE INDEX "homepage_sections_homepageId_code_key" ON "homepage_sections"("homepageId", "code");

-- CreateIndex
CREATE INDEX "homepage_featured_products_homepageSectionId_sortOrder_idx" ON "homepage_featured_products"("homepageSectionId", "sortOrder");

-- CreateIndex
CREATE INDEX "homepage_featured_products_productId_idx" ON "homepage_featured_products"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "homepage_featured_products_homepageSectionId_productId_key" ON "homepage_featured_products"("homepageSectionId", "productId");

-- CreateIndex
CREATE INDEX "homepage_featured_categories_homepageSectionId_sortOrder_idx" ON "homepage_featured_categories"("homepageSectionId", "sortOrder");

-- CreateIndex
CREATE INDEX "homepage_featured_categories_categoryId_idx" ON "homepage_featured_categories"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "homepage_featured_categories_homepageSectionId_categoryId_key" ON "homepage_featured_categories"("homepageSectionId", "categoryId");

-- CreateIndex
CREATE INDEX "homepage_featured_blog_posts_homepageSectionId_sortOrder_idx" ON "homepage_featured_blog_posts"("homepageSectionId", "sortOrder");

-- CreateIndex
CREATE INDEX "homepage_featured_blog_posts_blogPostId_idx" ON "homepage_featured_blog_posts"("blogPostId");

-- CreateIndex
CREATE UNIQUE INDEX "homepage_featured_blog_posts_homepageSectionId_blogPostId_key" ON "homepage_featured_blog_posts"("homepageSectionId", "blogPostId");

-- CreateIndex
CREATE INDEX "pages_storeId_status_idx" ON "pages"("storeId", "status");

-- CreateIndex
CREATE INDEX "pages_primaryImageId_idx" ON "pages"("primaryImageId");

-- CreateIndex
CREATE INDEX "pages_coverImageId_idx" ON "pages"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "pages_storeId_code_key" ON "pages"("storeId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "pages_storeId_slug_key" ON "pages"("storeId", "slug");

-- CreateIndex
CREATE INDEX "page_sections_pageId_isActive_idx" ON "page_sections"("pageId", "isActive");

-- CreateIndex
CREATE INDEX "page_sections_pageId_sortOrder_idx" ON "page_sections"("pageId", "sortOrder");

-- CreateIndex
CREATE INDEX "page_sections_primaryImageId_idx" ON "page_sections"("primaryImageId");

-- CreateIndex
CREATE INDEX "page_sections_coverImageId_idx" ON "page_sections"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "page_sections_pageId_code_key" ON "page_sections"("pageId", "code");

-- CreateIndex
CREATE INDEX "page_blocks_pageSectionId_isActive_idx" ON "page_blocks"("pageSectionId", "isActive");

-- CreateIndex
CREATE INDEX "page_blocks_pageSectionId_sortOrder_idx" ON "page_blocks"("pageSectionId", "sortOrder");

-- CreateIndex
CREATE INDEX "page_blocks_type_idx" ON "page_blocks"("type");

-- CreateIndex
CREATE INDEX "page_blocks_primaryImageId_idx" ON "page_blocks"("primaryImageId");

-- CreateIndex
CREATE INDEX "page_blocks_secondaryImageId_idx" ON "page_blocks"("secondaryImageId");

-- CreateIndex
CREATE UNIQUE INDEX "page_blocks_pageSectionId_code_key" ON "page_blocks"("pageSectionId", "code");

-- CreateIndex
CREATE INDEX "seo_metadata_storeId_status_idx" ON "seo_metadata"("storeId", "status");

-- CreateIndex
CREATE INDEX "seo_metadata_subjectType_subjectId_idx" ON "seo_metadata"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "seo_metadata_indexingMode_idx" ON "seo_metadata"("indexingMode");

-- CreateIndex
CREATE INDEX "seo_metadata_openGraphImageId_idx" ON "seo_metadata"("openGraphImageId");

-- CreateIndex
CREATE INDEX "seo_metadata_twitterImageId_idx" ON "seo_metadata"("twitterImageId");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_storeId_subjectType_subjectId_key" ON "seo_metadata"("storeId", "subjectType", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "api_clients_clientId_key" ON "api_clients"("clientId");

-- CreateIndex
CREATE INDEX "api_clients_storeId_status_idx" ON "api_clients"("storeId", "status");

-- CreateIndex
CREATE INDEX "api_clients_status_lastUsedAt_idx" ON "api_clients"("status", "lastUsedAt");

-- CreateIndex
CREATE UNIQUE INDEX "api_clients_storeId_code_key" ON "api_clients"("storeId", "code");

-- CreateIndex
CREATE INDEX "api_client_secrets_apiClientId_status_idx" ON "api_client_secrets"("apiClientId", "status");

-- CreateIndex
CREATE INDEX "api_client_secrets_expiresAt_idx" ON "api_client_secrets"("expiresAt");

-- CreateIndex
CREATE INDEX "api_client_permissions_resource_action_idx" ON "api_client_permissions"("resource", "action");

-- CreateIndex
CREATE INDEX "api_client_permissions_grantedByUserId_idx" ON "api_client_permissions"("grantedByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "api_client_permissions_apiClientId_code_key" ON "api_client_permissions"("apiClientId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_storeId_idx" ON "users"("storeId");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_type_idx" ON "users"("type");

-- CreateIndex
CREATE INDEX "user_credentials_userId_type_idx" ON "user_credentials"("userId", "type");

-- CreateIndex
CREATE INDEX "user_credentials_identifier_idx" ON "user_credentials"("identifier");

-- CreateIndex
CREATE INDEX "user_credentials_isActive_idx" ON "user_credentials"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_tokenHash_key" ON "user_sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "user_sessions_userId_status_idx" ON "user_sessions"("userId", "status");

-- CreateIndex
CREATE INDEX "user_sessions_expiresAt_idx" ON "user_sessions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE INDEX "roles_isSystem_idx" ON "roles"("isSystem");

-- CreateIndex
CREATE INDEX "roles_isActive_idx" ON "roles"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE INDEX "permissions_resource_action_idx" ON "permissions"("resource", "action");

-- CreateIndex
CREATE INDEX "user_roles_roleId_idx" ON "user_roles"("roleId");

-- CreateIndex
CREATE INDEX "user_roles_assignedByUserId_idx" ON "user_roles"("assignedByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "user_roles"("userId", "roleId");

-- CreateIndex
CREATE INDEX "role_permissions_permissionId_idx" ON "role_permissions"("permissionId");

-- CreateIndex
CREATE INDEX "role_permissions_grantedByUserId_idx" ON "role_permissions"("grantedByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "stores_code_key" ON "stores"("code");

-- CreateIndex
CREATE UNIQUE INDEX "stores_slug_key" ON "stores"("slug");

-- CreateIndex
CREATE INDEX "stores_status_idx" ON "stores"("status");

-- CreateIndex
CREATE INDEX "stores_slug_idx" ON "stores"("slug");

-- CreateIndex
CREATE INDEX "store_domains_storeId_type_idx" ON "store_domains"("storeId", "type");

-- CreateIndex
CREATE INDEX "store_domains_host_idx" ON "store_domains"("host");

-- CreateIndex
CREATE UNIQUE INDEX "store_domains_storeId_host_key" ON "store_domains"("storeId", "host");

-- CreateIndex
CREATE INDEX "audit_logs_storeId_createdAt_idx" ON "audit_logs"("storeId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_actorType_createdAt_idx" ON "audit_logs"("actorType", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_actorUserId_createdAt_idx" ON "audit_logs"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_actorApiClientId_createdAt_idx" ON "audit_logs"("actorApiClientId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_createdAt_idx" ON "audit_logs"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_actionCode_createdAt_idx" ON "audit_logs"("actionCode", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_level_createdAt_idx" ON "audit_logs"("level", "createdAt");

-- CreateIndex
CREATE INDEX "audit_log_changes_auditLogId_idx" ON "audit_log_changes"("auditLogId");

-- CreateIndex
CREATE INDEX "audit_log_changes_fieldName_idx" ON "audit_log_changes"("fieldName");

-- CreateIndex
CREATE INDEX "domain_events_storeId_status_idx" ON "domain_events"("storeId", "status");

-- CreateIndex
CREATE INDEX "domain_events_eventType_status_idx" ON "domain_events"("eventType", "status");

-- CreateIndex
CREATE INDEX "domain_events_aggregateType_aggregateId_idx" ON "domain_events"("aggregateType", "aggregateId");

-- CreateIndex
CREATE INDEX "domain_events_occurredAt_idx" ON "domain_events"("occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "domain_events_idempotencyKey_key" ON "domain_events"("idempotencyKey");

-- CreateIndex
CREATE INDEX "domain_event_deliveries_consumerCode_status_idx" ON "domain_event_deliveries"("consumerCode", "status");

-- CreateIndex
CREATE INDEX "domain_event_deliveries_deliveredAt_idx" ON "domain_event_deliveries"("deliveredAt");

-- CreateIndex
CREATE UNIQUE INDEX "domain_event_deliveries_domainEventId_consumerCode_key" ON "domain_event_deliveries"("domainEventId", "consumerCode");

-- CreateIndex
CREATE INDEX "feature_flags_storeId_status_idx" ON "feature_flags"("storeId", "status");

-- CreateIndex
CREATE INDEX "feature_flags_scopeType_status_idx" ON "feature_flags"("scopeType", "status");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_storeId_code_key" ON "feature_flags"("storeId", "code");

-- CreateIndex
CREATE INDEX "feature_flag_overrides_scopeType_scopeId_idx" ON "feature_flag_overrides"("scopeType", "scopeId");

-- CreateIndex
CREATE INDEX "feature_flag_overrides_startsAt_endsAt_idx" ON "feature_flag_overrides"("startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "feature_flag_overrides_createdByUserId_idx" ON "feature_flag_overrides"("createdByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flag_overrides_featureFlagId_scopeType_scopeId_key" ON "feature_flag_overrides"("featureFlagId", "scopeType", "scopeId");

-- CreateIndex
CREATE INDEX "jobs_storeId_status_idx" ON "jobs"("storeId", "status");

-- CreateIndex
CREATE INDEX "jobs_typeCode_status_idx" ON "jobs"("typeCode", "status");

-- CreateIndex
CREATE INDEX "jobs_priority_status_idx" ON "jobs"("priority", "status");

-- CreateIndex
CREATE INDEX "jobs_scheduledAt_status_idx" ON "jobs"("scheduledAt", "status");

-- CreateIndex
CREATE INDEX "jobs_subjectType_subjectId_idx" ON "jobs"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "jobs_createdByUserId_idx" ON "jobs"("createdByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_idempotencyKey_key" ON "jobs"("idempotencyKey");

-- CreateIndex
CREATE INDEX "job_attempts_jobId_status_idx" ON "job_attempts"("jobId", "status");

-- CreateIndex
CREATE INDEX "job_attempts_startedAt_finishedAt_idx" ON "job_attempts"("startedAt", "finishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "job_attempts_jobId_attemptNumber_key" ON "job_attempts"("jobId", "attemptNumber");

-- CreateIndex
CREATE INDEX "monitoring_checks_storeId_status_idx" ON "monitoring_checks"("storeId", "status");

-- CreateIndex
CREATE INDEX "monitoring_checks_checkType_status_idx" ON "monitoring_checks"("checkType", "status");

-- CreateIndex
CREATE INDEX "monitoring_checks_targetType_targetId_idx" ON "monitoring_checks"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "monitoring_checks_isEnabled_idx" ON "monitoring_checks"("isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "monitoring_checks_storeId_code_key" ON "monitoring_checks"("storeId", "code");

-- CreateIndex
CREATE INDEX "monitoring_check_results_monitoringCheckId_measuredAt_idx" ON "monitoring_check_results"("monitoringCheckId", "measuredAt");

-- CreateIndex
CREATE INDEX "monitoring_check_results_status_measuredAt_idx" ON "monitoring_check_results"("status", "measuredAt");

-- CreateIndex
CREATE INDEX "observability_signals_storeId_status_idx" ON "observability_signals"("storeId", "status");

-- CreateIndex
CREATE INDEX "observability_signals_level_status_idx" ON "observability_signals"("level", "status");

-- CreateIndex
CREATE INDEX "observability_signals_subjectType_subjectId_idx" ON "observability_signals"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "observability_signals_detectedAt_idx" ON "observability_signals"("detectedAt");

-- CreateIndex
CREATE INDEX "observability_signal_events_observabilitySignalId_createdAt_idx" ON "observability_signal_events"("observabilitySignalId", "createdAt");

-- CreateIndex
CREATE INDEX "observability_signal_events_actorUserId_idx" ON "observability_signal_events"("actorUserId");

-- CreateIndex
CREATE INDEX "observability_signal_events_eventType_createdAt_idx" ON "observability_signal_events"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "ai_providers_storeId_status_idx" ON "ai_providers"("storeId", "status");

-- CreateIndex
CREATE INDEX "ai_providers_provider_status_idx" ON "ai_providers"("provider", "status");

-- CreateIndex
CREATE INDEX "ai_providers_isEnabled_idx" ON "ai_providers"("isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "ai_providers_storeId_code_key" ON "ai_providers"("storeId", "code");

-- CreateIndex
CREATE INDEX "ai_tasks_storeId_status_idx" ON "ai_tasks"("storeId", "status");

-- CreateIndex
CREATE INDEX "ai_tasks_aiProviderId_status_idx" ON "ai_tasks"("aiProviderId", "status");

-- CreateIndex
CREATE INDEX "ai_tasks_type_status_idx" ON "ai_tasks"("type", "status");

-- CreateIndex
CREATE INDEX "ai_tasks_subjectType_subjectId_idx" ON "ai_tasks"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "ai_tasks_requestedByUserId_idx" ON "ai_tasks"("requestedByUserId");

-- CreateIndex
CREATE INDEX "ai_tasks_startedAt_finishedAt_idx" ON "ai_tasks"("startedAt", "finishedAt");

-- CreateIndex
CREATE INDEX "bundles_storeId_status_idx" ON "bundles"("storeId", "status");

-- CreateIndex
CREATE INDEX "bundles_isFeatured_idx" ON "bundles"("isFeatured");

-- CreateIndex
CREATE INDEX "bundles_primaryImageId_idx" ON "bundles"("primaryImageId");

-- CreateIndex
CREATE UNIQUE INDEX "bundles_storeId_code_key" ON "bundles"("storeId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "bundles_storeId_slug_key" ON "bundles"("storeId", "slug");

-- CreateIndex
CREATE INDEX "bundle_items_bundleId_sortOrder_idx" ON "bundle_items"("bundleId", "sortOrder");

-- CreateIndex
CREATE INDEX "bundle_items_productId_idx" ON "bundle_items"("productId");

-- CreateIndex
CREATE INDEX "bundle_items_variantId_idx" ON "bundle_items"("variantId");

-- CreateIndex
CREATE INDEX "discounts_storeId_status_idx" ON "discounts"("storeId", "status");

-- CreateIndex
CREATE INDEX "discounts_storeId_isAutomatic_idx" ON "discounts"("storeId", "isAutomatic");

-- CreateIndex
CREATE INDEX "discounts_type_status_idx" ON "discounts"("type", "status");

-- CreateIndex
CREATE INDEX "discounts_startsAt_endsAt_idx" ON "discounts"("startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "discounts_storeId_code_key" ON "discounts"("storeId", "code");

-- CreateIndex
CREATE INDEX "discount_codes_status_startsAt_endsAt_idx" ON "discount_codes"("status", "startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "discount_codes_discountId_code_key" ON "discount_codes"("discountId", "code");

-- CreateIndex
CREATE INDEX "discount_redemptions_discountId_redeemedAt_idx" ON "discount_redemptions"("discountId", "redeemedAt");

-- CreateIndex
CREATE INDEX "discount_redemptions_discountCodeId_idx" ON "discount_redemptions"("discountCodeId");

-- CreateIndex
CREATE INDEX "discount_redemptions_orderId_idx" ON "discount_redemptions"("orderId");

-- CreateIndex
CREATE INDEX "discount_redemptions_customerId_redeemedAt_idx" ON "discount_redemptions"("customerId", "redeemedAt");

-- CreateIndex
CREATE INDEX "discount_product_targets_productId_idx" ON "discount_product_targets"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "discount_product_targets_discountId_productId_key" ON "discount_product_targets"("discountId", "productId");

-- CreateIndex
CREATE INDEX "discount_variant_targets_variantId_idx" ON "discount_variant_targets"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "discount_variant_targets_discountId_variantId_key" ON "discount_variant_targets"("discountId", "variantId");

-- CreateIndex
CREATE INDEX "discount_category_targets_categoryId_idx" ON "discount_category_targets"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "discount_category_targets_discountId_categoryId_key" ON "discount_category_targets"("discountId", "categoryId");

-- CreateIndex
CREATE INDEX "documents_storeId_typeCode_status_idx" ON "documents"("storeId", "typeCode", "status");

-- CreateIndex
CREATE INDEX "documents_orderId_idx" ON "documents"("orderId");

-- CreateIndex
CREATE INDEX "documents_issuedAt_idx" ON "documents"("issuedAt");

-- CreateIndex
CREATE UNIQUE INDEX "documents_storeId_documentNumber_key" ON "documents"("storeId", "documentNumber");

-- CreateIndex
CREATE INDEX "document_versions_documentId_status_idx" ON "document_versions"("documentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "document_versions_documentId_versionNumber_key" ON "document_versions"("documentId", "versionNumber");

-- CreateIndex
CREATE INDEX "fulfillments_storeId_status_idx" ON "fulfillments"("storeId", "status");

-- CreateIndex
CREATE INDEX "fulfillments_orderId_status_idx" ON "fulfillments"("orderId", "status");

-- CreateIndex
CREATE INDEX "fulfillments_shipmentId_idx" ON "fulfillments"("shipmentId");

-- CreateIndex
CREATE INDEX "fulfillments_fulfilledAt_idx" ON "fulfillments"("fulfilledAt");

-- CreateIndex
CREATE INDEX "fulfillment_items_orderLineId_idx" ON "fulfillment_items"("orderLineId");

-- CreateIndex
CREATE INDEX "fulfillment_items_status_fulfilledAt_idx" ON "fulfillment_items"("status", "fulfilledAt");

-- CreateIndex
CREATE UNIQUE INDEX "fulfillment_items_fulfillmentId_orderLineId_key" ON "fulfillment_items"("fulfillmentId", "orderLineId");

-- CreateIndex
CREATE INDEX "gift_cards_storeId_status_idx" ON "gift_cards"("storeId", "status");

-- CreateIndex
CREATE INDEX "gift_cards_customerId_idx" ON "gift_cards"("customerId");

-- CreateIndex
CREATE INDEX "gift_cards_purchasedOrderId_idx" ON "gift_cards"("purchasedOrderId");

-- CreateIndex
CREATE INDEX "gift_cards_expiresAt_idx" ON "gift_cards"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "gift_cards_storeId_code_key" ON "gift_cards"("storeId", "code");

-- CreateIndex
CREATE INDEX "gift_card_transactions_giftCardId_createdAt_idx" ON "gift_card_transactions"("giftCardId", "createdAt");

-- CreateIndex
CREATE INDEX "gift_card_transactions_orderId_idx" ON "gift_card_transactions"("orderId");

-- CreateIndex
CREATE INDEX "gift_requests_storeId_status_idx" ON "gift_requests"("storeId", "status");

-- CreateIndex
CREATE INDEX "gift_requests_orderId_idx" ON "gift_requests"("orderId");

-- CreateIndex
CREATE INDEX "gift_requests_customerId_idx" ON "gift_requests"("customerId");

-- CreateIndex
CREATE INDEX "gift_requests_scheduledSendAt_status_idx" ON "gift_requests"("scheduledSendAt", "status");

-- CreateIndex
CREATE INDEX "gift_requests_recipientEmail_idx" ON "gift_requests"("recipientEmail");

-- CreateIndex
CREATE INDEX "gift_request_items_giftRequestId_idx" ON "gift_request_items"("giftRequestId");

-- CreateIndex
CREATE INDEX "gift_request_items_productId_idx" ON "gift_request_items"("productId");

-- CreateIndex
CREATE INDEX "gift_request_items_variantId_idx" ON "gift_request_items"("variantId");

-- CreateIndex
CREATE INDEX "inventory_items_storeId_status_idx" ON "inventory_items"("storeId", "status");

-- CreateIndex
CREATE INDEX "inventory_items_variantId_idx" ON "inventory_items"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_storeId_variantId_key" ON "inventory_items"("storeId", "variantId");

-- CreateIndex
CREATE INDEX "inventory_reservations_inventoryItemId_status_idx" ON "inventory_reservations"("inventoryItemId", "status");

-- CreateIndex
CREATE INDEX "inventory_reservations_inventoryItemId_createdAt_idx" ON "inventory_reservations"("inventoryItemId", "createdAt");

-- CreateIndex
CREATE INDEX "inventory_reservations_cartId_idx" ON "inventory_reservations"("cartId");

-- CreateIndex
CREATE INDEX "inventory_reservations_checkoutId_idx" ON "inventory_reservations"("checkoutId");

-- CreateIndex
CREATE INDEX "inventory_reservations_orderId_idx" ON "inventory_reservations"("orderId");

-- CreateIndex
CREATE INDEX "inventory_reservations_status_expiresAt_idx" ON "inventory_reservations"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "inventory_movements_inventoryItemId_type_idx" ON "inventory_movements"("inventoryItemId", "type");

-- CreateIndex
CREATE INDEX "inventory_movements_inventoryItemId_createdAt_idx" ON "inventory_movements"("inventoryItemId", "createdAt");

-- CreateIndex
CREATE INDEX "inventory_movements_referenceType_referenceId_idx" ON "inventory_movements"("referenceType", "referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_accounts_customerId_key" ON "loyalty_accounts"("customerId");

-- CreateIndex
CREATE INDEX "loyalty_accounts_storeId_status_idx" ON "loyalty_accounts"("storeId", "status");

-- CreateIndex
CREATE INDEX "loyalty_transactions_loyaltyAccountId_createdAt_idx" ON "loyalty_transactions"("loyaltyAccountId", "createdAt");

-- CreateIndex
CREATE INDEX "loyalty_transactions_orderId_idx" ON "loyalty_transactions"("orderId");

-- CreateIndex
CREATE INDEX "payments_storeId_status_idx" ON "payments"("storeId", "status");

-- CreateIndex
CREATE INDEX "payments_orderId_idx" ON "payments"("orderId");

-- CreateIndex
CREATE INDEX "payments_provider_providerReference_idx" ON "payments"("provider", "providerReference");

-- CreateIndex
CREATE INDEX "payments_providerPaymentId_idx" ON "payments"("providerPaymentId");

-- CreateIndex
CREATE INDEX "payment_attempts_paymentId_status_idx" ON "payment_attempts"("paymentId", "status");

-- CreateIndex
CREATE INDEX "payment_attempts_provider_providerReference_idx" ON "payment_attempts"("provider", "providerReference");

-- CreateIndex
CREATE INDEX "payment_attempts_idempotencyKey_idx" ON "payment_attempts"("idempotencyKey");

-- CreateIndex
CREATE INDEX "payment_refunds_paymentId_idx" ON "payment_refunds"("paymentId");

-- CreateIndex
CREATE INDEX "payment_refunds_provider_providerReference_idx" ON "payment_refunds"("provider", "providerReference");

-- CreateIndex
CREATE INDEX "return_requests_storeId_status_idx" ON "return_requests"("storeId", "status");

-- CreateIndex
CREATE INDEX "return_requests_orderId_idx" ON "return_requests"("orderId");

-- CreateIndex
CREATE INDEX "return_requests_customerId_status_idx" ON "return_requests"("customerId", "status");

-- CreateIndex
CREATE INDEX "return_requests_requestedAt_idx" ON "return_requests"("requestedAt");

-- CreateIndex
CREATE UNIQUE INDEX "return_requests_storeId_returnNumber_key" ON "return_requests"("storeId", "returnNumber");

-- CreateIndex
CREATE INDEX "return_items_returnRequestId_idx" ON "return_items"("returnRequestId");

-- CreateIndex
CREATE INDEX "return_items_orderLineId_idx" ON "return_items"("orderLineId");

-- CreateIndex
CREATE INDEX "return_decisions_returnRequestId_createdAt_idx" ON "return_decisions"("returnRequestId", "createdAt");

-- CreateIndex
CREATE INDEX "return_decisions_decidedByUserId_idx" ON "return_decisions"("decidedByUserId");

-- CreateIndex
CREATE INDEX "sales_policies_storeId_status_idx" ON "sales_policies"("storeId", "status");

-- CreateIndex
CREATE INDEX "sales_policies_scopeType_status_idx" ON "sales_policies"("scopeType", "status");

-- CreateIndex
CREATE INDEX "sales_policies_countryCode_idx" ON "sales_policies"("countryCode");

-- CreateIndex
CREATE INDEX "sales_policies_startsAt_endsAt_idx" ON "sales_policies"("startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "sales_policies_storeId_code_key" ON "sales_policies"("storeId", "code");

-- CreateIndex
CREATE INDEX "sellability_decisions_storeId_status_idx" ON "sellability_decisions"("storeId", "status");

-- CreateIndex
CREATE INDEX "sellability_decisions_subjectType_subjectId_idx" ON "sellability_decisions"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "sellability_decisions_salesPolicyId_idx" ON "sellability_decisions"("salesPolicyId");

-- CreateIndex
CREATE INDEX "sellability_decisions_expiresAt_idx" ON "sellability_decisions"("expiresAt");

-- CreateIndex
CREATE INDEX "sales_policy_product_targets_productId_idx" ON "sales_policy_product_targets"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_policy_product_targets_salesPolicyId_productId_key" ON "sales_policy_product_targets"("salesPolicyId", "productId");

-- CreateIndex
CREATE INDEX "sales_policy_variant_targets_variantId_idx" ON "sales_policy_variant_targets"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_policy_variant_targets_salesPolicyId_variantId_key" ON "sales_policy_variant_targets"("salesPolicyId", "variantId");

-- CreateIndex
CREATE INDEX "sales_policy_category_targets_categoryId_idx" ON "sales_policy_category_targets"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_policy_category_targets_salesPolicyId_categoryId_key" ON "sales_policy_category_targets"("salesPolicyId", "categoryId");

-- CreateIndex
CREATE INDEX "shipping_zones_storeId_status_idx" ON "shipping_zones"("storeId", "status");

-- CreateIndex
CREATE INDEX "shipping_zones_sortOrder_idx" ON "shipping_zones"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_zones_storeId_code_key" ON "shipping_zones"("storeId", "code");

-- CreateIndex
CREATE INDEX "shipping_methods_storeId_status_idx" ON "shipping_methods"("storeId", "status");

-- CreateIndex
CREATE INDEX "shipping_methods_shippingZoneId_idx" ON "shipping_methods"("shippingZoneId");

-- CreateIndex
CREATE INDEX "shipping_methods_isDefault_idx" ON "shipping_methods"("isDefault");

-- CreateIndex
CREATE INDEX "shipping_methods_sortOrder_idx" ON "shipping_methods"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_methods_storeId_code_key" ON "shipping_methods"("storeId", "code");

-- CreateIndex
CREATE INDEX "shipments_storeId_status_idx" ON "shipments"("storeId", "status");

-- CreateIndex
CREATE INDEX "shipments_orderId_idx" ON "shipments"("orderId");

-- CreateIndex
CREATE INDEX "shipments_shippingMethodId_idx" ON "shipments"("shippingMethodId");

-- CreateIndex
CREATE INDEX "shipments_trackingNumber_idx" ON "shipments"("trackingNumber");

-- CreateIndex
CREATE INDEX "subscriptions_storeId_status_idx" ON "subscriptions"("storeId", "status");

-- CreateIndex
CREATE INDEX "subscriptions_customerId_status_idx" ON "subscriptions"("customerId", "status");

-- CreateIndex
CREATE INDEX "subscriptions_nextBillingAt_idx" ON "subscriptions"("nextBillingAt");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_storeId_code_key" ON "subscriptions"("storeId", "code");

-- CreateIndex
CREATE INDEX "subscription_items_subscriptionId_status_idx" ON "subscription_items"("subscriptionId", "status");

-- CreateIndex
CREATE INDEX "subscription_items_productId_idx" ON "subscription_items"("productId");

-- CreateIndex
CREATE INDEX "subscription_items_variantId_idx" ON "subscription_items"("variantId");

-- CreateIndex
CREATE INDEX "tax_rules_storeId_status_idx" ON "tax_rules"("storeId", "status");

-- CreateIndex
CREATE INDEX "tax_rules_countryCode_regionCode_status_idx" ON "tax_rules"("countryCode", "regionCode", "status");

-- CreateIndex
CREATE INDEX "tax_rules_scopeType_status_idx" ON "tax_rules"("scopeType", "status");

-- CreateIndex
CREATE INDEX "tax_rules_startsAt_endsAt_idx" ON "tax_rules"("startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "tax_rules_storeId_code_key" ON "tax_rules"("storeId", "code");

-- CreateIndex
CREATE INDEX "tax_rule_product_targets_productId_idx" ON "tax_rule_product_targets"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "tax_rule_product_targets_taxRuleId_productId_key" ON "tax_rule_product_targets"("taxRuleId", "productId");

-- CreateIndex
CREATE INDEX "tax_rule_variant_targets_variantId_idx" ON "tax_rule_variant_targets"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "tax_rule_variant_targets_taxRuleId_variantId_key" ON "tax_rule_variant_targets"("taxRuleId", "variantId");

-- CreateIndex
CREATE INDEX "tax_rule_category_targets_categoryId_idx" ON "tax_rule_category_targets"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "tax_rule_category_targets_taxRuleId_categoryId_key" ON "tax_rule_category_targets"("taxRuleId", "categoryId");

-- CreateIndex
CREATE INDEX "analytics_metrics_storeId_status_idx" ON "analytics_metrics"("storeId", "status");

-- CreateIndex
CREATE INDEX "analytics_metrics_metricType_status_idx" ON "analytics_metrics"("metricType", "status");

-- CreateIndex
CREATE UNIQUE INDEX "analytics_metrics_storeId_code_key" ON "analytics_metrics"("storeId", "code");

-- CreateIndex
CREATE INDEX "analytics_snapshots_analyticsMetricId_status_idx" ON "analytics_snapshots"("analyticsMetricId", "status");

-- CreateIndex
CREATE INDEX "analytics_snapshots_dimensionType_dimensionKey_idx" ON "analytics_snapshots"("dimensionType", "dimensionKey");

-- CreateIndex
CREATE INDEX "analytics_snapshots_periodStart_periodEnd_idx" ON "analytics_snapshots"("periodStart", "periodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "analytics_snapshots_analyticsMetricId_dimensionType_dimensi_key" ON "analytics_snapshots"("analyticsMetricId", "dimensionType", "dimensionKey", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "attribution_models_storeId_status_idx" ON "attribution_models"("storeId", "status");

-- CreateIndex
CREATE INDEX "attribution_models_modelType_status_idx" ON "attribution_models"("modelType", "status");

-- CreateIndex
CREATE UNIQUE INDEX "attribution_models_storeId_code_key" ON "attribution_models"("storeId", "code");

-- CreateIndex
CREATE INDEX "attribution_credits_attributionModelId_idx" ON "attribution_credits"("attributionModelId");

-- CreateIndex
CREATE INDEX "attribution_credits_subjectType_subjectId_idx" ON "attribution_credits"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "attribution_credits_sourceCode_channelCode_campaignCode_idx" ON "attribution_credits"("sourceCode", "channelCode", "campaignCode");

-- CreateIndex
CREATE INDEX "attribution_credits_attributedAt_idx" ON "attribution_credits"("attributedAt");

-- CreateIndex
CREATE INDEX "behavior_segments_storeId_status_idx" ON "behavior_segments"("storeId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "behavior_segments_storeId_code_key" ON "behavior_segments"("storeId", "code");

-- CreateIndex
CREATE INDEX "behavior_profiles_storeId_status_idx" ON "behavior_profiles"("storeId", "status");

-- CreateIndex
CREATE INDEX "behavior_profiles_subjectType_subjectId_idx" ON "behavior_profiles"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "behavior_profiles_computedAt_idx" ON "behavior_profiles"("computedAt");

-- CreateIndex
CREATE UNIQUE INDEX "behavior_profiles_subjectType_subjectId_key" ON "behavior_profiles"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "behavior_profile_segments_behaviorSegmentId_idx" ON "behavior_profile_segments"("behaviorSegmentId");

-- CreateIndex
CREATE UNIQUE INDEX "behavior_profile_segments_behaviorProfileId_behaviorSegment_key" ON "behavior_profile_segments"("behaviorProfileId", "behaviorSegmentId");

-- CreateIndex
CREATE INDEX "conversion_flows_storeId_status_idx" ON "conversion_flows"("storeId", "status");

-- CreateIndex
CREATE INDEX "conversion_flows_type_status_idx" ON "conversion_flows"("type", "status");

-- CreateIndex
CREATE INDEX "conversion_flows_isActive_priority_idx" ON "conversion_flows"("isActive", "priority");

-- CreateIndex
CREATE INDEX "conversion_flows_startsAt_endsAt_idx" ON "conversion_flows"("startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "conversion_flows_storeId_code_key" ON "conversion_flows"("storeId", "code");

-- CreateIndex
CREATE INDEX "conversion_flow_products_conversionFlowId_sortOrder_idx" ON "conversion_flow_products"("conversionFlowId", "sortOrder");

-- CreateIndex
CREATE INDEX "conversion_flow_products_productId_idx" ON "conversion_flow_products"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "conversion_flow_products_conversionFlowId_productId_key" ON "conversion_flow_products"("conversionFlowId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "crm_contacts_customerId_key" ON "crm_contacts"("customerId");

-- CreateIndex
CREATE INDEX "crm_contacts_storeId_status_idx" ON "crm_contacts"("storeId", "status");

-- CreateIndex
CREATE INDEX "crm_contacts_customerId_idx" ON "crm_contacts"("customerId");

-- CreateIndex
CREATE INDEX "crm_contacts_lifecycleStage_idx" ON "crm_contacts"("lifecycleStage");

-- CreateIndex
CREATE UNIQUE INDEX "crm_contacts_storeId_customerId_key" ON "crm_contacts"("storeId", "customerId");

-- CreateIndex
CREATE INDEX "crm_tags_storeId_status_idx" ON "crm_tags"("storeId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "crm_tags_storeId_code_key" ON "crm_tags"("storeId", "code");

-- CreateIndex
CREATE INDEX "crm_contact_tags_crmTagId_idx" ON "crm_contact_tags"("crmTagId");

-- CreateIndex
CREATE UNIQUE INDEX "crm_contact_tags_crmContactId_crmTagId_key" ON "crm_contact_tags"("crmContactId", "crmTagId");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_storeId_status_idx" ON "newsletter_subscribers"("storeId", "status");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_customerId_status_idx" ON "newsletter_subscribers"("customerId", "status");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_subscribedAt_idx" ON "newsletter_subscribers"("subscribedAt");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_storeId_email_key" ON "newsletter_subscribers"("storeId", "email");

-- CreateIndex
CREATE INDEX "newsletter_campaigns_storeId_status_idx" ON "newsletter_campaigns"("storeId", "status");

-- CreateIndex
CREATE INDEX "newsletter_campaigns_createdByUserId_idx" ON "newsletter_campaigns"("createdByUserId");

-- CreateIndex
CREATE INDEX "newsletter_campaigns_scheduledAt_status_idx" ON "newsletter_campaigns"("scheduledAt", "status");

-- CreateIndex
CREATE INDEX "newsletter_campaigns_provider_providerReference_idx" ON "newsletter_campaigns"("provider", "providerReference");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_campaigns_storeId_code_key" ON "newsletter_campaigns"("storeId", "code");

-- CreateIndex
CREATE INDEX "newsletter_campaign_recipients_newsletterSubscriberId_idx" ON "newsletter_campaign_recipients"("newsletterSubscriberId");

-- CreateIndex
CREATE INDEX "newsletter_campaign_recipients_sentAt_idx" ON "newsletter_campaign_recipients"("sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_campaign_recipients_newsletterCampaignId_newslet_key" ON "newsletter_campaign_recipients"("newsletterCampaignId", "newsletterSubscriberId");

-- CreateIndex
CREATE INDEX "public_events_storeId_status_idx" ON "public_events"("storeId", "status");

-- CreateIndex
CREATE INDEX "public_events_startsAt_endsAt_idx" ON "public_events"("startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "public_events_audienceStatus_idx" ON "public_events"("audienceStatus");

-- CreateIndex
CREATE INDEX "public_events_primaryImageId_idx" ON "public_events"("primaryImageId");

-- CreateIndex
CREATE INDEX "public_events_coverImageId_idx" ON "public_events"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "public_events_storeId_code_key" ON "public_events"("storeId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "public_events_storeId_slug_key" ON "public_events"("storeId", "slug");

-- CreateIndex
CREATE INDEX "event_registrations_publicEventId_status_idx" ON "event_registrations"("publicEventId", "status");

-- CreateIndex
CREATE INDEX "event_registrations_customerId_idx" ON "event_registrations"("customerId");

-- CreateIndex
CREATE INDEX "event_registrations_registeredAt_idx" ON "event_registrations"("registeredAt");

-- CreateIndex
CREATE INDEX "event_reservations_publicEventId_status_idx" ON "event_reservations"("publicEventId", "status");

-- CreateIndex
CREATE INDEX "event_reservations_customerId_idx" ON "event_reservations"("customerId");

-- CreateIndex
CREATE INDEX "event_reservations_reservedAt_idx" ON "event_reservations"("reservedAt");

-- CreateIndex
CREATE INDEX "recommendation_rules_storeId_status_idx" ON "recommendation_rules"("storeId", "status");

-- CreateIndex
CREATE INDEX "recommendation_rules_isActive_priority_idx" ON "recommendation_rules"("isActive", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "recommendation_rules_storeId_code_key" ON "recommendation_rules"("storeId", "code");

-- CreateIndex
CREATE INDEX "recommendation_links_sourceType_sourceId_sortOrder_idx" ON "recommendation_links"("sourceType", "sourceId", "sortOrder");

-- CreateIndex
CREATE INDEX "recommendation_links_targetType_targetId_idx" ON "recommendation_links"("targetType", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "recommendation_links_recommendationRuleId_sourceType_source_key" ON "recommendation_links"("recommendationRuleId", "sourceType", "sourceId", "targetType", "targetId");

-- CreateIndex
CREATE INDEX "social_publications_storeId_status_idx" ON "social_publications"("storeId", "status");

-- CreateIndex
CREATE INDEX "social_publications_subjectType_subjectId_idx" ON "social_publications"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "social_publications_channelCode_status_idx" ON "social_publications"("channelCode", "status");

-- CreateIndex
CREATE INDEX "social_publications_scheduledAt_status_idx" ON "social_publications"("scheduledAt", "status");

-- CreateIndex
CREATE INDEX "social_publications_createdByUserId_idx" ON "social_publications"("createdByUserId");

-- CreateIndex
CREATE INDEX "social_publications_provider_providerReference_idx" ON "social_publications"("provider", "providerReference");

-- CreateIndex
CREATE INDEX "social_publication_assets_socialPublicationId_sortOrder_idx" ON "social_publication_assets"("socialPublicationId", "sortOrder");

-- CreateIndex
CREATE INDEX "social_publication_assets_mediaAssetId_idx" ON "social_publication_assets"("mediaAssetId");

-- CreateIndex
CREATE UNIQUE INDEX "social_publication_assets_socialPublicationId_mediaAssetId_key" ON "social_publication_assets"("socialPublicationId", "mediaAssetId");

-- CreateIndex
CREATE INDEX "support_tickets_storeId_status_idx" ON "support_tickets"("storeId", "status");

-- CreateIndex
CREATE INDEX "support_tickets_customerId_status_idx" ON "support_tickets"("customerId", "status");

-- CreateIndex
CREATE INDEX "support_tickets_orderId_idx" ON "support_tickets"("orderId");

-- CreateIndex
CREATE INDEX "support_tickets_assignedToUserId_status_idx" ON "support_tickets"("assignedToUserId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "support_tickets_storeId_ticketNumber_key" ON "support_tickets"("storeId", "ticketNumber");

-- CreateIndex
CREATE INDEX "support_messages_supportTicketId_createdAt_idx" ON "support_messages"("supportTicketId", "createdAt");

-- CreateIndex
CREATE INDEX "support_messages_authorUserId_idx" ON "support_messages"("authorUserId");

-- CreateIndex
CREATE INDEX "support_messages_authorCustomerId_idx" ON "support_messages"("authorCustomerId");

-- CreateIndex
CREATE INDEX "approval_requests_storeId_status_idx" ON "approval_requests"("storeId", "status");

-- CreateIndex
CREATE INDEX "approval_requests_subjectType_subjectId_idx" ON "approval_requests"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "approval_requests_requestedByUserId_status_idx" ON "approval_requests"("requestedByUserId", "status");

-- CreateIndex
CREATE INDEX "approval_requests_policyCode_idx" ON "approval_requests"("policyCode");

-- CreateIndex
CREATE INDEX "approval_requests_expiresAt_idx" ON "approval_requests"("expiresAt");

-- CreateIndex
CREATE INDEX "approval_decisions_approvalRequestId_createdAt_idx" ON "approval_decisions"("approvalRequestId", "createdAt");

-- CreateIndex
CREATE INDEX "approval_decisions_decidedByUserId_idx" ON "approval_decisions"("decidedByUserId");

-- CreateIndex
CREATE INDEX "approval_decisions_type_createdAt_idx" ON "approval_decisions"("type", "createdAt");

-- CreateIndex
CREATE INDEX "consent_purposes_storeId_isActive_idx" ON "consent_purposes"("storeId", "isActive");

-- CreateIndex
CREATE INDEX "consent_purposes_isRequired_isActive_idx" ON "consent_purposes"("isRequired", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "consent_purposes_storeId_code_key" ON "consent_purposes"("storeId", "code");

-- CreateIndex
CREATE INDEX "consent_records_storeId_status_idx" ON "consent_records"("storeId", "status");

-- CreateIndex
CREATE INDEX "consent_records_subjectType_subjectId_idx" ON "consent_records"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "consent_records_purposeId_status_idx" ON "consent_records"("purposeId", "status");

-- CreateIndex
CREATE INDEX "consent_records_expiresAt_idx" ON "consent_records"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "consent_records_subjectType_subjectId_purposeId_key" ON "consent_records"("subjectType", "subjectId", "purposeId");

-- CreateIndex
CREATE INDEX "email_messages_storeId_status_idx" ON "email_messages"("storeId", "status");

-- CreateIndex
CREATE INDEX "email_messages_category_status_idx" ON "email_messages"("category", "status");

-- CreateIndex
CREATE INDEX "email_messages_subjectType_subjectId_idx" ON "email_messages"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "email_messages_provider_providerReference_idx" ON "email_messages"("provider", "providerReference");

-- CreateIndex
CREATE INDEX "email_recipients_emailMessageId_type_idx" ON "email_recipients"("emailMessageId", "type");

-- CreateIndex
CREATE INDEX "email_recipients_email_idx" ON "email_recipients"("email");

-- CreateIndex
CREATE INDEX "export_definitions_storeId_isActive_idx" ON "export_definitions"("storeId", "isActive");

-- CreateIndex
CREATE INDEX "export_definitions_sourceType_formatCode_idx" ON "export_definitions"("sourceType", "formatCode");

-- CreateIndex
CREATE UNIQUE INDEX "export_definitions_storeId_code_key" ON "export_definitions"("storeId", "code");

-- CreateIndex
CREATE INDEX "export_requests_storeId_status_idx" ON "export_requests"("storeId", "status");

-- CreateIndex
CREATE INDEX "export_requests_exportDefinitionId_status_idx" ON "export_requests"("exportDefinitionId", "status");

-- CreateIndex
CREATE INDEX "export_requests_requestedByUserId_idx" ON "export_requests"("requestedByUserId");

-- CreateIndex
CREATE INDEX "export_requests_scopeType_scopeId_idx" ON "export_requests"("scopeType", "scopeId");

-- CreateIndex
CREATE INDEX "export_requests_expiresAt_idx" ON "export_requests"("expiresAt");

-- CreateIndex
CREATE INDEX "export_artifacts_exportRequestId_kind_idx" ON "export_artifacts"("exportRequestId", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "export_artifacts_exportRequestId_code_key" ON "export_artifacts"("exportRequestId", "code");

-- CreateIndex
CREATE INDEX "fraud_risk_assessments_storeId_level_idx" ON "fraud_risk_assessments"("storeId", "level");

-- CreateIndex
CREATE INDEX "fraud_risk_assessments_subjectType_subjectId_idx" ON "fraud_risk_assessments"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "fraud_risk_assessments_decisionType_level_idx" ON "fraud_risk_assessments"("decisionType", "level");

-- CreateIndex
CREATE INDEX "fraud_risk_assessments_expiresAt_idx" ON "fraud_risk_assessments"("expiresAt");

-- CreateIndex
CREATE INDEX "fraud_risk_decisions_fraudRiskAssessmentId_createdAt_idx" ON "fraud_risk_decisions"("fraudRiskAssessmentId", "createdAt");

-- CreateIndex
CREATE INDEX "fraud_risk_decisions_decidedByUserId_idx" ON "fraud_risk_decisions"("decidedByUserId");

-- CreateIndex
CREATE INDEX "fraud_risk_decisions_type_createdAt_idx" ON "fraud_risk_decisions"("type", "createdAt");

-- CreateIndex
CREATE INDEX "fraud_risk_reviews_fraudRiskAssessmentId_status_idx" ON "fraud_risk_reviews"("fraudRiskAssessmentId", "status");

-- CreateIndex
CREATE INDEX "fraud_risk_reviews_assignedToUserId_status_idx" ON "fraud_risk_reviews"("assignedToUserId", "status");

-- CreateIndex
CREATE INDEX "fraud_risk_reviews_openedAt_resolvedAt_idx" ON "fraud_risk_reviews"("openedAt", "resolvedAt");

-- CreateIndex
CREATE INDEX "import_definitions_storeId_isActive_idx" ON "import_definitions"("storeId", "isActive");

-- CreateIndex
CREATE INDEX "import_definitions_targetType_formatCode_idx" ON "import_definitions"("targetType", "formatCode");

-- CreateIndex
CREATE UNIQUE INDEX "import_definitions_storeId_code_key" ON "import_definitions"("storeId", "code");

-- CreateIndex
CREATE INDEX "import_requests_storeId_status_idx" ON "import_requests"("storeId", "status");

-- CreateIndex
CREATE INDEX "import_requests_importDefinitionId_status_idx" ON "import_requests"("importDefinitionId", "status");

-- CreateIndex
CREATE INDEX "import_requests_requestedByUserId_idx" ON "import_requests"("requestedByUserId");

-- CreateIndex
CREATE INDEX "import_requests_scopeType_scopeId_idx" ON "import_requests"("scopeType", "scopeId");

-- CreateIndex
CREATE INDEX "import_requests_expiresAt_idx" ON "import_requests"("expiresAt");

-- CreateIndex
CREATE INDEX "import_artifacts_importRequestId_kind_idx" ON "import_artifacts"("importRequestId", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "import_artifacts_importRequestId_code_key" ON "import_artifacts"("importRequestId", "code");

-- CreateIndex
CREATE INDEX "integrations_storeId_status_idx" ON "integrations"("storeId", "status");

-- CreateIndex
CREATE INDEX "integrations_type_provider_idx" ON "integrations"("type", "provider");

-- CreateIndex
CREATE INDEX "integrations_isEnabled_isSandbox_idx" ON "integrations"("isEnabled", "isSandbox");

-- CreateIndex
CREATE UNIQUE INDEX "integrations_storeId_code_key" ON "integrations"("storeId", "code");

-- CreateIndex
CREATE INDEX "integration_credentials_integrationId_status_idx" ON "integration_credentials"("integrationId", "status");

-- CreateIndex
CREATE INDEX "integration_credentials_expiresAt_idx" ON "integration_credentials"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "integration_credentials_integrationId_key_key" ON "integration_credentials"("integrationId", "key");

-- CreateIndex
CREATE INDEX "integration_sync_states_integrationId_status_idx" ON "integration_sync_states"("integrationId", "status");

-- CreateIndex
CREATE INDEX "integration_sync_states_scopeType_scopeId_idx" ON "integration_sync_states"("scopeType", "scopeId");

-- CreateIndex
CREATE INDEX "integration_sync_states_lastJobId_idx" ON "integration_sync_states"("lastJobId");

-- CreateIndex
CREATE UNIQUE INDEX "integration_sync_states_integrationId_scopeType_scopeId_key" ON "integration_sync_states"("integrationId", "scopeType", "scopeId");

-- CreateIndex
CREATE INDEX "localization_locales_storeId_status_idx" ON "localization_locales"("storeId", "status");

-- CreateIndex
CREATE INDEX "localization_locales_storeId_isDefault_idx" ON "localization_locales"("storeId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "localization_locales_storeId_code_key" ON "localization_locales"("storeId", "code");

-- CreateIndex
CREATE INDEX "localized_values_storeId_status_idx" ON "localized_values"("storeId", "status");

-- CreateIndex
CREATE INDEX "localized_values_subjectType_subjectId_idx" ON "localized_values"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "localized_values_fieldName_idx" ON "localized_values"("fieldName");

-- CreateIndex
CREATE INDEX "localized_values_localeId_status_idx" ON "localized_values"("localeId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "localized_values_subjectType_subjectId_fieldName_localeId_key" ON "localized_values"("subjectType", "subjectId", "fieldName", "localeId");

-- CreateIndex
CREATE INDEX "notifications_storeId_status_idx" ON "notifications"("storeId", "status");

-- CreateIndex
CREATE INDEX "notifications_recipientType_status_idx" ON "notifications"("recipientType", "status");

-- CreateIndex
CREATE INDEX "notifications_recipientUserId_status_idx" ON "notifications"("recipientUserId", "status");

-- CreateIndex
CREATE INDEX "notifications_recipientCustomerId_status_idx" ON "notifications"("recipientCustomerId", "status");

-- CreateIndex
CREATE INDEX "notifications_channel_status_idx" ON "notifications"("channel", "status");

-- CreateIndex
CREATE INDEX "notifications_subjectType_subjectId_idx" ON "notifications"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "notification_preferences_storeId_idx" ON "notification_preferences"("storeId");

-- CreateIndex
CREATE INDEX "notification_preferences_recipientUserId_channel_idx" ON "notification_preferences"("recipientUserId", "channel");

-- CreateIndex
CREATE INDEX "notification_preferences_recipientCustomerId_channel_idx" ON "notification_preferences"("recipientCustomerId", "channel");

-- CreateIndex
CREATE INDEX "notification_preferences_topic_channel_idx" ON "notification_preferences"("topic", "channel");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_recipientKey_channel_topic_key" ON "notification_preferences"("recipientKey", "channel", "topic");

-- CreateIndex
CREATE INDEX "schedule_plans_storeId_status_idx" ON "schedule_plans"("storeId", "status");

-- CreateIndex
CREATE INDEX "schedule_plans_subjectType_subjectId_idx" ON "schedule_plans"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "schedule_plans_createdByUserId_idx" ON "schedule_plans"("createdByUserId");

-- CreateIndex
CREATE INDEX "schedule_plans_startsAt_endsAt_idx" ON "schedule_plans"("startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "schedule_windows_schedulePlanId_isActive_idx" ON "schedule_windows"("schedulePlanId", "isActive");

-- CreateIndex
CREATE INDEX "schedule_windows_startsAt_endsAt_idx" ON "schedule_windows"("startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "schedule_occurrences_schedulePlanId_isActive_idx" ON "schedule_occurrences"("schedulePlanId", "isActive");

-- CreateIndex
CREATE INDEX "schedule_occurrences_scheduledFor_idx" ON "schedule_occurrences"("scheduledFor");

-- CreateIndex
CREATE INDEX "schedule_occurrences_executedAt_idx" ON "schedule_occurrences"("executedAt");

-- CreateIndex
CREATE INDEX "webhook_endpoints_integrationId_idx" ON "webhook_endpoints"("integrationId");

-- CreateIndex
CREATE INDEX "webhook_endpoints_storeId_status_idx" ON "webhook_endpoints"("storeId", "status");

-- CreateIndex
CREATE INDEX "webhook_endpoints_eventType_status_idx" ON "webhook_endpoints"("eventType", "status");

-- CreateIndex
CREATE INDEX "webhook_endpoints_isEnabled_idx" ON "webhook_endpoints"("isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_endpoints_storeId_code_key" ON "webhook_endpoints"("storeId", "code");

-- CreateIndex
CREATE INDEX "webhook_deliveries_webhookEndpointId_status_idx" ON "webhook_deliveries"("webhookEndpointId", "status");

-- CreateIndex
CREATE INDEX "webhook_deliveries_eventType_eventId_idx" ON "webhook_deliveries"("eventType", "eventId");

-- CreateIndex
CREATE INDEX "webhook_deliveries_idempotencyKey_idx" ON "webhook_deliveries"("idempotencyKey");

-- CreateIndex
CREATE INDEX "webhook_deliveries_scheduledAt_status_idx" ON "webhook_deliveries"("scheduledAt", "status");

-- CreateIndex
CREATE INDEX "webhook_deliveries_finishedAt_idx" ON "webhook_deliveries"("finishedAt");

-- CreateIndex
CREATE INDEX "workflow_definitions_storeId_status_idx" ON "workflow_definitions"("storeId", "status");

-- CreateIndex
CREATE INDEX "workflow_definitions_subjectType_status_idx" ON "workflow_definitions"("subjectType", "status");

-- CreateIndex
CREATE INDEX "workflow_definitions_isDefault_idx" ON "workflow_definitions"("isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_definitions_storeId_code_version_key" ON "workflow_definitions"("storeId", "code", "version");

-- CreateIndex
CREATE INDEX "workflow_definition_steps_workflowDefinitionId_sortOrder_idx" ON "workflow_definition_steps"("workflowDefinitionId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_definition_steps_workflowDefinitionId_code_key" ON "workflow_definition_steps"("workflowDefinitionId", "code");

-- CreateIndex
CREATE INDEX "workflow_instances_storeId_status_idx" ON "workflow_instances"("storeId", "status");

-- CreateIndex
CREATE INDEX "workflow_instances_workflowDefinitionId_status_idx" ON "workflow_instances"("workflowDefinitionId", "status");

-- CreateIndex
CREATE INDEX "workflow_instances_subjectType_subjectId_idx" ON "workflow_instances"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "workflow_instances_createdByUserId_idx" ON "workflow_instances"("createdByUserId");

-- CreateIndex
CREATE INDEX "workflow_step_instances_workflowInstanceId_status_idx" ON "workflow_step_instances"("workflowInstanceId", "status");

-- CreateIndex
CREATE INDEX "workflow_step_instances_workflowDefinitionStepId_status_idx" ON "workflow_step_instances"("workflowDefinitionStepId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_step_instances_workflowInstanceId_workflowDefiniti_key" ON "workflow_step_instances"("workflowInstanceId", "workflowDefinitionStepId");

-- CreateIndex
CREATE INDEX "channels_storeId_status_idx" ON "channels"("storeId", "status");

-- CreateIndex
CREATE INDEX "channels_type_status_idx" ON "channels"("type", "status");

-- CreateIndex
CREATE INDEX "channels_isEnabled_idx" ON "channels"("isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "channels_storeId_code_key" ON "channels"("storeId", "code");

-- CreateIndex
CREATE INDEX "channel_product_statuses_productId_publicationStatus_idx" ON "channel_product_statuses"("productId", "publicationStatus");

-- CreateIndex
CREATE INDEX "channel_product_statuses_channelId_publicationStatus_idx" ON "channel_product_statuses"("channelId", "publicationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "channel_product_statuses_channelId_productId_key" ON "channel_product_statuses"("channelId", "productId");

-- CreateIndex
CREATE INDEX "channel_variant_statuses_variantId_publicationStatus_idx" ON "channel_variant_statuses"("variantId", "publicationStatus");

-- CreateIndex
CREATE INDEX "channel_variant_statuses_channelId_publicationStatus_idx" ON "channel_variant_statuses"("channelId", "publicationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "channel_variant_statuses_channelId_variantId_key" ON "channel_variant_statuses"("channelId", "variantId");

-- CreateIndex
CREATE INDEX "search_documents_storeId_status_idx" ON "search_documents"("storeId", "status");

-- CreateIndex
CREATE INDEX "search_documents_subjectType_subjectId_idx" ON "search_documents"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "search_documents_localeCode_idx" ON "search_documents"("localeCode");

-- CreateIndex
CREATE INDEX "search_documents_publishedAt_idx" ON "search_documents"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "search_documents_storeId_subjectType_subjectId_localeCode_key" ON "search_documents"("storeId", "subjectType", "subjectId", "localeCode");

-- AddForeignKey
ALTER TABLE "availability_records" ADD CONSTRAINT "availability_records_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_records" ADD CONSTRAINT "availability_records_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_policies" ADD CONSTRAINT "availability_policies_availabilityRecordId_fkey" FOREIGN KEY ("availabilityRecordId") REFERENCES "availability_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_overrides" ADD CONSTRAINT "availability_overrides_availabilityRecordId_fkey" FOREIGN KEY ("availabilityRecordId") REFERENCES "availability_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_primaryImageId_fkey" FOREIGN KEY ("primaryImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_variants" ADD CONSTRAINT "media_variants_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_references" ADD CONSTRAINT "media_references_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_lists" ADD CONSTRAINT "price_lists_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES "price_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_prices" ADD CONSTRAINT "product_variant_prices_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_prices" ADD CONSTRAINT "product_variant_prices_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES "price_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_types" ADD CONSTRAINT "product_types_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_characteristics" ADD CONSTRAINT "product_characteristics_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "product_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_primaryImageId_fkey" FOREIGN KEY ("primaryImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_primaryImageId_fkey" FOREIGN KEY ("primaryImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "product_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_option_values" ADD CONSTRAINT "product_option_values_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "product_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_option_values" ADD CONSTRAINT "product_variant_option_values_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_option_values" ADD CONSTRAINT "product_variant_option_values_optionValueId_fkey" FOREIGN KEY ("optionValueId") REFERENCES "product_option_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "related_products" ADD CONSTRAINT "related_products_sourceProductId_fkey" FOREIGN KEY ("sourceProductId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "related_products" ADD CONSTRAINT "related_products_targetProductId_fkey" FOREIGN KEY ("targetProductId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_lines" ADD CONSTRAINT "cart_lines_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_lines" ADD CONSTRAINT "cart_lines_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_lines" ADD CONSTRAINT "cart_lines_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_lines" ADD CONSTRAINT "checkout_lines_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "checkouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_lines" ADD CONSTRAINT "checkout_lines_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_lines" ADD CONSTRAINT "checkout_lines_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_addresses" ADD CONSTRAINT "checkout_addresses_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "checkouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_shipping_selections" ADD CONSTRAINT "checkout_shipping_selections_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "checkouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_shipping_selections" ADD CONSTRAINT "checkout_shipping_selections_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "shipping_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_contact_preferences" ADD CONSTRAINT "customer_contact_preferences_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "checkouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_addresses" ADD CONSTRAINT "order_addresses_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_shipping_selections" ADD CONSTRAINT "order_shipping_selections_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_shipping_selections" ADD CONSTRAINT "order_shipping_selections_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "shipping_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_primaryImageId_fkey" FOREIGN KEY ("primaryImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_primaryImageId_fkey" FOREIGN KEY ("primaryImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post_categories" ADD CONSTRAINT "blog_post_categories_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post_categories" ADD CONSTRAINT "blog_post_categories_blogCategoryId_fkey" FOREIGN KEY ("blogCategoryId") REFERENCES "blog_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepages" ADD CONSTRAINT "homepages_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_sections" ADD CONSTRAINT "homepage_sections_homepageId_fkey" FOREIGN KEY ("homepageId") REFERENCES "homepages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_sections" ADD CONSTRAINT "homepage_sections_primaryImageId_fkey" FOREIGN KEY ("primaryImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_sections" ADD CONSTRAINT "homepage_sections_secondaryImageId_fkey" FOREIGN KEY ("secondaryImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_featured_products" ADD CONSTRAINT "homepage_featured_products_homepageSectionId_fkey" FOREIGN KEY ("homepageSectionId") REFERENCES "homepage_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_featured_products" ADD CONSTRAINT "homepage_featured_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_featured_categories" ADD CONSTRAINT "homepage_featured_categories_homepageSectionId_fkey" FOREIGN KEY ("homepageSectionId") REFERENCES "homepage_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_featured_categories" ADD CONSTRAINT "homepage_featured_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_featured_blog_posts" ADD CONSTRAINT "homepage_featured_blog_posts_homepageSectionId_fkey" FOREIGN KEY ("homepageSectionId") REFERENCES "homepage_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_featured_blog_posts" ADD CONSTRAINT "homepage_featured_blog_posts_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_primaryImageId_fkey" FOREIGN KEY ("primaryImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_primaryImageId_fkey" FOREIGN KEY ("primaryImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_blocks" ADD CONSTRAINT "page_blocks_pageSectionId_fkey" FOREIGN KEY ("pageSectionId") REFERENCES "page_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_blocks" ADD CONSTRAINT "page_blocks_primaryImageId_fkey" FOREIGN KEY ("primaryImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_blocks" ADD CONSTRAINT "page_blocks_secondaryImageId_fkey" FOREIGN KEY ("secondaryImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_openGraphImageId_fkey" FOREIGN KEY ("openGraphImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_twitterImageId_fkey" FOREIGN KEY ("twitterImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_clients" ADD CONSTRAINT "api_clients_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_client_secrets" ADD CONSTRAINT "api_client_secrets_apiClientId_fkey" FOREIGN KEY ("apiClientId") REFERENCES "api_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_client_permissions" ADD CONSTRAINT "api_client_permissions_apiClientId_fkey" FOREIGN KEY ("apiClientId") REFERENCES "api_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_client_permissions" ADD CONSTRAINT "api_client_permissions_grantedByUserId_fkey" FOREIGN KEY ("grantedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assignedByUserId_fkey" FOREIGN KEY ("assignedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_grantedByUserId_fkey" FOREIGN KEY ("grantedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_domains" ADD CONSTRAINT "store_domains_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorApiClientId_fkey" FOREIGN KEY ("actorApiClientId") REFERENCES "api_clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log_changes" ADD CONSTRAINT "audit_log_changes_auditLogId_fkey" FOREIGN KEY ("auditLogId") REFERENCES "audit_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domain_events" ADD CONSTRAINT "domain_events_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domain_event_deliveries" ADD CONSTRAINT "domain_event_deliveries_domainEventId_fkey" FOREIGN KEY ("domainEventId") REFERENCES "domain_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_flag_overrides" ADD CONSTRAINT "feature_flag_overrides_featureFlagId_fkey" FOREIGN KEY ("featureFlagId") REFERENCES "feature_flags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_flag_overrides" ADD CONSTRAINT "feature_flag_overrides_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_attempts" ADD CONSTRAINT "job_attempts_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoring_checks" ADD CONSTRAINT "monitoring_checks_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoring_check_results" ADD CONSTRAINT "monitoring_check_results_monitoringCheckId_fkey" FOREIGN KEY ("monitoringCheckId") REFERENCES "monitoring_checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observability_signals" ADD CONSTRAINT "observability_signals_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observability_signal_events" ADD CONSTRAINT "observability_signal_events_observabilitySignalId_fkey" FOREIGN KEY ("observabilitySignalId") REFERENCES "observability_signals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observability_signal_events" ADD CONSTRAINT "observability_signal_events_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_providers" ADD CONSTRAINT "ai_providers_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_tasks" ADD CONSTRAINT "ai_tasks_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_tasks" ADD CONSTRAINT "ai_tasks_aiProviderId_fkey" FOREIGN KEY ("aiProviderId") REFERENCES "ai_providers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_tasks" ADD CONSTRAINT "ai_tasks_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundles" ADD CONSTRAINT "bundles_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundles" ADD CONSTRAINT "bundles_primaryImageId_fkey" FOREIGN KEY ("primaryImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_codes" ADD CONSTRAINT "discount_codes_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_redemptions" ADD CONSTRAINT "discount_redemptions_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_redemptions" ADD CONSTRAINT "discount_redemptions_discountCodeId_fkey" FOREIGN KEY ("discountCodeId") REFERENCES "discount_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_redemptions" ADD CONSTRAINT "discount_redemptions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_redemptions" ADD CONSTRAINT "discount_redemptions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_product_targets" ADD CONSTRAINT "discount_product_targets_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_product_targets" ADD CONSTRAINT "discount_product_targets_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_variant_targets" ADD CONSTRAINT "discount_variant_targets_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_variant_targets" ADD CONSTRAINT "discount_variant_targets_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_category_targets" ADD CONSTRAINT "discount_category_targets_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_category_targets" ADD CONSTRAINT "discount_category_targets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fulfillments" ADD CONSTRAINT "fulfillments_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fulfillments" ADD CONSTRAINT "fulfillments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fulfillments" ADD CONSTRAINT "fulfillments_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fulfillment_items" ADD CONSTRAINT "fulfillment_items_fulfillmentId_fkey" FOREIGN KEY ("fulfillmentId") REFERENCES "fulfillments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fulfillment_items" ADD CONSTRAINT "fulfillment_items_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "order_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_purchasedOrderId_fkey" FOREIGN KEY ("purchasedOrderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_card_transactions" ADD CONSTRAINT "gift_card_transactions_giftCardId_fkey" FOREIGN KEY ("giftCardId") REFERENCES "gift_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_card_transactions" ADD CONSTRAINT "gift_card_transactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_requests" ADD CONSTRAINT "gift_requests_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_requests" ADD CONSTRAINT "gift_requests_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_requests" ADD CONSTRAINT "gift_requests_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_request_items" ADD CONSTRAINT "gift_request_items_giftRequestId_fkey" FOREIGN KEY ("giftRequestId") REFERENCES "gift_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_request_items" ADD CONSTRAINT "gift_request_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_request_items" ADD CONSTRAINT "gift_request_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_reservations" ADD CONSTRAINT "inventory_reservations_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_reservations" ADD CONSTRAINT "inventory_reservations_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_reservations" ADD CONSTRAINT "inventory_reservations_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "checkouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_reservations" ADD CONSTRAINT "inventory_reservations_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_reservations" ADD CONSTRAINT "inventory_reservations_cartLineId_fkey" FOREIGN KEY ("cartLineId") REFERENCES "cart_lines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_accounts" ADD CONSTRAINT "loyalty_accounts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_accounts" ADD CONSTRAINT "loyalty_accounts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_loyaltyAccountId_fkey" FOREIGN KEY ("loyaltyAccountId") REFERENCES "loyalty_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_attempts" ADD CONSTRAINT "payment_attempts_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_returnRequestId_fkey" FOREIGN KEY ("returnRequestId") REFERENCES "return_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "order_lines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_decisions" ADD CONSTRAINT "return_decisions_returnRequestId_fkey" FOREIGN KEY ("returnRequestId") REFERENCES "return_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_decisions" ADD CONSTRAINT "return_decisions_decidedByUserId_fkey" FOREIGN KEY ("decidedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_policies" ADD CONSTRAINT "sales_policies_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellability_decisions" ADD CONSTRAINT "sellability_decisions_salesPolicyId_fkey" FOREIGN KEY ("salesPolicyId") REFERENCES "sales_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellability_decisions" ADD CONSTRAINT "sellability_decisions_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_policy_product_targets" ADD CONSTRAINT "sales_policy_product_targets_salesPolicyId_fkey" FOREIGN KEY ("salesPolicyId") REFERENCES "sales_policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_policy_product_targets" ADD CONSTRAINT "sales_policy_product_targets_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_policy_variant_targets" ADD CONSTRAINT "sales_policy_variant_targets_salesPolicyId_fkey" FOREIGN KEY ("salesPolicyId") REFERENCES "sales_policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_policy_variant_targets" ADD CONSTRAINT "sales_policy_variant_targets_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_policy_category_targets" ADD CONSTRAINT "sales_policy_category_targets_salesPolicyId_fkey" FOREIGN KEY ("salesPolicyId") REFERENCES "sales_policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_policy_category_targets" ADD CONSTRAINT "sales_policy_category_targets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_zones" ADD CONSTRAINT "shipping_zones_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_methods" ADD CONSTRAINT "shipping_methods_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_methods" ADD CONSTRAINT "shipping_methods_shippingZoneId_fkey" FOREIGN KEY ("shippingZoneId") REFERENCES "shipping_zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "shipping_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_items" ADD CONSTRAINT "subscription_items_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_items" ADD CONSTRAINT "subscription_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_items" ADD CONSTRAINT "subscription_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_rules" ADD CONSTRAINT "tax_rules_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_rule_product_targets" ADD CONSTRAINT "tax_rule_product_targets_taxRuleId_fkey" FOREIGN KEY ("taxRuleId") REFERENCES "tax_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_rule_product_targets" ADD CONSTRAINT "tax_rule_product_targets_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_rule_variant_targets" ADD CONSTRAINT "tax_rule_variant_targets_taxRuleId_fkey" FOREIGN KEY ("taxRuleId") REFERENCES "tax_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_rule_variant_targets" ADD CONSTRAINT "tax_rule_variant_targets_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_rule_category_targets" ADD CONSTRAINT "tax_rule_category_targets_taxRuleId_fkey" FOREIGN KEY ("taxRuleId") REFERENCES "tax_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_rule_category_targets" ADD CONSTRAINT "tax_rule_category_targets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_metrics" ADD CONSTRAINT "analytics_metrics_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_snapshots" ADD CONSTRAINT "analytics_snapshots_analyticsMetricId_fkey" FOREIGN KEY ("analyticsMetricId") REFERENCES "analytics_metrics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribution_models" ADD CONSTRAINT "attribution_models_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribution_credits" ADD CONSTRAINT "attribution_credits_attributionModelId_fkey" FOREIGN KEY ("attributionModelId") REFERENCES "attribution_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_segments" ADD CONSTRAINT "behavior_segments_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_profiles" ADD CONSTRAINT "behavior_profiles_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_profile_segments" ADD CONSTRAINT "behavior_profile_segments_behaviorProfileId_fkey" FOREIGN KEY ("behaviorProfileId") REFERENCES "behavior_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_profile_segments" ADD CONSTRAINT "behavior_profile_segments_behaviorSegmentId_fkey" FOREIGN KEY ("behaviorSegmentId") REFERENCES "behavior_segments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversion_flows" ADD CONSTRAINT "conversion_flows_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversion_flow_products" ADD CONSTRAINT "conversion_flow_products_conversionFlowId_fkey" FOREIGN KEY ("conversionFlowId") REFERENCES "conversion_flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversion_flow_products" ADD CONSTRAINT "conversion_flow_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_contacts" ADD CONSTRAINT "crm_contacts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_contacts" ADD CONSTRAINT "crm_contacts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_tags" ADD CONSTRAINT "crm_tags_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_contact_tags" ADD CONSTRAINT "crm_contact_tags_crmContactId_fkey" FOREIGN KEY ("crmContactId") REFERENCES "crm_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_contact_tags" ADD CONSTRAINT "crm_contact_tags_crmTagId_fkey" FOREIGN KEY ("crmTagId") REFERENCES "crm_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_subscribers" ADD CONSTRAINT "newsletter_subscribers_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_subscribers" ADD CONSTRAINT "newsletter_subscribers_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_campaigns" ADD CONSTRAINT "newsletter_campaigns_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_campaigns" ADD CONSTRAINT "newsletter_campaigns_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_campaign_recipients" ADD CONSTRAINT "newsletter_campaign_recipients_newsletterCampaignId_fkey" FOREIGN KEY ("newsletterCampaignId") REFERENCES "newsletter_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_campaign_recipients" ADD CONSTRAINT "newsletter_campaign_recipients_newsletterSubscriberId_fkey" FOREIGN KEY ("newsletterSubscriberId") REFERENCES "newsletter_subscribers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public_events" ADD CONSTRAINT "public_events_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public_events" ADD CONSTRAINT "public_events_primaryImageId_fkey" FOREIGN KEY ("primaryImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public_events" ADD CONSTRAINT "public_events_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_publicEventId_fkey" FOREIGN KEY ("publicEventId") REFERENCES "public_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_reservations" ADD CONSTRAINT "event_reservations_publicEventId_fkey" FOREIGN KEY ("publicEventId") REFERENCES "public_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_reservations" ADD CONSTRAINT "event_reservations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_rules" ADD CONSTRAINT "recommendation_rules_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_links" ADD CONSTRAINT "recommendation_links_recommendationRuleId_fkey" FOREIGN KEY ("recommendationRuleId") REFERENCES "recommendation_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_publications" ADD CONSTRAINT "social_publications_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_publications" ADD CONSTRAINT "social_publications_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_publication_assets" ADD CONSTRAINT "social_publication_assets_socialPublicationId_fkey" FOREIGN KEY ("socialPublicationId") REFERENCES "social_publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_publication_assets" ADD CONSTRAINT "social_publication_assets_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_supportTicketId_fkey" FOREIGN KEY ("supportTicketId") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_authorCustomerId_fkey" FOREIGN KEY ("authorCustomerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_decisions" ADD CONSTRAINT "approval_decisions_approvalRequestId_fkey" FOREIGN KEY ("approvalRequestId") REFERENCES "approval_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_decisions" ADD CONSTRAINT "approval_decisions_decidedByUserId_fkey" FOREIGN KEY ("decidedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_purposes" ADD CONSTRAINT "consent_purposes_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_purposeId_fkey" FOREIGN KEY ("purposeId") REFERENCES "consent_purposes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_recipients" ADD CONSTRAINT "email_recipients_emailMessageId_fkey" FOREIGN KEY ("emailMessageId") REFERENCES "email_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_definitions" ADD CONSTRAINT "export_definitions_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_requests" ADD CONSTRAINT "export_requests_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_requests" ADD CONSTRAINT "export_requests_exportDefinitionId_fkey" FOREIGN KEY ("exportDefinitionId") REFERENCES "export_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_requests" ADD CONSTRAINT "export_requests_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_artifacts" ADD CONSTRAINT "export_artifacts_exportRequestId_fkey" FOREIGN KEY ("exportRequestId") REFERENCES "export_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_risk_assessments" ADD CONSTRAINT "fraud_risk_assessments_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_risk_decisions" ADD CONSTRAINT "fraud_risk_decisions_fraudRiskAssessmentId_fkey" FOREIGN KEY ("fraudRiskAssessmentId") REFERENCES "fraud_risk_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_risk_decisions" ADD CONSTRAINT "fraud_risk_decisions_decidedByUserId_fkey" FOREIGN KEY ("decidedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_risk_reviews" ADD CONSTRAINT "fraud_risk_reviews_fraudRiskAssessmentId_fkey" FOREIGN KEY ("fraudRiskAssessmentId") REFERENCES "fraud_risk_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_risk_reviews" ADD CONSTRAINT "fraud_risk_reviews_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_definitions" ADD CONSTRAINT "import_definitions_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_requests" ADD CONSTRAINT "import_requests_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_requests" ADD CONSTRAINT "import_requests_importDefinitionId_fkey" FOREIGN KEY ("importDefinitionId") REFERENCES "import_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_requests" ADD CONSTRAINT "import_requests_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_artifacts" ADD CONSTRAINT "import_artifacts_importRequestId_fkey" FOREIGN KEY ("importRequestId") REFERENCES "import_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_credentials" ADD CONSTRAINT "integration_credentials_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_sync_states" ADD CONSTRAINT "integration_sync_states_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localization_locales" ADD CONSTRAINT "localization_locales_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localized_values" ADD CONSTRAINT "localized_values_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localized_values" ADD CONSTRAINT "localized_values_localeId_fkey" FOREIGN KEY ("localeId") REFERENCES "localization_locales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipientCustomerId_fkey" FOREIGN KEY ("recipientCustomerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_recipientCustomerId_fkey" FOREIGN KEY ("recipientCustomerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_plans" ADD CONSTRAINT "schedule_plans_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_plans" ADD CONSTRAINT "schedule_plans_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_windows" ADD CONSTRAINT "schedule_windows_schedulePlanId_fkey" FOREIGN KEY ("schedulePlanId") REFERENCES "schedule_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_occurrences" ADD CONSTRAINT "schedule_occurrences_schedulePlanId_fkey" FOREIGN KEY ("schedulePlanId") REFERENCES "schedule_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_webhookEndpointId_fkey" FOREIGN KEY ("webhookEndpointId") REFERENCES "webhook_endpoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_definitions" ADD CONSTRAINT "workflow_definitions_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_definition_steps" ADD CONSTRAINT "workflow_definition_steps_workflowDefinitionId_fkey" FOREIGN KEY ("workflowDefinitionId") REFERENCES "workflow_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_instances" ADD CONSTRAINT "workflow_instances_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_instances" ADD CONSTRAINT "workflow_instances_workflowDefinitionId_fkey" FOREIGN KEY ("workflowDefinitionId") REFERENCES "workflow_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_instances" ADD CONSTRAINT "workflow_instances_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_step_instances" ADD CONSTRAINT "workflow_step_instances_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_step_instances" ADD CONSTRAINT "workflow_step_instances_workflowDefinitionStepId_fkey" FOREIGN KEY ("workflowDefinitionStepId") REFERENCES "workflow_definition_steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_product_statuses" ADD CONSTRAINT "channel_product_statuses_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_product_statuses" ADD CONSTRAINT "channel_product_statuses_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_variant_statuses" ADD CONSTRAINT "channel_variant_statuses_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_variant_statuses" ADD CONSTRAINT "channel_variant_statuses_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_documents" ADD CONSTRAINT "search_documents_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

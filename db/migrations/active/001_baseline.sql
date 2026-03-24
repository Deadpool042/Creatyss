-- ============================================================
-- 001_baseline.sql
--
-- Baseline unique active de Creatyss.
-- Source de vérité structurelle : schéma Prisma courant.
--
-- Généré avec :
--   pnpm exec prisma migrate diff --from-empty --to-schema prisma --script
--
-- Contient :
--   - structure relationnelle complète (enums, tables, FK, indexes Prisma)
--   - contraintes SQL complémentaires (partial unique indexes, checks)
--
-- C'est le seul fichier actif dans db/migrations/active/.
-- Les fichiers précédents sont archivés dans db/migrations/_archive/.
-- ============================================================

BEGIN;


-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AiProviderKind" AS ENUM ('ANTHROPIC', 'OPENAI', 'MISTRAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "AiProviderStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AiResponseDepth" AS ENUM ('QUICK', 'STANDARD', 'DEEP');

-- CreateEnum
CREATE TYPE "AiContentKind" AS ENUM ('PRODUCT_DESCRIPTION', 'PRODUCT_SHORT_DESCRIPTION', 'BLOG_POST_CONTENT', 'BLOG_POST_EXCERPT', 'SEO_META_TITLE', 'SEO_META_DESCRIPTION', 'PAGE_CONTENT', 'EMAIL_SUBJECT', 'EMAIL_BODY', 'SOCIAL_POST_CONTENT', 'CATEGORY_DESCRIPTION', 'CUSTOM');

-- CreateEnum
CREATE TYPE "AiContentGenerationStatus" AS ENUM ('PENDING', 'GENERATING', 'COMPLETED', 'FAILED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AiConversationStatus" AS ENUM ('ACTIVE', 'ENDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AiMessageRole" AS ENUM ('SYSTEM', 'USER', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "BundleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProductTypeStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CatalogAttributeValueType" AS ENUM ('TEXT', 'BOOLEAN', 'INTEGER', 'DECIMAL', 'COLOR');

-- CreateEnum
CREATE TYPE "CatalogAttributeStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProductTypeAttributeKind" AS ENUM ('BASE', 'VARIANT_AXIS');

-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ChannelKind" AS ENUM ('GOOGLE_SHOPPING', 'META_CATALOG', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ChannelStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ChannelPublicationStatus" AS ENUM ('NOT_SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED', 'REMOVED');

-- CreateEnum
CREATE TYPE "DiscountStatus" AS ENUM ('DRAFT', 'ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "InventoryPolicyKind" AS ENUM ('TRACK', 'DENY_OUT_OF_STOCK', 'ALLOW_BACKORDERS', 'ALLOW_PREORDERS', 'INFINITE');

-- CreateEnum
CREATE TYPE "InventoryAdjustmentKind" AS ENUM ('SALE', 'RETURN', 'MANUAL_CORRECTION', 'RECEPTION', 'TRANSFER', 'WRITE_OFF');

-- CreateEnum
CREATE TYPE "MediaAssetKind" AS ENUM ('IMAGE', 'FILE');

-- CreateEnum
CREATE TYPE "MediaAssetStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PriceStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProductVariantStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SalesPolicyStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SalesPolicyTargetKind" AS ENUM ('PRODUCT', 'PRODUCT_VARIANT', 'CATEGORY', 'BUNDLE');

-- CreateEnum
CREATE TYPE "TaxRuleKind" AS ENUM ('STANDARD', 'REDUCED', 'ZERO', 'EXEMPT');

-- CreateEnum
CREATE TYPE "TaxRuleStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ExciseRuleStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CONVERTED', 'ABANDONED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "CheckoutStatus" AS ENUM ('ACTIVE', 'READY', 'COMPLETED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DocumentKind" AS ENUM ('INVOICE', 'CREDIT_NOTE');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'ISSUED', 'SENT', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FulfillmentStatus" AS ENUM ('PENDING', 'PREPARING', 'READY', 'SHIPPED', 'DELIVERED', 'READY_FOR_PICKUP', 'COMPLETED', 'BLOCKED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GiftCardStatus" AS ENUM ('DRAFT', 'ACTIVE', 'DISABLED', 'EXPIRED', 'REDEEMED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "GiftCardTransactionType" AS ENUM ('ISSUE', 'REDEEM', 'ADJUST', 'EXPIRE', 'INVALIDATE');

-- CreateEnum
CREATE TYPE "GiftingStatus" AS ENUM ('ACTIVE', 'REMOVED');

-- CreateEnum
CREATE TYPE "LoyaltyAccountStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LoyaltyTransactionType" AS ENUM ('EARN', 'REDEEM', 'ADJUST', 'EXPIRE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "OrderLineType" AS ENUM ('PRODUCT', 'GIFT_CARD');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethodKind" AS ENUM ('CARD', 'BANK_TRANSFER', 'GIFT_CARD', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentRefundStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReturnStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'RECEIVED', 'REFUNDED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ShippingMethodStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SubscriptionBillingCycle" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "BlogPostStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LocalizationValueStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PageSectionKind" AS ENUM ('HERO', 'RICH_TEXT', 'IMAGE', 'IMAGE_TEXT', 'FEATURED_PRODUCTS', 'FEATURED_CATEGORIES', 'FEATURED_POSTS', 'EDITORIAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "RecommendationListStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RecommendationContextKind" AS ENUM ('PRODUCT', 'CATEGORY', 'CART', 'BLOG_POST', 'EVENT', 'MANUAL');

-- CreateEnum
CREATE TYPE "RecommendationTargetKind" AS ENUM ('PRODUCT', 'CATEGORY', 'BLOG_POST', 'EVENT');

-- CreateEnum
CREATE TYPE "SearchIndexStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SearchDocumentKind" AS ENUM ('PRODUCT', 'CATEGORY', 'PAGE', 'BLOG_POST', 'EVENT');

-- CreateEnum
CREATE TYPE "SeoSubjectKind" AS ENUM ('PAGE', 'BLOG_POST', 'PRODUCT', 'CATEGORY');

-- CreateEnum
CREATE TYPE "SeoIndexingState" AS ENUM ('INDEX', 'NOINDEX');

-- CreateEnum
CREATE TYPE "TemplateDefinitionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TemplateUsageKind" AS ENUM ('EMAIL', 'NOTIFICATION', 'PAGE_SECTION', 'EVENT', 'MARKETING', 'GENERIC');

-- CreateEnum
CREATE TYPE "AnalyticsMetricStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AnalyticsPeriodKind" AS ENUM ('DAY', 'WEEK', 'MONTH');

-- CreateEnum
CREATE TYPE "AttributionStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AttributionModelKind" AS ENUM ('FIRST_TOUCH', 'LAST_TOUCH', 'ASSISTED');

-- CreateEnum
CREATE TYPE "AttributionSubjectKind" AS ENUM ('ORDER', 'CUSTOMER', 'CHECKOUT');

-- CreateEnum
CREATE TYPE "BehaviorProfileStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BehaviorActorKind" AS ENUM ('VISITOR', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "ConsentCategoryKind" AS ENUM ('EMAIL_MARKETING', 'NEWSLETTER', 'ANALYTICS', 'TRACKING', 'PROFILING', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ConsentStatus" AS ENUM ('GIVEN', 'REFUSED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "ConsentActorKind" AS ENUM ('CUSTOMER', 'USER', 'VISITOR');

-- CreateEnum
CREATE TYPE "ConversionFlowStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ConversionTriggerKind" AS ENUM ('PAGE_VIEW', 'PRODUCT_VIEW', 'ADD_TO_CART', 'CHECKOUT_START', 'PURCHASE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "CrmTagStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('PENDING', 'PREPARED', 'SENT', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EmailCategory" AS ENUM ('TRANSACTIONAL', 'SUPPORT', 'NEWSLETTER', 'MARKETING', 'GENERIC');

-- CreateEnum
CREATE TYPE "EmailRecipientKind" AS ENUM ('USER', 'CUSTOMER', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EventRegistrationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'WAITLISTED');

-- CreateEnum
CREATE TYPE "MarketingCampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MarketingCampaignChannel" AS ENUM ('EMAIL', 'SOCIAL', 'ONSITE', 'MANUAL');

-- CreateEnum
CREATE TYPE "NewsletterSubscriptionStatus" AS ENUM ('PENDING', 'ACTIVE', 'UNSUBSCRIBED', 'BOUNCED', 'COMPLAINED');

-- CreateEnum
CREATE TYPE "NewsletterCampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'IN_APP');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationRecipientKind" AS ENUM ('USER', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ORDER_CREATED', 'ORDER_CONFIRMED', 'ORDER_CANCELLED', 'PAYMENT_CAPTURED', 'PAYMENT_FAILED', 'FULFILLMENT_SHIPPED', 'FULFILLMENT_READY_FOR_PICKUP', 'RETURN_REQUESTED', 'RETURN_APPROVED', 'SUPPORT_MESSAGE', 'GENERIC');

-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('INSTAGRAM', 'FACEBOOK', 'TWITTER_X', 'LINKEDIN', 'TIKTOK', 'PINTEREST');

-- CreateEnum
CREATE TYPE "SocialAccountStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SocialPostStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SupportTicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'RESOLVED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SupportTicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "SupportTicketSubjectKind" AS ENUM ('ORDER', 'RETURN_REQUEST', 'PAYMENT', 'DOCUMENT', 'EVENT', 'OTHER');

-- CreateEnum
CREATE TYPE "SupportMessageAuthorKind" AS ENUM ('USER', 'CUSTOMER', 'SYSTEM');

-- CreateEnum
CREATE TYPE "TrackingEventStatus" AS ENUM ('RECORDED', 'IGNORED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TrackingActorKind" AS ENUM ('VISITOR', 'CUSTOMER', 'USER');

-- CreateEnum
CREATE TYPE "ApiClientStatus" AS ENUM ('ACTIVE', 'REVOKED', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ApiClientScopeType" AS ENUM ('PLATFORM', 'STORE');

-- CreateEnum
CREATE TYPE "AuthIdentityStatus" AS ENUM ('PENDING_BOOTSTRAP', 'ACTIVE', 'LOCKED', 'SUSPENDED', 'RESET_REQUIRED', 'DISABLED');

-- CreateEnum
CREATE TYPE "AuthSessionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "AuthRecoveryStatus" AS ENUM ('PENDING', 'CONSUMED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "AuthMfaMethod" AS ENUM ('TOTP');

-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PermissionStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PermissionScopeType" AS ENUM ('PLATFORM', 'STORE', 'DOMAIN');

-- CreateEnum
CREATE TYPE "RoleStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RoleScopeType" AS ENUM ('PLATFORM', 'STORE');

-- CreateEnum
CREATE TYPE "StoreStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM ('EUR', 'USD', 'GBP', 'CHF', 'CAD', 'AUD', 'JPY', 'DKK', 'NOK', 'SEK', 'PLN', 'CZK', 'HUF', 'RON');

-- CreateEnum
CREATE TYPE "StoreCapabilityKey" AS ENUM ('GUEST_CHECKOUT', 'CUSTOMER_CHECKOUT', 'PROFESSIONAL_CUSTOMERS', 'MULTI_CURRENCY', 'MULTI_CARRIER', 'PICKUP_POINT_DELIVERY', 'DISCOUNTS', 'COUPON_CODES', 'CUSTOMER_SPECIFIC_PRICING', 'CUSTOMER_GROUP_PRICING', 'VOLUME_PRICING', 'TAXATION', 'EXCISE_TAX', 'BACKORDERS', 'PREORDERS', 'GIFT_OPTIONS', 'PRODUCT_CHANNELS', 'GOOGLE_SHOPPING', 'META_CATALOG', 'MARKETING_CAMPAIGNS', 'CONVERSION_FLOWS', 'CRM', 'TRACKING', 'COOKIE_CONSENT', 'ANALYTICS', 'ATTRIBUTION', 'MARKETING_PIXELS', 'SERVER_SIDE_TRACKING', 'NOTIFICATIONS', 'NEWSLETTER', 'REALTIME_NOTIFICATIONS', 'PUBLIC_EVENTS', 'EVENT_REGISTRATIONS', 'EVENT_RESERVATIONS', 'SOCIAL_PUBLISHING', 'AUTOMATIC_SOCIAL_POSTING', 'BEHAVIORAL_ANALYTICS', 'PRODUCT_VIEW_TRACKING', 'CLICK_TRACKING', 'SEARCH', 'RECOMMENDATIONS', 'ADVANCED_SEO', 'LOCALIZATION', 'AUDIT_TRAIL', 'BUSINESS_OBSERVABILITY', 'TECHNICAL_MONITORING', 'ADVANCED_PERMISSIONS', 'ERP_INTEGRATION', 'EBP_INTEGRATION', 'ELECTRONIC_INVOICING', 'CHORUS_PRO_INTEGRATION', 'AI_CONTENT_GENERATION', 'AI_PUBLIC_ASSISTANT', 'AI_SEO_GENERATION', 'AI_SOCIAL_GENERATION');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ApprovalRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AuditSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AuditActorKind" AS ENUM ('USER', 'API_CLIENT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "DashboardKind" AS ENUM ('PLATFORM', 'STORE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "DashboardStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DashboardWidgetKind" AS ENUM ('METRIC', 'CHART', 'TABLE', 'STATUS', 'TEXT');

-- CreateEnum
CREATE TYPE "DomainEventStatus" AS ENUM ('PENDING', 'DISPATCHED', 'FAILED');

-- CreateEnum
CREATE TYPE "ExportStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExportFormat" AS ENUM ('CSV', 'JSON', 'XLSX');

-- CreateEnum
CREATE TYPE "FeatureFlagStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FraudRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "FraudRiskDecisionStatus" AS ENUM ('PENDING', 'REVIEW_REQUIRED', 'ALLOWED', 'BLOCKED', 'CLEARED');

-- CreateEnum
CREATE TYPE "FraudRiskSubjectKind" AS ENUM ('ORDER', 'PAYMENT', 'CUSTOMER', 'CHECKOUT');

-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PENDING', 'VALIDATED', 'RUNNING', 'PARTIALLY_APPLIED', 'APPLIED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ImportFormat" AS ENUM ('CSV', 'JSON', 'XLSX');

-- CreateEnum
CREATE TYPE "IntegrationStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "IntegrationProviderKind" AS ENUM ('PAYMENT', 'SHIPPING', 'ERP', 'E_INVOICING', 'EMAIL', 'CMS', 'OTHER');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LegalDocumentStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LegalDocumentKind" AS ENUM ('TERMS_OF_SERVICE', 'PRIVACY_POLICY', 'RETURN_POLICY', 'SHIPPING_POLICY', 'LEGAL_NOTICE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "MonitoringCheckStatus" AS ENUM ('HEALTHY', 'DEGRADED', 'FAILED');

-- CreateEnum
CREATE TYPE "MonitoringCheckKind" AS ENUM ('DATABASE', 'QUEUE', 'WEBHOOK', 'INTEGRATION', 'STORAGE', 'APPLICATION', 'OTHER');

-- CreateEnum
CREATE TYPE "ObservabilityLevel" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ObservabilityRecordKind" AS ENUM ('ACCESS_DECISION', 'WORKFLOW_STATE', 'APPROVAL_DECISION', 'INTEGRATION_EVENT', 'DOMAIN_DIAGNOSTIC', 'OTHER');

-- CreateEnum
CREATE TYPE "SchedulingEntryStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "WebhookStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WebhookEventStatus" AS ENUM ('PENDING', 'DELIVERED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WorkflowRunStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "ai_providers" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "kind" "AiProviderKind" NOT NULL,
    "name" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "status" "AiProviderStatus" NOT NULL DEFAULT 'ACTIVE',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_credentials" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "secretRef" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_depth_policies" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "usageKind" TEXT NOT NULL,
    "depth" "AiResponseDepth" NOT NULL DEFAULT 'STANDARD',
    "maxTokens" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_depth_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_content_generations" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "requestedById" TEXT,
    "contentKind" "AiContentKind" NOT NULL,
    "depth" "AiResponseDepth" NOT NULL DEFAULT 'STANDARD',
    "status" "AiContentGenerationStatus" NOT NULL DEFAULT 'PENDING',
    "inputContext" JSONB,
    "outputText" TEXT,
    "promptTokens" INTEGER NOT NULL DEFAULT 0,
    "completionTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_content_generations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_conversations" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "customerId" TEXT,
    "status" "AiConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "depth" "AiResponseDepth" NOT NULL DEFAULT 'STANDARD',
    "systemPrompt" TEXT,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_conversation_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "AiMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL DEFAULT 0,
    "completionTokens" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_conversation_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_usage_summaries" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "usageKind" TEXT NOT NULL,
    "requestCount" INTEGER NOT NULL DEFAULT 0,
    "promptTokens" INTEGER NOT NULL DEFAULT 0,
    "completionTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_usage_summaries_pkey" PRIMARY KEY ("id")
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
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bundles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle_items" (
    "id" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "quantity" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bundle_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_types" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProductTypeStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_attributes" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "valueType" "CatalogAttributeValueType" NOT NULL,
    "status" "CatalogAttributeStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_type_attributes" (
    "id" TEXT NOT NULL,
    "productTypeId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "kind" "ProductTypeAttributeKind" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isFilterable" BOOLEAN NOT NULL DEFAULT false,
    "isVisibleOnProduct" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_type_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "parentId" TEXT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "CategoryStatus" NOT NULL DEFAULT 'DRAFT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "kind" "ChannelKind" NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ChannelStatus" NOT NULL DEFAULT 'ACTIVE',
    "externalId" TEXT,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_product_publications" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "status" "ChannelPublicationStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "removedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_product_publications_pkey" PRIMARY KEY ("id")
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
    "percentageValue" DECIMAL(5,2),
    "fixedAmountValue" DECIMAL(12,2),
    "currencyCode" "CurrencyCode",
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "CouponStatus" NOT NULL DEFAULT 'ACTIVE',
    "maxRedemptions" INTEGER,
    "redeemedCount" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_redemptions" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "codeSnapshot" TEXT NOT NULL,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupon_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_discounts" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "discountId" TEXT,
    "couponId" TEXT,
    "codeSnapshot" TEXT,
    "nameSnapshot" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "policy" "InventoryPolicyKind" NOT NULL DEFAULT 'TRACK',
    "quantityOnHand" INTEGER NOT NULL DEFAULT 0,
    "quantityReserved" INTEGER NOT NULL DEFAULT 0,
    "quantityAvailable" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_adjustments" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "kind" "InventoryAdjustmentKind" NOT NULL,
    "delta" INTEGER NOT NULL,
    "quantityAfter" INTEGER NOT NULL,
    "reason" TEXT,
    "referenceId" TEXT,
    "referenceKind" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "kind" "MediaAssetKind" NOT NULL DEFAULT 'IMAGE',
    "status" "MediaAssetStatus" NOT NULL DEFAULT 'ACTIVE',
    "originalFilename" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "altText" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "fileSizeBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_media" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_media" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_variant_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_lists" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "currencyCode" "CurrencyCode" NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" "PriceStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_prices" (
    "id" TEXT NOT NULL,
    "priceListId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "compareAtAmount" DECIMAL(12,2),
    "status" "PriceStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_prices" (
    "id" TEXT NOT NULL,
    "priceListId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "compareAtAmount" DECIMAL(12,2),
    "status" "PriceStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variant_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "productTypeId" TEXT,
    "slug" TEXT NOT NULL,
    "sku" TEXT,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "defaultVariantId" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attribute_values" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "valueText" TEXT,
    "valueBoolean" BOOLEAN,
    "valueInt" INTEGER,
    "valueDecimal" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_attribute_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT,
    "name" TEXT,
    "status" "ProductVariantStatus" NOT NULL DEFAULT 'ACTIVE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_attribute_values" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "valueText" TEXT,
    "valueBoolean" BOOLEAN,
    "valueInt" INTEGER,
    "valueDecimal" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variant_attribute_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_policies" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "targetKind" "SalesPolicyTargetKind" NOT NULL,
    "targetId" TEXT NOT NULL,
    "status" "SalesPolicyStatus" NOT NULL DEFAULT 'ACTIVE',
    "isSellable" BOOLEAN NOT NULL DEFAULT true,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_rules" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "kind" "TaxRuleKind" NOT NULL DEFAULT 'STANDARD',
    "rate" DECIMAL(8,6) NOT NULL,
    "countryCode" TEXT,
    "regionCode" TEXT,
    "productTypeCode" TEXT,
    "status" "TaxRuleStatus" NOT NULL DEFAULT 'ACTIVE',
    "appliesFrom" TIMESTAMP(3),
    "appliesUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "excise_rules" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "rate" DECIMAL(8,6) NOT NULL,
    "amountPerUnit" DECIMAL(12,2),
    "countryCode" TEXT,
    "productTypeCode" TEXT,
    "status" "ExciseRuleStatus" NOT NULL DEFAULT 'ACTIVE',
    "appliesFrom" TIMESTAMP(3),
    "appliesUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "excise_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT,
    "currencyCode" "CurrencyCode" NOT NULL,
    "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE',
    "email" TEXT,
    "expiresAt" TIMESTAMP(3),
    "convertedAt" TIMESTAMP(3),
    "abandonedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_lines" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkouts" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "customerId" TEXT,
    "status" "CheckoutStatus" NOT NULL DEFAULT 'ACTIVE',
    "currencyCode" "CurrencyCode" NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "billingFirstName" TEXT,
    "billingLastName" TEXT,
    "billingCompany" TEXT,
    "billingLine1" TEXT,
    "billingLine2" TEXT,
    "billingPostalCode" TEXT,
    "billingCity" TEXT,
    "billingRegion" TEXT,
    "billingCountryCode" TEXT,
    "billingPhone" TEXT,
    "shippingFirstName" TEXT,
    "shippingLastName" TEXT,
    "shippingCompany" TEXT,
    "shippingLine1" TEXT,
    "shippingLine2" TEXT,
    "shippingPostalCode" TEXT,
    "shippingCity" TEXT,
    "shippingRegion" TEXT,
    "shippingCountryCode" TEXT,
    "shippingPhone" TEXT,
    "shippingMethodId" TEXT,
    "shippingPriceAmount" DECIMAL(12,2),
    "subtotalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "couponCode" TEXT,
    "notes" TEXT,
    "completionIdempotencyKey" TEXT,
    "completedAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checkouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercial_documents" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "kind" "DocumentKind" NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "documentNumber" TEXT NOT NULL,
    "orderId" TEXT,
    "returnRequestId" TEXT,
    "currencyCode" "CurrencyCode" NOT NULL,
    "subtotalAmount" DECIMAL(12,2) NOT NULL,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "issuedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "storagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commercial_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fulfillments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "FulfillmentStatus" NOT NULL DEFAULT 'PENDING',
    "trackingNumber" TEXT,
    "trackingUrl" TEXT,
    "carrierName" TEXT,
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "readyForPickupAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "blockedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fulfillments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fulfillment_lines" (
    "id" TEXT NOT NULL,
    "fulfillmentId" TEXT NOT NULL,
    "orderLineId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fulfillment_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_cards" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT,
    "code" TEXT NOT NULL,
    "initialAmount" DECIMAL(12,2) NOT NULL,
    "balanceAmount" DECIMAL(12,2) NOT NULL,
    "currencyCode" "CurrencyCode" NOT NULL,
    "status" "GiftCardStatus" NOT NULL DEFAULT 'DRAFT',
    "expiresAt" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "disabledAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gift_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_card_transactions" (
    "id" TEXT NOT NULL,
    "giftCardId" TEXT NOT NULL,
    "orderId" TEXT,
    "type" "GiftCardTransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "balanceAfterAmount" DECIMAL(12,2) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gift_card_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gifting_contexts" (
    "id" TEXT NOT NULL,
    "cartId" TEXT,
    "checkoutId" TEXT,
    "orderId" TEXT,
    "status" "GiftingStatus" NOT NULL DEFAULT 'ACTIVE',
    "recipientFirstName" TEXT,
    "recipientLastName" TEXT,
    "recipientEmail" TEXT,
    "recipientPhone" TEXT,
    "giftMessage" TEXT,
    "presentationNote" TEXT,
    "wantsGiftWrap" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gifting_contexts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_accounts" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "LoyaltyAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "pointsBalance" INTEGER NOT NULL DEFAULT 0,
    "tierCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loyalty_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_transactions" (
    "id" TEXT NOT NULL,
    "loyaltyAccountId" TEXT NOT NULL,
    "orderId" TEXT,
    "type" "LoyaltyTransactionType" NOT NULL,
    "points" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "reason" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT,
    "checkoutId" TEXT,
    "orderNumber" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "currencyCode" "CurrencyCode" NOT NULL,
    "subtotalAmount" DECIMAL(12,2) NOT NULL,
    "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "shippingAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerFirstName" TEXT,
    "customerLastName" TEXT,
    "customerPhone" TEXT,
    "billingFirstName" TEXT,
    "billingLastName" TEXT,
    "billingCompany" TEXT,
    "billingLine1" TEXT,
    "billingLine2" TEXT,
    "billingPostalCode" TEXT,
    "billingCity" TEXT,
    "billingRegion" TEXT,
    "billingCountryCode" TEXT,
    "billingPhone" TEXT,
    "shippingFirstName" TEXT,
    "shippingLastName" TEXT,
    "shippingCompany" TEXT,
    "shippingLine1" TEXT,
    "shippingLine2" TEXT,
    "shippingPostalCode" TEXT,
    "shippingCity" TEXT,
    "shippingRegion" TEXT,
    "shippingCountryCode" TEXT,
    "shippingPhone" TEXT,
    "notes" TEXT,
    "placedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_lines" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "type" "OrderLineType" NOT NULL DEFAULT 'PRODUCT',
    "productId" TEXT,
    "variantId" TEXT,
    "productSlugSnapshot" TEXT,
    "productNameSnapshot" TEXT NOT NULL,
    "variantNameSnapshot" TEXT,
    "skuSnapshot" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPriceAmount" DECIMAL(12,2) NOT NULL,
    "lineSubtotalAmount" DECIMAL(12,2) NOT NULL,
    "lineDiscountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lineTaxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lineTotalAmount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "methodKind" "PaymentMethodKind" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currencyCode" "CurrencyCode" NOT NULL,
    "providerName" TEXT,
    "providerReference" TEXT,
    "providerPaymentIntentRef" TEXT,
    "authorizedAt" TIMESTAMP(3),
    "capturedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_refunds" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currencyCode" "CurrencyCode" NOT NULL,
    "status" "PaymentRefundStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "providerRefundReference" TEXT,
    "succeededAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_requests" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT,
    "status" "ReturnStatus" NOT NULL DEFAULT 'REQUESTED',
    "reason" TEXT,
    "notes" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "return_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_lines" (
    "id" TEXT NOT NULL,
    "returnRequestId" TEXT NOT NULL,
    "orderLineId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "return_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_methods" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ShippingMethodStatus" NOT NULL DEFAULT 'ACTIVE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_rates" (
    "id" TEXT NOT NULL,
    "shippingMethodId" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "region" TEXT,
    "postalCodePattern" TEXT,
    "minSubtotalAmount" DECIMAL(12,2),
    "maxSubtotalAmount" DECIMAL(12,2),
    "priceAmount" DECIMAL(12,2) NOT NULL,
    "currencyCode" "CurrencyCode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_shipping_selections" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "shippingMethodId" TEXT NOT NULL,
    "methodCodeSnapshot" TEXT NOT NULL,
    "methodNameSnapshot" TEXT NOT NULL,
    "priceAmount" DECIMAL(12,2) NOT NULL,
    "currencyCode" "CurrencyCode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_shipping_selections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_topics" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "customerId" TEXT,
    "userId" TEXT,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "billingCycle" "SubscriptionBillingCycle",
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "renewsAt" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_categories" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
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
    "content" TEXT,
    "coverImageId" TEXT,
    "status" "BlogPostStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_post_categories" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_post_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locale_definitions" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "countryCode" TEXT,
    "label" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locale_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localized_values" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "localeId" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "status" "LocalizationValueStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "localized_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "PageStatus" NOT NULL DEFAULT 'DRAFT',
    "isHomepage" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_sections" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "kind" "PageSectionKind" NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "content" TEXT,
    "imageAssetId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_lists" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "contextKind" "RecommendationContextKind" NOT NULL,
    "contextSubjectId" TEXT,
    "status" "RecommendationListStatus" NOT NULL DEFAULT 'ACTIVE',
    "isManual" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recommendation_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_items" (
    "id" TEXT NOT NULL,
    "recommendationListId" TEXT NOT NULL,
    "targetKind" "RecommendationTargetKind" NOT NULL,
    "targetSubjectId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "reasonLabel" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recommendation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_documents" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "kind" "SearchDocumentKind" NOT NULL,
    "subjectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "slug" TEXT,
    "locale" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "status" "SearchIndexStatus" NOT NULL DEFAULT 'ACTIVE',
    "searchableText" TEXT NOT NULL,
    "keywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "search_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_metadata" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "canonicalUrl" TEXT,
    "indexingState" "SeoIndexingState" NOT NULL DEFAULT 'INDEX',
    "openGraphTitle" TEXT,
    "openGraphDescription" TEXT,
    "openGraphImageId" TEXT,
    "pageId" TEXT,
    "blogPostId" TEXT,
    "productId" TEXT,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_definitions" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "usageKind" "TemplateUsageKind" NOT NULL,
    "status" "TemplateDefinitionStatus" NOT NULL DEFAULT 'DRAFT',
    "subject" TEXT,
    "htmlBody" TEXT,
    "textBody" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_variants" (
    "id" TEXT NOT NULL,
    "templateDefinitionId" TEXT NOT NULL,
    "code" TEXT,
    "locale" TEXT,
    "channel" TEXT,
    "name" TEXT,
    "subject" TEXT,
    "htmlBody" TEXT,
    "textBody" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" "TemplateDefinitionStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_metrics" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "periodKind" "AnalyticsPeriodKind" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "valueDecimal" DECIMAL(18,4),
    "valueInt" INTEGER,
    "dimensionKey" TEXT,
    "dimensionValue" TEXT,
    "status" "AnalyticsMetricStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribution_records" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "subjectKind" "AttributionSubjectKind" NOT NULL,
    "subjectId" TEXT NOT NULL,
    "modelKind" "AttributionModelKind" NOT NULL,
    "status" "AttributionStatus" NOT NULL DEFAULT 'ACTIVE',
    "source" TEXT,
    "medium" TEXT,
    "campaign" TEXT,
    "content" TEXT,
    "term" TEXT,
    "visitorKey" TEXT,
    "sessionKey" TEXT,
    "customerId" TEXT,
    "orderId" TEXT,
    "checkoutId" TEXT,
    "attributedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attribution_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "behavior_profiles" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "actorKind" "BehaviorActorKind" NOT NULL,
    "visitorKey" TEXT,
    "customerId" TEXT,
    "status" "BehaviorProfileStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastSeenAt" TIMESTAMP(3),
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "totalProductViews" INTEGER NOT NULL DEFAULT 0,
    "totalCartAdds" INTEGER NOT NULL DEFAULT 0,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "behavior_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "behavior_segments" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "behavior_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "behavior_segment_assignments" (
    "id" TEXT NOT NULL,
    "behaviorProfileId" TEXT NOT NULL,
    "behaviorSegmentId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "behavior_segment_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_categories" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "kind" "ConsentCategoryKind" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consent_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_records" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "actorKind" "ConsentActorKind" NOT NULL,
    "customerId" TEXT,
    "userId" TEXT,
    "visitorKey" TEXT,
    "status" "ConsentStatus" NOT NULL,
    "locale" TEXT,
    "source" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "givenAt" TIMESTAMP(3),
    "refusedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversion_flows" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ConversionFlowStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversion_flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversion_steps" (
    "id" TEXT NOT NULL,
    "conversionFlowId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "triggerKind" "ConversionTriggerKind" NOT NULL,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversion_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_tags" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "status" "CrmTagStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_customer_tags" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_customer_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_notes" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "userId" TEXT,
    "content" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_messages" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "category" "EmailCategory" NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'PENDING',
    "recipientKind" "EmailRecipientKind" NOT NULL,
    "userId" TEXT,
    "customerId" TEXT,
    "toEmail" TEXT NOT NULL,
    "toName" TEXT,
    "subject" TEXT NOT NULL,
    "htmlBody" TEXT,
    "textBody" TEXT,
    "templateDefinitionId" TEXT,
    "templateVariantId" TEXT,
    "notificationId" TEXT,
    "orderId" TEXT,
    "eventId" TEXT,
    "supportTicketId" TEXT,
    "preparedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "description" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "locationName" TEXT,
    "locationLine1" TEXT,
    "locationLine2" TEXT,
    "locationPostalCode" TEXT,
    "locationCity" TEXT,
    "locationRegion" TEXT,
    "locationCountryCode" TEXT,
    "capacity" INTEGER,
    "coverImageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_registrations" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "customerId" TEXT,
    "status" "EventRegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_campaigns" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "MarketingCampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "channel" "MarketingCampaignChannel" NOT NULL,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "budgetAmount" DECIMAL(12,2),
    "currencyCode" "CurrencyCode",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketing_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_campaign_links" (
    "id" TEXT NOT NULL,
    "marketingCampaignId" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketing_campaign_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_lists" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscriptions" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "customerId" TEXT,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "status" "NewsletterSubscriptionStatus" NOT NULL DEFAULT 'PENDING',
    "confirmedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "bouncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_campaigns" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "previewText" TEXT,
    "status" "NewsletterCampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "recipientsCount" INTEGER NOT NULL DEFAULT 0,
    "opensCount" INTEGER NOT NULL DEFAULT 0,
    "clicksCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "recipientKind" "NotificationRecipientKind" NOT NULL,
    "userId" TEXT,
    "customerId" TEXT,
    "subject" TEXT,
    "title" TEXT,
    "body" TEXT,
    "orderId" TEXT,
    "paymentId" TEXT,
    "fulfillmentId" TEXT,
    "returnRequestId" TEXT,
    "sentAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_accounts" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "externalAccountId" TEXT NOT NULL,
    "displayName" TEXT,
    "credentialRef" TEXT,
    "status" "SocialAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "tokenExpiresAt" TIMESTAMP(3),
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_posts" (
    "id" TEXT NOT NULL,
    "socialAccountId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mediaUrls" TEXT[],
    "status" "SocialPostStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "externalPostId" TEXT,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT,
    "ticketNumber" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT,
    "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "SupportTicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "subjectKind" "SupportTicketSubjectKind" NOT NULL DEFAULT 'OTHER',
    "orderId" TEXT,
    "returnRequestId" TEXT,
    "paymentId" TEXT,
    "eventId" TEXT,
    "assignedToUserId" TEXT,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_messages" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorKind" "SupportMessageAuthorKind" NOT NULL,
    "userId" TEXT,
    "customerId" TEXT,
    "body" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracking_events" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "actorKind" "TrackingActorKind" NOT NULL,
    "visitorKey" TEXT,
    "customerId" TEXT,
    "userId" TEXT,
    "sessionKey" TEXT,
    "pageUrl" TEXT,
    "referrerUrl" TEXT,
    "source" TEXT,
    "medium" TEXT,
    "campaign" TEXT,
    "subjectType" TEXT,
    "subjectId" TEXT,
    "status" "TrackingEventStatus" NOT NULL DEFAULT 'RECORDED',
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracking_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_clients" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "scopeType" "ApiClientScopeType" NOT NULL,
    "status" "ApiClientStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_client_credentials" (
    "id" TEXT NOT NULL,
    "apiClientId" TEXT NOT NULL,
    "credentialKey" TEXT NOT NULL,
    "secretHash" TEXT NOT NULL,
    "label" TEXT,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_client_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_client_permissions" (
    "id" TEXT NOT NULL,
    "apiClientId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "grantedById" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_client_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_identities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "AuthIdentityStatus" NOT NULL DEFAULT 'PENDING_BOOTSTRAP',
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginFailedAt" TIMESTAMP(3),
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "lockedAt" TIMESTAMP(3),
    "passwordChangedAt" TIMESTAMP(3),
    "resetRequiredAt" TIMESTAMP(3),
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_password_credentials" (
    "id" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "passwordVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_password_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_sessions" (
    "id" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "sessionTokenHash" TEXT NOT NULL,
    "status" "AuthSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceLabel" TEXT,
    "lastSeenAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_recovery_requests" (
    "id" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "requestedByUserId" TEXT,
    "tokenHash" TEXT NOT NULL,
    "status" "AuthRecoveryStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_recovery_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_mfa_enrollments" (
    "id" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "method" "AuthMfaMethod" NOT NULL DEFAULT 'TOTP',
    "label" TEXT,
    "secretHash" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_mfa_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_recovery_codes" (
    "id" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_recovery_codes_pkey" PRIMARY KEY ("id")
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
    "notes" TEXT,
    "status" "CustomerStatus" NOT NULL DEFAULT 'ACTIVE',
    "acceptsEmailMarketing" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_addresses" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
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
    "isDefaultBilling" BOOLEAN NOT NULL DEFAULT false,
    "isDefaultShipping" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "scopeType" "PermissionScopeType" NOT NULL,
    "status" "PermissionStatus" NOT NULL DEFAULT 'ACTIVE',
    "isSensitive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "grantedById" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "scopeType" "RoleScopeType" NOT NULL,
    "status" "RoleStatus" NOT NULL DEFAULT 'ACTIVE',
    "isSystemRole" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedById" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "StoreStatus" NOT NULL DEFAULT 'DRAFT',
    "defaultLocale" TEXT NOT NULL DEFAULT 'fr-FR',
    "defaultCurrency" TEXT NOT NULL DEFAULT 'EUR',
    "defaultCountryCode" TEXT NOT NULL DEFAULT 'FR',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Paris',
    "supportEmail" TEXT,
    "contactEmail" TEXT,
    "legalName" TEXT,
    "brandName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_capabilities" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "key" "StoreCapabilityKey" NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "displayName" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'INVITED',
    "lastSeenAt" TIMESTAMP(3),
    "invitedAt" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "disabledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_requests" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "requestedByUserId" TEXT,
    "reviewedByUserId" TEXT,
    "status" "ApprovalRequestStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "reviewNote" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "approval_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "actorKind" "AuditActorKind" NOT NULL,
    "userId" TEXT,
    "apiClientId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "summary" TEXT,
    "severity" "AuditSeverity" NOT NULL DEFAULT 'INFO',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
CREATE TABLE "dashboards" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "kind" "DashboardKind" NOT NULL DEFAULT 'STORE',
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "DashboardStatus" NOT NULL DEFAULT 'ACTIVE',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_widgets" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "kind" "DashboardWidgetKind" NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "config" JSONB,
    "colSpan" INTEGER NOT NULL DEFAULT 1,
    "rowSpan" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboard_widgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domain_events" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "eventType" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "DomainEventStatus" NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastErrorAt" TIMESTAMP(3),
    "lastError" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispatchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "domain_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_definitions" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subjectType" TEXT NOT NULL,
    "format" "ExportFormat" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "export_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_requests" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "exportDefinitionId" TEXT NOT NULL,
    "requestedByUserId" TEXT,
    "status" "ExportStatus" NOT NULL DEFAULT 'PENDING',
    "format" "ExportFormat" NOT NULL,
    "filters" JSONB,
    "artifactPath" TEXT,
    "artifactFilename" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "export_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "FeatureFlagStatus" NOT NULL DEFAULT 'ACTIVE',
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fraud_risk_assessments" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "subjectKind" "FraudRiskSubjectKind" NOT NULL,
    "subjectId" TEXT NOT NULL,
    "level" "FraudRiskLevel" NOT NULL,
    "decisionStatus" "FraudRiskDecisionStatus" NOT NULL DEFAULT 'PENDING',
    "score" DECIMAL(6,2),
    "summary" TEXT,
    "details" JSONB,
    "orderId" TEXT,
    "paymentId" TEXT,
    "customerId" TEXT,
    "checkoutId" TEXT,
    "reviewedByUserId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "blockedAt" TIMESTAMP(3),
    "clearedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fraud_risk_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fraud_risk_signals" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "details" TEXT,
    "weight" DECIMAL(6,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fraud_risk_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_definitions" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subjectType" TEXT NOT NULL,
    "format" "ImportFormat" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "import_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_requests" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "importDefinitionId" TEXT NOT NULL,
    "requestedByUserId" TEXT,
    "status" "ImportStatus" NOT NULL DEFAULT 'PENDING',
    "format" "ImportFormat" NOT NULL,
    "sourceFilename" TEXT,
    "sourcePath" TEXT,
    "parameters" JSONB,
    "validationSummary" JSONB,
    "resultSummary" JSONB,
    "validatedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "import_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "providerKind" "IntegrationProviderKind" NOT NULL,
    "providerName" TEXT NOT NULL,
    "status" "IntegrationStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_credentials" (
    "id" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "credentialKey" TEXT NOT NULL,
    "secretHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integration_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "type" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB,
    "result" JSONB,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_documents" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "kind" "LegalDocumentKind" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "LegalDocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "legal_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_document_versions" (
    "id" TEXT NOT NULL,
    "legalDocumentId" TEXT NOT NULL,
    "versionLabel" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "locale" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "legal_document_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_acceptances" (
    "id" TEXT NOT NULL,
    "legalDocumentVersionId" TEXT NOT NULL,
    "customerId" TEXT,
    "userId" TEXT,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "legal_acceptances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoring_checks" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "MonitoringCheckKind" NOT NULL,
    "status" "MonitoringCheckStatus" NOT NULL DEFAULT 'HEALTHY',
    "summary" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monitoring_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observability_records" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "kind" "ObservabilityRecordKind" NOT NULL,
    "level" "ObservabilityLevel" NOT NULL DEFAULT 'INFO',
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "correlationKey" TEXT,
    "contextData" JSONB,
    "userId" TEXT,
    "apiClientId" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "observability_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduling_entries" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "actionCode" TEXT NOT NULL,
    "status" "SchedulingEntryStatus" NOT NULL DEFAULT 'ACTIVE',
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "executedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduling_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_endpoints" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "secretHash" TEXT NOT NULL,
    "status" "WebhookStatus" NOT NULL DEFAULT 'ACTIVE',
    "subscribedEvents" JSONB NOT NULL,
    "lastDeliveredAt" TIMESTAMP(3),
    "lastFailedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_deliveries" (
    "id" TEXT NOT NULL,
    "endpointId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventKey" TEXT,
    "status" "WebhookEventStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB,
    "responseStatusCode" INTEGER,
    "responseBody" TEXT,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "nextRetryAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_runs" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "workflowCode" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "status" "WorkflowRunStatus" NOT NULL DEFAULT 'PENDING',
    "currentStep" TEXT,
    "payload" JSONB,
    "result" JSONB,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_providers_storeId_idx" ON "ai_providers"("storeId");

-- CreateIndex
CREATE INDEX "ai_providers_kind_idx" ON "ai_providers"("kind");

-- CreateIndex
CREATE INDEX "ai_providers_status_idx" ON "ai_providers"("status");

-- CreateIndex
CREATE INDEX "ai_credentials_providerId_idx" ON "ai_credentials"("providerId");

-- CreateIndex
CREATE INDEX "ai_depth_policies_storeId_idx" ON "ai_depth_policies"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "ai_depth_policies_storeId_usageKind_key" ON "ai_depth_policies"("storeId", "usageKind");

-- CreateIndex
CREATE INDEX "ai_content_generations_storeId_idx" ON "ai_content_generations"("storeId");

-- CreateIndex
CREATE INDEX "ai_content_generations_providerId_idx" ON "ai_content_generations"("providerId");

-- CreateIndex
CREATE INDEX "ai_content_generations_requestedById_idx" ON "ai_content_generations"("requestedById");

-- CreateIndex
CREATE INDEX "ai_content_generations_contentKind_idx" ON "ai_content_generations"("contentKind");

-- CreateIndex
CREATE INDEX "ai_content_generations_status_idx" ON "ai_content_generations"("status");

-- CreateIndex
CREATE INDEX "ai_content_generations_createdAt_idx" ON "ai_content_generations"("createdAt");

-- CreateIndex
CREATE INDEX "ai_conversations_storeId_idx" ON "ai_conversations"("storeId");

-- CreateIndex
CREATE INDEX "ai_conversations_providerId_idx" ON "ai_conversations"("providerId");

-- CreateIndex
CREATE INDEX "ai_conversations_customerId_idx" ON "ai_conversations"("customerId");

-- CreateIndex
CREATE INDEX "ai_conversations_status_idx" ON "ai_conversations"("status");

-- CreateIndex
CREATE INDEX "ai_conversations_startedAt_idx" ON "ai_conversations"("startedAt");

-- CreateIndex
CREATE INDEX "ai_conversation_messages_conversationId_idx" ON "ai_conversation_messages"("conversationId");

-- CreateIndex
CREATE INDEX "ai_conversation_messages_role_idx" ON "ai_conversation_messages"("role");

-- CreateIndex
CREATE INDEX "ai_usage_summaries_storeId_idx" ON "ai_usage_summaries"("storeId");

-- CreateIndex
CREATE INDEX "ai_usage_summaries_usageKind_idx" ON "ai_usage_summaries"("usageKind");

-- CreateIndex
CREATE INDEX "ai_usage_summaries_periodStart_idx" ON "ai_usage_summaries"("periodStart");

-- CreateIndex
CREATE UNIQUE INDEX "ai_usage_summaries_storeId_usageKind_periodStart_periodEnd_key" ON "ai_usage_summaries"("storeId", "usageKind", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "bundles_storeId_idx" ON "bundles"("storeId");

-- CreateIndex
CREATE INDEX "bundles_status_idx" ON "bundles"("status");

-- CreateIndex
CREATE INDEX "bundles_isFeatured_idx" ON "bundles"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "bundles_storeId_code_key" ON "bundles"("storeId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "bundles_storeId_slug_key" ON "bundles"("storeId", "slug");

-- CreateIndex
CREATE INDEX "bundle_items_bundleId_idx" ON "bundle_items"("bundleId");

-- CreateIndex
CREATE INDEX "bundle_items_productId_idx" ON "bundle_items"("productId");

-- CreateIndex
CREATE INDEX "bundle_items_variantId_idx" ON "bundle_items"("variantId");

-- CreateIndex
CREATE INDEX "product_types_storeId_idx" ON "product_types"("storeId");

-- CreateIndex
CREATE INDEX "product_types_status_idx" ON "product_types"("status");

-- CreateIndex
CREATE UNIQUE INDEX "product_types_storeId_code_key" ON "product_types"("storeId", "code");

-- CreateIndex
CREATE INDEX "catalog_attributes_storeId_idx" ON "catalog_attributes"("storeId");

-- CreateIndex
CREATE INDEX "catalog_attributes_status_idx" ON "catalog_attributes"("status");

-- CreateIndex
CREATE INDEX "catalog_attributes_valueType_idx" ON "catalog_attributes"("valueType");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_attributes_storeId_code_key" ON "catalog_attributes"("storeId", "code");

-- CreateIndex
CREATE INDEX "product_type_attributes_productTypeId_idx" ON "product_type_attributes"("productTypeId");

-- CreateIndex
CREATE INDEX "product_type_attributes_attributeId_idx" ON "product_type_attributes"("attributeId");

-- CreateIndex
CREATE INDEX "product_type_attributes_kind_idx" ON "product_type_attributes"("kind");

-- CreateIndex
CREATE UNIQUE INDEX "product_type_attributes_productTypeId_attributeId_key" ON "product_type_attributes"("productTypeId", "attributeId");

-- CreateIndex
CREATE INDEX "categories_storeId_idx" ON "categories"("storeId");

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- CreateIndex
CREATE INDEX "categories_status_idx" ON "categories"("status");

-- CreateIndex
CREATE INDEX "categories_isFeatured_idx" ON "categories"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "categories_storeId_slug_key" ON "categories"("storeId", "slug");

-- CreateIndex
CREATE INDEX "product_categories_productId_idx" ON "product_categories"("productId");

-- CreateIndex
CREATE INDEX "product_categories_categoryId_idx" ON "product_categories"("categoryId");

-- CreateIndex
CREATE INDEX "product_categories_isPrimary_idx" ON "product_categories"("isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_productId_categoryId_key" ON "product_categories"("productId", "categoryId");

-- CreateIndex
CREATE INDEX "channels_storeId_idx" ON "channels"("storeId");

-- CreateIndex
CREATE INDEX "channels_kind_idx" ON "channels"("kind");

-- CreateIndex
CREATE INDEX "channels_status_idx" ON "channels"("status");

-- CreateIndex
CREATE UNIQUE INDEX "channels_storeId_kind_name_key" ON "channels"("storeId", "kind", "name");

-- CreateIndex
CREATE INDEX "channel_product_publications_channelId_idx" ON "channel_product_publications"("channelId");

-- CreateIndex
CREATE INDEX "channel_product_publications_productId_idx" ON "channel_product_publications"("productId");

-- CreateIndex
CREATE INDEX "channel_product_publications_status_idx" ON "channel_product_publications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "channel_product_publications_channelId_productId_key" ON "channel_product_publications"("channelId", "productId");

-- CreateIndex
CREATE INDEX "discounts_storeId_idx" ON "discounts"("storeId");

-- CreateIndex
CREATE INDEX "discounts_status_idx" ON "discounts"("status");

-- CreateIndex
CREATE INDEX "discounts_startsAt_idx" ON "discounts"("startsAt");

-- CreateIndex
CREATE INDEX "discounts_endsAt_idx" ON "discounts"("endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "discounts_storeId_code_key" ON "discounts"("storeId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_discountId_idx" ON "coupons"("discountId");

-- CreateIndex
CREATE INDEX "coupons_status_idx" ON "coupons"("status");

-- CreateIndex
CREATE INDEX "coupon_redemptions_orderId_idx" ON "coupon_redemptions"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_redemptions_couponId_orderId_key" ON "coupon_redemptions"("couponId", "orderId");

-- CreateIndex
CREATE INDEX "order_discounts_orderId_idx" ON "order_discounts"("orderId");

-- CreateIndex
CREATE INDEX "order_discounts_discountId_idx" ON "order_discounts"("discountId");

-- CreateIndex
CREATE INDEX "order_discounts_couponId_idx" ON "order_discounts"("couponId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_variantId_key" ON "inventory_items"("variantId");

-- CreateIndex
CREATE INDEX "inventory_items_storeId_idx" ON "inventory_items"("storeId");

-- CreateIndex
CREATE INDEX "inventory_items_policy_idx" ON "inventory_items"("policy");

-- CreateIndex
CREATE INDEX "inventory_adjustments_inventoryItemId_idx" ON "inventory_adjustments"("inventoryItemId");

-- CreateIndex
CREATE INDEX "inventory_adjustments_kind_idx" ON "inventory_adjustments"("kind");

-- CreateIndex
CREATE INDEX "inventory_adjustments_occurredAt_idx" ON "inventory_adjustments"("occurredAt");

-- CreateIndex
CREATE INDEX "media_assets_storeId_idx" ON "media_assets"("storeId");

-- CreateIndex
CREATE INDEX "media_assets_kind_idx" ON "media_assets"("kind");

-- CreateIndex
CREATE INDEX "media_assets_status_idx" ON "media_assets"("status");

-- CreateIndex
CREATE INDEX "product_media_productId_idx" ON "product_media"("productId");

-- CreateIndex
CREATE INDEX "product_media_mediaAssetId_idx" ON "product_media"("mediaAssetId");

-- CreateIndex
CREATE INDEX "product_media_isPrimary_idx" ON "product_media"("isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "product_media_productId_mediaAssetId_key" ON "product_media"("productId", "mediaAssetId");

-- CreateIndex
CREATE INDEX "product_variant_media_variantId_idx" ON "product_variant_media"("variantId");

-- CreateIndex
CREATE INDEX "product_variant_media_mediaAssetId_idx" ON "product_variant_media"("mediaAssetId");

-- CreateIndex
CREATE INDEX "product_variant_media_isPrimary_idx" ON "product_variant_media"("isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_media_variantId_mediaAssetId_key" ON "product_variant_media"("variantId", "mediaAssetId");

-- CreateIndex
CREATE INDEX "price_lists_storeId_idx" ON "price_lists"("storeId");

-- CreateIndex
CREATE INDEX "price_lists_currencyCode_idx" ON "price_lists"("currencyCode");

-- CreateIndex
CREATE INDEX "price_lists_isDefault_idx" ON "price_lists"("isDefault");

-- CreateIndex
CREATE INDEX "price_lists_status_idx" ON "price_lists"("status");

-- CreateIndex
CREATE UNIQUE INDEX "price_lists_storeId_code_key" ON "price_lists"("storeId", "code");

-- CreateIndex
CREATE INDEX "product_prices_priceListId_idx" ON "product_prices"("priceListId");

-- CreateIndex
CREATE INDEX "product_prices_productId_idx" ON "product_prices"("productId");

-- CreateIndex
CREATE INDEX "product_prices_status_idx" ON "product_prices"("status");

-- CreateIndex
CREATE UNIQUE INDEX "product_prices_priceListId_productId_key" ON "product_prices"("priceListId", "productId");

-- CreateIndex
CREATE INDEX "product_variant_prices_priceListId_idx" ON "product_variant_prices"("priceListId");

-- CreateIndex
CREATE INDEX "product_variant_prices_variantId_idx" ON "product_variant_prices"("variantId");

-- CreateIndex
CREATE INDEX "product_variant_prices_status_idx" ON "product_variant_prices"("status");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_prices_priceListId_variantId_key" ON "product_variant_prices"("priceListId", "variantId");

-- CreateIndex
CREATE INDEX "products_storeId_idx" ON "products"("storeId");

-- CreateIndex
CREATE INDEX "products_productTypeId_idx" ON "products"("productTypeId");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "products"("status");

-- CreateIndex
CREATE INDEX "products_isFeatured_idx" ON "products"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "products_storeId_slug_key" ON "products"("storeId", "slug");

-- CreateIndex
CREATE INDEX "product_attribute_values_productId_idx" ON "product_attribute_values"("productId");

-- CreateIndex
CREATE INDEX "product_attribute_values_attributeId_idx" ON "product_attribute_values"("attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "product_attribute_values_productId_attributeId_key" ON "product_attribute_values"("productId", "attributeId");

-- CreateIndex
CREATE INDEX "product_variants_productId_idx" ON "product_variants"("productId");

-- CreateIndex
CREATE INDEX "product_variants_status_idx" ON "product_variants"("status");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_productId_sku_key" ON "product_variants"("productId", "sku");

-- CreateIndex
CREATE INDEX "product_variant_attribute_values_variantId_idx" ON "product_variant_attribute_values"("variantId");

-- CreateIndex
CREATE INDEX "product_variant_attribute_values_attributeId_idx" ON "product_variant_attribute_values"("attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_attribute_values_variantId_attributeId_key" ON "product_variant_attribute_values"("variantId", "attributeId");

-- CreateIndex
CREATE INDEX "sales_policies_storeId_idx" ON "sales_policies"("storeId");

-- CreateIndex
CREATE INDEX "sales_policies_targetKind_targetId_idx" ON "sales_policies"("targetKind", "targetId");

-- CreateIndex
CREATE INDEX "sales_policies_status_idx" ON "sales_policies"("status");

-- CreateIndex
CREATE INDEX "sales_policies_startsAt_idx" ON "sales_policies"("startsAt");

-- CreateIndex
CREATE INDEX "sales_policies_endsAt_idx" ON "sales_policies"("endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "sales_policies_storeId_code_key" ON "sales_policies"("storeId", "code");

-- CreateIndex
CREATE INDEX "tax_rules_storeId_idx" ON "tax_rules"("storeId");

-- CreateIndex
CREATE INDEX "tax_rules_status_idx" ON "tax_rules"("status");

-- CreateIndex
CREATE INDEX "tax_rules_countryCode_idx" ON "tax_rules"("countryCode");

-- CreateIndex
CREATE INDEX "tax_rules_storeId_productTypeCode_idx" ON "tax_rules"("storeId", "productTypeCode");

-- CreateIndex
CREATE UNIQUE INDEX "tax_rules_storeId_code_key" ON "tax_rules"("storeId", "code");

-- CreateIndex
CREATE INDEX "excise_rules_storeId_idx" ON "excise_rules"("storeId");

-- CreateIndex
CREATE INDEX "excise_rules_status_idx" ON "excise_rules"("status");

-- CreateIndex
CREATE UNIQUE INDEX "excise_rules_storeId_code_key" ON "excise_rules"("storeId", "code");

-- CreateIndex
CREATE INDEX "carts_storeId_idx" ON "carts"("storeId");

-- CreateIndex
CREATE INDEX "carts_customerId_idx" ON "carts"("customerId");

-- CreateIndex
CREATE INDEX "carts_status_idx" ON "carts"("status");

-- CreateIndex
CREATE INDEX "carts_expiresAt_idx" ON "carts"("expiresAt");

-- CreateIndex
CREATE INDEX "cart_lines_cartId_idx" ON "cart_lines"("cartId");

-- CreateIndex
CREATE INDEX "cart_lines_variantId_idx" ON "cart_lines"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_lines_cartId_variantId_key" ON "cart_lines"("cartId", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "checkouts_cartId_key" ON "checkouts"("cartId");

-- CreateIndex
CREATE INDEX "checkouts_storeId_idx" ON "checkouts"("storeId");

-- CreateIndex
CREATE INDEX "checkouts_customerId_idx" ON "checkouts"("customerId");

-- CreateIndex
CREATE INDEX "checkouts_status_idx" ON "checkouts"("status");

-- CreateIndex
CREATE INDEX "checkouts_shippingMethodId_idx" ON "checkouts"("shippingMethodId");

-- CreateIndex
CREATE UNIQUE INDEX "checkouts_storeId_completionIdempotencyKey_key" ON "checkouts"("storeId", "completionIdempotencyKey");

-- CreateIndex
CREATE INDEX "commercial_documents_storeId_idx" ON "commercial_documents"("storeId");

-- CreateIndex
CREATE INDEX "commercial_documents_orderId_idx" ON "commercial_documents"("orderId");

-- CreateIndex
CREATE INDEX "commercial_documents_returnRequestId_idx" ON "commercial_documents"("returnRequestId");

-- CreateIndex
CREATE INDEX "commercial_documents_kind_idx" ON "commercial_documents"("kind");

-- CreateIndex
CREATE INDEX "commercial_documents_status_idx" ON "commercial_documents"("status");

-- CreateIndex
CREATE UNIQUE INDEX "commercial_documents_storeId_documentNumber_key" ON "commercial_documents"("storeId", "documentNumber");

-- CreateIndex
CREATE INDEX "fulfillments_orderId_idx" ON "fulfillments"("orderId");

-- CreateIndex
CREATE INDEX "fulfillments_status_idx" ON "fulfillments"("status");

-- CreateIndex
CREATE INDEX "fulfillment_lines_fulfillmentId_idx" ON "fulfillment_lines"("fulfillmentId");

-- CreateIndex
CREATE INDEX "fulfillment_lines_orderLineId_idx" ON "fulfillment_lines"("orderLineId");

-- CreateIndex
CREATE UNIQUE INDEX "fulfillment_lines_fulfillmentId_orderLineId_key" ON "fulfillment_lines"("fulfillmentId", "orderLineId");

-- CreateIndex
CREATE INDEX "gift_cards_storeId_idx" ON "gift_cards"("storeId");

-- CreateIndex
CREATE INDEX "gift_cards_customerId_idx" ON "gift_cards"("customerId");

-- CreateIndex
CREATE INDEX "gift_cards_status_idx" ON "gift_cards"("status");

-- CreateIndex
CREATE INDEX "gift_cards_expiresAt_idx" ON "gift_cards"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "gift_cards_storeId_code_key" ON "gift_cards"("storeId", "code");

-- CreateIndex
CREATE INDEX "gift_card_transactions_giftCardId_idx" ON "gift_card_transactions"("giftCardId");

-- CreateIndex
CREATE INDEX "gift_card_transactions_orderId_idx" ON "gift_card_transactions"("orderId");

-- CreateIndex
CREATE INDEX "gift_card_transactions_type_idx" ON "gift_card_transactions"("type");

-- CreateIndex
CREATE UNIQUE INDEX "gifting_contexts_cartId_key" ON "gifting_contexts"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "gifting_contexts_checkoutId_key" ON "gifting_contexts"("checkoutId");

-- CreateIndex
CREATE UNIQUE INDEX "gifting_contexts_orderId_key" ON "gifting_contexts"("orderId");

-- CreateIndex
CREATE INDEX "gifting_contexts_status_idx" ON "gifting_contexts"("status");

-- CreateIndex
CREATE INDEX "loyalty_accounts_storeId_idx" ON "loyalty_accounts"("storeId");

-- CreateIndex
CREATE INDEX "loyalty_accounts_status_idx" ON "loyalty_accounts"("status");

-- CreateIndex
CREATE INDEX "loyalty_accounts_tierCode_idx" ON "loyalty_accounts"("tierCode");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_accounts_storeId_customerId_key" ON "loyalty_accounts"("storeId", "customerId");

-- CreateIndex
CREATE INDEX "loyalty_transactions_loyaltyAccountId_idx" ON "loyalty_transactions"("loyaltyAccountId");

-- CreateIndex
CREATE INDEX "loyalty_transactions_orderId_idx" ON "loyalty_transactions"("orderId");

-- CreateIndex
CREATE INDEX "loyalty_transactions_type_idx" ON "loyalty_transactions"("type");

-- CreateIndex
CREATE INDEX "loyalty_transactions_expiresAt_idx" ON "loyalty_transactions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "orders_checkoutId_key" ON "orders"("checkoutId");

-- CreateIndex
CREATE INDEX "orders_storeId_idx" ON "orders"("storeId");

-- CreateIndex
CREATE INDEX "orders_customerId_idx" ON "orders"("customerId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

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
CREATE INDEX "payments_orderId_idx" ON "payments"("orderId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_methodKind_idx" ON "payments"("methodKind");

-- CreateIndex
CREATE INDEX "payments_providerReference_idx" ON "payments"("providerReference");

-- CreateIndex
CREATE INDEX "payment_refunds_paymentId_idx" ON "payment_refunds"("paymentId");

-- CreateIndex
CREATE INDEX "payment_refunds_status_idx" ON "payment_refunds"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payment_refunds_paymentId_idempotencyKey_key" ON "payment_refunds"("paymentId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "return_requests_orderId_idx" ON "return_requests"("orderId");

-- CreateIndex
CREATE INDEX "return_requests_customerId_idx" ON "return_requests"("customerId");

-- CreateIndex
CREATE INDEX "return_requests_status_idx" ON "return_requests"("status");

-- CreateIndex
CREATE INDEX "return_lines_returnRequestId_idx" ON "return_lines"("returnRequestId");

-- CreateIndex
CREATE INDEX "return_lines_orderLineId_idx" ON "return_lines"("orderLineId");

-- CreateIndex
CREATE UNIQUE INDEX "return_lines_returnRequestId_orderLineId_key" ON "return_lines"("returnRequestId", "orderLineId");

-- CreateIndex
CREATE INDEX "shipping_methods_storeId_idx" ON "shipping_methods"("storeId");

-- CreateIndex
CREATE INDEX "shipping_methods_status_idx" ON "shipping_methods"("status");

-- CreateIndex
CREATE INDEX "shipping_methods_isDefault_idx" ON "shipping_methods"("isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_methods_storeId_code_key" ON "shipping_methods"("storeId", "code");

-- CreateIndex
CREATE INDEX "shipping_rates_shippingMethodId_idx" ON "shipping_rates"("shippingMethodId");

-- CreateIndex
CREATE INDEX "shipping_rates_countryCode_idx" ON "shipping_rates"("countryCode");

-- CreateIndex
CREATE UNIQUE INDEX "order_shipping_selections_orderId_key" ON "order_shipping_selections"("orderId");

-- CreateIndex
CREATE INDEX "order_shipping_selections_shippingMethodId_idx" ON "order_shipping_selections"("shippingMethodId");

-- CreateIndex
CREATE INDEX "subscription_topics_storeId_idx" ON "subscription_topics"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_topics_storeId_code_key" ON "subscription_topics"("storeId", "code");

-- CreateIndex
CREATE INDEX "subscriptions_topicId_idx" ON "subscriptions"("topicId");

-- CreateIndex
CREATE INDEX "subscriptions_customerId_idx" ON "subscriptions"("customerId");

-- CreateIndex
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions"("userId");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "blog_categories_storeId_idx" ON "blog_categories"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_storeId_slug_key" ON "blog_categories"("storeId", "slug");

-- CreateIndex
CREATE INDEX "blog_posts_storeId_idx" ON "blog_posts"("storeId");

-- CreateIndex
CREATE INDEX "blog_posts_status_idx" ON "blog_posts"("status");

-- CreateIndex
CREATE INDEX "blog_posts_isFeatured_idx" ON "blog_posts"("isFeatured");

-- CreateIndex
CREATE INDEX "blog_posts_publishedAt_idx" ON "blog_posts"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_storeId_slug_key" ON "blog_posts"("storeId", "slug");

-- CreateIndex
CREATE INDEX "blog_post_categories_postId_idx" ON "blog_post_categories"("postId");

-- CreateIndex
CREATE INDEX "blog_post_categories_categoryId_idx" ON "blog_post_categories"("categoryId");

-- CreateIndex
CREATE INDEX "blog_post_categories_isPrimary_idx" ON "blog_post_categories"("isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_categories_postId_categoryId_key" ON "blog_post_categories"("postId", "categoryId");

-- CreateIndex
CREATE INDEX "locale_definitions_storeId_idx" ON "locale_definitions"("storeId");

-- CreateIndex
CREATE INDEX "locale_definitions_isDefault_idx" ON "locale_definitions"("isDefault");

-- CreateIndex
CREATE INDEX "locale_definitions_isActive_idx" ON "locale_definitions"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "locale_definitions_storeId_code_key" ON "locale_definitions"("storeId", "code");

-- CreateIndex
CREATE INDEX "localized_values_storeId_idx" ON "localized_values"("storeId");

-- CreateIndex
CREATE INDEX "localized_values_localeId_idx" ON "localized_values"("localeId");

-- CreateIndex
CREATE INDEX "localized_values_subjectType_subjectId_idx" ON "localized_values"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "localized_values_fieldName_idx" ON "localized_values"("fieldName");

-- CreateIndex
CREATE INDEX "localized_values_status_idx" ON "localized_values"("status");

-- CreateIndex
CREATE UNIQUE INDEX "localized_values_localeId_subjectType_subjectId_fieldName_key" ON "localized_values"("localeId", "subjectType", "subjectId", "fieldName");

-- CreateIndex
CREATE INDEX "pages_storeId_idx" ON "pages"("storeId");

-- CreateIndex
CREATE INDEX "pages_status_idx" ON "pages"("status");

-- CreateIndex
CREATE INDEX "pages_isHomepage_idx" ON "pages"("isHomepage");

-- CreateIndex
CREATE UNIQUE INDEX "pages_storeId_slug_key" ON "pages"("storeId", "slug");

-- CreateIndex
CREATE INDEX "page_sections_pageId_idx" ON "page_sections"("pageId");

-- CreateIndex
CREATE INDEX "page_sections_kind_idx" ON "page_sections"("kind");

-- CreateIndex
CREATE INDEX "page_sections_isEnabled_idx" ON "page_sections"("isEnabled");

-- CreateIndex
CREATE INDEX "recommendation_lists_storeId_idx" ON "recommendation_lists"("storeId");

-- CreateIndex
CREATE INDEX "recommendation_lists_contextKind_idx" ON "recommendation_lists"("contextKind");

-- CreateIndex
CREATE INDEX "recommendation_lists_contextSubjectId_idx" ON "recommendation_lists"("contextSubjectId");

-- CreateIndex
CREATE INDEX "recommendation_lists_status_idx" ON "recommendation_lists"("status");

-- CreateIndex
CREATE UNIQUE INDEX "recommendation_lists_storeId_code_key" ON "recommendation_lists"("storeId", "code");

-- CreateIndex
CREATE INDEX "recommendation_items_recommendationListId_idx" ON "recommendation_items"("recommendationListId");

-- CreateIndex
CREATE INDEX "recommendation_items_targetKind_targetSubjectId_idx" ON "recommendation_items"("targetKind", "targetSubjectId");

-- CreateIndex
CREATE INDEX "recommendation_items_isActive_idx" ON "recommendation_items"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "recommendation_items_recommendationListId_targetKind_target_key" ON "recommendation_items"("recommendationListId", "targetKind", "targetSubjectId");

-- CreateIndex
CREATE INDEX "search_documents_storeId_idx" ON "search_documents"("storeId");

-- CreateIndex
CREATE INDEX "search_documents_kind_idx" ON "search_documents"("kind");

-- CreateIndex
CREATE INDEX "search_documents_subjectId_idx" ON "search_documents"("subjectId");

-- CreateIndex
CREATE INDEX "search_documents_locale_idx" ON "search_documents"("locale");

-- CreateIndex
CREATE INDEX "search_documents_status_idx" ON "search_documents"("status");

-- CreateIndex
CREATE INDEX "search_documents_isPublished_idx" ON "search_documents"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "search_documents_storeId_kind_subjectId_locale_key" ON "search_documents"("storeId", "kind", "subjectId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_pageId_key" ON "seo_metadata"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_blogPostId_key" ON "seo_metadata"("blogPostId");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_productId_key" ON "seo_metadata"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_categoryId_key" ON "seo_metadata"("categoryId");

-- CreateIndex
CREATE INDEX "seo_metadata_storeId_idx" ON "seo_metadata"("storeId");

-- CreateIndex
CREATE INDEX "seo_metadata_indexingState_idx" ON "seo_metadata"("indexingState");

-- CreateIndex
CREATE INDEX "template_definitions_storeId_idx" ON "template_definitions"("storeId");

-- CreateIndex
CREATE INDEX "template_definitions_usageKind_idx" ON "template_definitions"("usageKind");

-- CreateIndex
CREATE INDEX "template_definitions_status_idx" ON "template_definitions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "template_definitions_storeId_code_key" ON "template_definitions"("storeId", "code");

-- CreateIndex
CREATE INDEX "template_variants_templateDefinitionId_idx" ON "template_variants"("templateDefinitionId");

-- CreateIndex
CREATE INDEX "template_variants_locale_idx" ON "template_variants"("locale");

-- CreateIndex
CREATE INDEX "template_variants_channel_idx" ON "template_variants"("channel");

-- CreateIndex
CREATE INDEX "template_variants_isDefault_idx" ON "template_variants"("isDefault");

-- CreateIndex
CREATE INDEX "template_variants_status_idx" ON "template_variants"("status");

-- CreateIndex
CREATE UNIQUE INDEX "template_variants_templateDefinitionId_code_key" ON "template_variants"("templateDefinitionId", "code");

-- CreateIndex
CREATE INDEX "analytics_metrics_storeId_idx" ON "analytics_metrics"("storeId");

-- CreateIndex
CREATE INDEX "analytics_metrics_code_idx" ON "analytics_metrics"("code");

-- CreateIndex
CREATE INDEX "analytics_metrics_periodKind_idx" ON "analytics_metrics"("periodKind");

-- CreateIndex
CREATE INDEX "analytics_metrics_periodStart_periodEnd_idx" ON "analytics_metrics"("periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "analytics_metrics_dimensionKey_dimensionValue_idx" ON "analytics_metrics"("dimensionKey", "dimensionValue");

-- CreateIndex
CREATE INDEX "analytics_metrics_status_idx" ON "analytics_metrics"("status");

-- CreateIndex
CREATE INDEX "attribution_records_storeId_idx" ON "attribution_records"("storeId");

-- CreateIndex
CREATE INDEX "attribution_records_subjectKind_subjectId_idx" ON "attribution_records"("subjectKind", "subjectId");

-- CreateIndex
CREATE INDEX "attribution_records_modelKind_idx" ON "attribution_records"("modelKind");

-- CreateIndex
CREATE INDEX "attribution_records_source_medium_campaign_idx" ON "attribution_records"("source", "medium", "campaign");

-- CreateIndex
CREATE INDEX "attribution_records_visitorKey_idx" ON "attribution_records"("visitorKey");

-- CreateIndex
CREATE INDEX "attribution_records_sessionKey_idx" ON "attribution_records"("sessionKey");

-- CreateIndex
CREATE INDEX "attribution_records_customerId_idx" ON "attribution_records"("customerId");

-- CreateIndex
CREATE INDEX "attribution_records_orderId_idx" ON "attribution_records"("orderId");

-- CreateIndex
CREATE INDEX "attribution_records_checkoutId_idx" ON "attribution_records"("checkoutId");

-- CreateIndex
CREATE INDEX "attribution_records_attributedAt_idx" ON "attribution_records"("attributedAt");

-- CreateIndex
CREATE INDEX "behavior_profiles_storeId_idx" ON "behavior_profiles"("storeId");

-- CreateIndex
CREATE INDEX "behavior_profiles_actorKind_idx" ON "behavior_profiles"("actorKind");

-- CreateIndex
CREATE INDEX "behavior_profiles_status_idx" ON "behavior_profiles"("status");

-- CreateIndex
CREATE INDEX "behavior_profiles_lastSeenAt_idx" ON "behavior_profiles"("lastSeenAt");

-- CreateIndex
CREATE UNIQUE INDEX "behavior_profiles_storeId_visitorKey_key" ON "behavior_profiles"("storeId", "visitorKey");

-- CreateIndex
CREATE UNIQUE INDEX "behavior_profiles_storeId_customerId_key" ON "behavior_profiles"("storeId", "customerId");

-- CreateIndex
CREATE INDEX "behavior_segments_storeId_idx" ON "behavior_segments"("storeId");

-- CreateIndex
CREATE INDEX "behavior_segments_isActive_idx" ON "behavior_segments"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "behavior_segments_storeId_code_key" ON "behavior_segments"("storeId", "code");

-- CreateIndex
CREATE INDEX "behavior_segment_assignments_behaviorProfileId_idx" ON "behavior_segment_assignments"("behaviorProfileId");

-- CreateIndex
CREATE INDEX "behavior_segment_assignments_behaviorSegmentId_idx" ON "behavior_segment_assignments"("behaviorSegmentId");

-- CreateIndex
CREATE INDEX "behavior_segment_assignments_expiresAt_idx" ON "behavior_segment_assignments"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "behavior_segment_assignments_behaviorProfileId_behaviorSegm_key" ON "behavior_segment_assignments"("behaviorProfileId", "behaviorSegmentId");

-- CreateIndex
CREATE INDEX "consent_categories_storeId_idx" ON "consent_categories"("storeId");

-- CreateIndex
CREATE INDEX "consent_categories_kind_idx" ON "consent_categories"("kind");

-- CreateIndex
CREATE INDEX "consent_categories_isActive_idx" ON "consent_categories"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "consent_categories_storeId_code_key" ON "consent_categories"("storeId", "code");

-- CreateIndex
CREATE INDEX "consent_records_storeId_idx" ON "consent_records"("storeId");

-- CreateIndex
CREATE INDEX "consent_records_categoryId_idx" ON "consent_records"("categoryId");

-- CreateIndex
CREATE INDEX "consent_records_customerId_idx" ON "consent_records"("customerId");

-- CreateIndex
CREATE INDEX "consent_records_userId_idx" ON "consent_records"("userId");

-- CreateIndex
CREATE INDEX "consent_records_visitorKey_idx" ON "consent_records"("visitorKey");

-- CreateIndex
CREATE INDEX "consent_records_status_idx" ON "consent_records"("status");

-- CreateIndex
CREATE INDEX "consent_records_recordedAt_idx" ON "consent_records"("recordedAt");

-- CreateIndex
CREATE INDEX "conversion_flows_storeId_idx" ON "conversion_flows"("storeId");

-- CreateIndex
CREATE INDEX "conversion_flows_status_idx" ON "conversion_flows"("status");

-- CreateIndex
CREATE INDEX "conversion_steps_conversionFlowId_idx" ON "conversion_steps"("conversionFlowId");

-- CreateIndex
CREATE INDEX "crm_tags_storeId_idx" ON "crm_tags"("storeId");

-- CreateIndex
CREATE INDEX "crm_tags_status_idx" ON "crm_tags"("status");

-- CreateIndex
CREATE UNIQUE INDEX "crm_tags_storeId_name_key" ON "crm_tags"("storeId", "name");

-- CreateIndex
CREATE INDEX "crm_customer_tags_customerId_idx" ON "crm_customer_tags"("customerId");

-- CreateIndex
CREATE INDEX "crm_customer_tags_tagId_idx" ON "crm_customer_tags"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "crm_customer_tags_customerId_tagId_key" ON "crm_customer_tags"("customerId", "tagId");

-- CreateIndex
CREATE INDEX "crm_notes_customerId_idx" ON "crm_notes"("customerId");

-- CreateIndex
CREATE INDEX "crm_notes_userId_idx" ON "crm_notes"("userId");

-- CreateIndex
CREATE INDEX "email_messages_storeId_idx" ON "email_messages"("storeId");

-- CreateIndex
CREATE INDEX "email_messages_category_idx" ON "email_messages"("category");

-- CreateIndex
CREATE INDEX "email_messages_status_idx" ON "email_messages"("status");

-- CreateIndex
CREATE INDEX "email_messages_userId_idx" ON "email_messages"("userId");

-- CreateIndex
CREATE INDEX "email_messages_customerId_idx" ON "email_messages"("customerId");

-- CreateIndex
CREATE INDEX "email_messages_notificationId_idx" ON "email_messages"("notificationId");

-- CreateIndex
CREATE INDEX "email_messages_orderId_idx" ON "email_messages"("orderId");

-- CreateIndex
CREATE INDEX "email_messages_eventId_idx" ON "email_messages"("eventId");

-- CreateIndex
CREATE INDEX "email_messages_supportTicketId_idx" ON "email_messages"("supportTicketId");

-- CreateIndex
CREATE INDEX "events_storeId_idx" ON "events"("storeId");

-- CreateIndex
CREATE INDEX "events_status_idx" ON "events"("status");

-- CreateIndex
CREATE INDEX "events_isFeatured_idx" ON "events"("isFeatured");

-- CreateIndex
CREATE INDEX "events_startsAt_idx" ON "events"("startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "events_storeId_slug_key" ON "events"("storeId", "slug");

-- CreateIndex
CREATE INDEX "event_registrations_eventId_idx" ON "event_registrations"("eventId");

-- CreateIndex
CREATE INDEX "event_registrations_customerId_idx" ON "event_registrations"("customerId");

-- CreateIndex
CREATE INDEX "event_registrations_status_idx" ON "event_registrations"("status");

-- CreateIndex
CREATE INDEX "event_registrations_registeredAt_idx" ON "event_registrations"("registeredAt");

-- CreateIndex
CREATE INDEX "marketing_campaigns_storeId_idx" ON "marketing_campaigns"("storeId");

-- CreateIndex
CREATE INDEX "marketing_campaigns_status_idx" ON "marketing_campaigns"("status");

-- CreateIndex
CREATE INDEX "marketing_campaigns_channel_idx" ON "marketing_campaigns"("channel");

-- CreateIndex
CREATE INDEX "marketing_campaigns_startsAt_idx" ON "marketing_campaigns"("startsAt");

-- CreateIndex
CREATE INDEX "marketing_campaigns_endsAt_idx" ON "marketing_campaigns"("endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "marketing_campaigns_storeId_code_key" ON "marketing_campaigns"("storeId", "code");

-- CreateIndex
CREATE INDEX "marketing_campaign_links_marketingCampaignId_idx" ON "marketing_campaign_links"("marketingCampaignId");

-- CreateIndex
CREATE INDEX "marketing_campaign_links_subjectType_subjectId_idx" ON "marketing_campaign_links"("subjectType", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "marketing_campaign_links_marketingCampaignId_subjectType_su_key" ON "marketing_campaign_links"("marketingCampaignId", "subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "newsletter_lists_storeId_idx" ON "newsletter_lists"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_lists_storeId_name_key" ON "newsletter_lists"("storeId", "name");

-- CreateIndex
CREATE INDEX "newsletter_subscriptions_listId_idx" ON "newsletter_subscriptions"("listId");

-- CreateIndex
CREATE INDEX "newsletter_subscriptions_customerId_idx" ON "newsletter_subscriptions"("customerId");

-- CreateIndex
CREATE INDEX "newsletter_subscriptions_status_idx" ON "newsletter_subscriptions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscriptions_listId_email_key" ON "newsletter_subscriptions"("listId", "email");

-- CreateIndex
CREATE INDEX "newsletter_campaigns_listId_idx" ON "newsletter_campaigns"("listId");

-- CreateIndex
CREATE INDEX "newsletter_campaigns_status_idx" ON "newsletter_campaigns"("status");

-- CreateIndex
CREATE INDEX "newsletter_campaigns_scheduledAt_idx" ON "newsletter_campaigns"("scheduledAt");

-- CreateIndex
CREATE INDEX "notifications_storeId_idx" ON "notifications"("storeId");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_channel_idx" ON "notifications"("channel");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_customerId_idx" ON "notifications"("customerId");

-- CreateIndex
CREATE INDEX "notifications_orderId_idx" ON "notifications"("orderId");

-- CreateIndex
CREATE INDEX "notifications_paymentId_idx" ON "notifications"("paymentId");

-- CreateIndex
CREATE INDEX "notifications_fulfillmentId_idx" ON "notifications"("fulfillmentId");

-- CreateIndex
CREATE INDEX "notifications_returnRequestId_idx" ON "notifications"("returnRequestId");

-- CreateIndex
CREATE INDEX "social_accounts_storeId_idx" ON "social_accounts"("storeId");

-- CreateIndex
CREATE INDEX "social_accounts_platform_idx" ON "social_accounts"("platform");

-- CreateIndex
CREATE INDEX "social_accounts_status_idx" ON "social_accounts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "social_accounts_storeId_platform_externalAccountId_key" ON "social_accounts"("storeId", "platform", "externalAccountId");

-- CreateIndex
CREATE INDEX "social_posts_socialAccountId_idx" ON "social_posts"("socialAccountId");

-- CreateIndex
CREATE INDEX "social_posts_storeId_idx" ON "social_posts"("storeId");

-- CreateIndex
CREATE INDEX "social_posts_status_idx" ON "social_posts"("status");

-- CreateIndex
CREATE INDEX "social_posts_scheduledAt_idx" ON "social_posts"("scheduledAt");

-- CreateIndex
CREATE INDEX "support_tickets_storeId_idx" ON "support_tickets"("storeId");

-- CreateIndex
CREATE INDEX "support_tickets_customerId_idx" ON "support_tickets"("customerId");

-- CreateIndex
CREATE INDEX "support_tickets_status_idx" ON "support_tickets"("status");

-- CreateIndex
CREATE INDEX "support_tickets_priority_idx" ON "support_tickets"("priority");

-- CreateIndex
CREATE INDEX "support_tickets_assignedToUserId_idx" ON "support_tickets"("assignedToUserId");

-- CreateIndex
CREATE INDEX "support_tickets_orderId_idx" ON "support_tickets"("orderId");

-- CreateIndex
CREATE INDEX "support_tickets_returnRequestId_idx" ON "support_tickets"("returnRequestId");

-- CreateIndex
CREATE INDEX "support_tickets_paymentId_idx" ON "support_tickets"("paymentId");

-- CreateIndex
CREATE INDEX "support_tickets_eventId_idx" ON "support_tickets"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "support_tickets_storeId_ticketNumber_key" ON "support_tickets"("storeId", "ticketNumber");

-- CreateIndex
CREATE INDEX "support_messages_ticketId_idx" ON "support_messages"("ticketId");

-- CreateIndex
CREATE INDEX "support_messages_userId_idx" ON "support_messages"("userId");

-- CreateIndex
CREATE INDEX "support_messages_customerId_idx" ON "support_messages"("customerId");

-- CreateIndex
CREATE INDEX "support_messages_authorKind_idx" ON "support_messages"("authorKind");

-- CreateIndex
CREATE INDEX "tracking_events_storeId_idx" ON "tracking_events"("storeId");

-- CreateIndex
CREATE INDEX "tracking_events_eventName_idx" ON "tracking_events"("eventName");

-- CreateIndex
CREATE INDEX "tracking_events_actorKind_idx" ON "tracking_events"("actorKind");

-- CreateIndex
CREATE INDEX "tracking_events_visitorKey_idx" ON "tracking_events"("visitorKey");

-- CreateIndex
CREATE INDEX "tracking_events_customerId_idx" ON "tracking_events"("customerId");

-- CreateIndex
CREATE INDEX "tracking_events_userId_idx" ON "tracking_events"("userId");

-- CreateIndex
CREATE INDEX "tracking_events_sessionKey_idx" ON "tracking_events"("sessionKey");

-- CreateIndex
CREATE INDEX "tracking_events_subjectType_subjectId_idx" ON "tracking_events"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "tracking_events_occurredAt_idx" ON "tracking_events"("occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "api_clients_code_key" ON "api_clients"("code");

-- CreateIndex
CREATE INDEX "api_clients_storeId_idx" ON "api_clients"("storeId");

-- CreateIndex
CREATE INDEX "api_clients_scopeType_idx" ON "api_clients"("scopeType");

-- CreateIndex
CREATE INDEX "api_clients_status_idx" ON "api_clients"("status");

-- CreateIndex
CREATE INDEX "api_client_credentials_apiClientId_idx" ON "api_client_credentials"("apiClientId");

-- CreateIndex
CREATE INDEX "api_client_credentials_expiresAt_idx" ON "api_client_credentials"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "api_client_credentials_apiClientId_credentialKey_key" ON "api_client_credentials"("apiClientId", "credentialKey");

-- CreateIndex
CREATE INDEX "api_client_permissions_apiClientId_idx" ON "api_client_permissions"("apiClientId");

-- CreateIndex
CREATE INDEX "api_client_permissions_permissionId_idx" ON "api_client_permissions"("permissionId");

-- CreateIndex
CREATE INDEX "api_client_permissions_grantedById_idx" ON "api_client_permissions"("grantedById");

-- CreateIndex
CREATE UNIQUE INDEX "api_client_permissions_apiClientId_permissionId_key" ON "api_client_permissions"("apiClientId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_identities_userId_key" ON "auth_identities"("userId");

-- CreateIndex
CREATE INDEX "auth_identities_status_idx" ON "auth_identities"("status");

-- CreateIndex
CREATE INDEX "auth_identities_mfaEnabled_idx" ON "auth_identities"("mfaEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "auth_password_credentials_identityId_key" ON "auth_password_credentials"("identityId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_sessionTokenHash_key" ON "auth_sessions"("sessionTokenHash");

-- CreateIndex
CREATE INDEX "auth_sessions_identityId_idx" ON "auth_sessions"("identityId");

-- CreateIndex
CREATE INDEX "auth_sessions_status_idx" ON "auth_sessions"("status");

-- CreateIndex
CREATE INDEX "auth_sessions_expiresAt_idx" ON "auth_sessions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "auth_recovery_requests_tokenHash_key" ON "auth_recovery_requests"("tokenHash");

-- CreateIndex
CREATE INDEX "auth_recovery_requests_identityId_idx" ON "auth_recovery_requests"("identityId");

-- CreateIndex
CREATE INDEX "auth_recovery_requests_requestedByUserId_idx" ON "auth_recovery_requests"("requestedByUserId");

-- CreateIndex
CREATE INDEX "auth_recovery_requests_status_idx" ON "auth_recovery_requests"("status");

-- CreateIndex
CREATE INDEX "auth_recovery_requests_expiresAt_idx" ON "auth_recovery_requests"("expiresAt");

-- CreateIndex
CREATE INDEX "auth_mfa_enrollments_identityId_idx" ON "auth_mfa_enrollments"("identityId");

-- CreateIndex
CREATE INDEX "auth_mfa_enrollments_method_idx" ON "auth_mfa_enrollments"("method");

-- CreateIndex
CREATE UNIQUE INDEX "auth_recovery_codes_codeHash_key" ON "auth_recovery_codes"("codeHash");

-- CreateIndex
CREATE INDEX "auth_recovery_codes_identityId_idx" ON "auth_recovery_codes"("identityId");

-- CreateIndex
CREATE INDEX "customers_storeId_idx" ON "customers"("storeId");

-- CreateIndex
CREATE INDEX "customers_status_idx" ON "customers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "customers_storeId_email_key" ON "customers"("storeId", "email");

-- CreateIndex
CREATE INDEX "customer_addresses_customerId_idx" ON "customer_addresses"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE INDEX "permissions_resource_idx" ON "permissions"("resource");

-- CreateIndex
CREATE INDEX "permissions_action_idx" ON "permissions"("action");

-- CreateIndex
CREATE INDEX "permissions_scopeType_idx" ON "permissions"("scopeType");

-- CreateIndex
CREATE INDEX "permissions_status_idx" ON "permissions"("status");

-- CreateIndex
CREATE INDEX "permissions_isSensitive_idx" ON "permissions"("isSensitive");

-- CreateIndex
CREATE INDEX "role_permissions_roleId_idx" ON "role_permissions"("roleId");

-- CreateIndex
CREATE INDEX "role_permissions_permissionId_idx" ON "role_permissions"("permissionId");

-- CreateIndex
CREATE INDEX "role_permissions_grantedById_idx" ON "role_permissions"("grantedById");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "roles_storeId_idx" ON "roles"("storeId");

-- CreateIndex
CREATE INDEX "roles_scopeType_idx" ON "roles"("scopeType");

-- CreateIndex
CREATE INDEX "roles_status_idx" ON "roles"("status");

-- CreateIndex
CREATE UNIQUE INDEX "roles_storeId_code_key" ON "roles"("storeId", "code");

-- CreateIndex
CREATE INDEX "user_roles_userId_idx" ON "user_roles"("userId");

-- CreateIndex
CREATE INDEX "user_roles_roleId_idx" ON "user_roles"("roleId");

-- CreateIndex
CREATE INDEX "user_roles_assignedById_idx" ON "user_roles"("assignedById");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "user_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "stores_code_key" ON "stores"("code");

-- CreateIndex
CREATE UNIQUE INDEX "stores_slug_key" ON "stores"("slug");

-- CreateIndex
CREATE INDEX "stores_status_idx" ON "stores"("status");

-- CreateIndex
CREATE INDEX "stores_slug_idx" ON "stores"("slug");

-- CreateIndex
CREATE INDEX "store_capabilities_storeId_idx" ON "store_capabilities"("storeId");

-- CreateIndex
CREATE INDEX "store_capabilities_key_idx" ON "store_capabilities"("key");

-- CreateIndex
CREATE UNIQUE INDEX "store_capabilities_storeId_key_key" ON "store_capabilities"("storeId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_storeId_idx" ON "users"("storeId");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "approval_requests_storeId_idx" ON "approval_requests"("storeId");

-- CreateIndex
CREATE INDEX "approval_requests_subjectType_subjectId_idx" ON "approval_requests"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "approval_requests_requestedByUserId_idx" ON "approval_requests"("requestedByUserId");

-- CreateIndex
CREATE INDEX "approval_requests_reviewedByUserId_idx" ON "approval_requests"("reviewedByUserId");

-- CreateIndex
CREATE INDEX "approval_requests_status_idx" ON "approval_requests"("status");

-- CreateIndex
CREATE INDEX "audit_logs_storeId_idx" ON "audit_logs"("storeId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_apiClientId_idx" ON "audit_logs"("apiClientId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_severity_idx" ON "audit_logs"("severity");

-- CreateIndex
CREATE INDEX "audit_logs_occurredAt_idx" ON "audit_logs"("occurredAt");

-- CreateIndex
CREATE INDEX "audit_log_changes_auditLogId_idx" ON "audit_log_changes"("auditLogId");

-- CreateIndex
CREATE INDEX "audit_log_changes_fieldName_idx" ON "audit_log_changes"("fieldName");

-- CreateIndex
CREATE INDEX "dashboards_storeId_idx" ON "dashboards"("storeId");

-- CreateIndex
CREATE INDEX "dashboards_kind_idx" ON "dashboards"("kind");

-- CreateIndex
CREATE INDEX "dashboards_status_idx" ON "dashboards"("status");

-- CreateIndex
CREATE UNIQUE INDEX "dashboards_storeId_slug_key" ON "dashboards"("storeId", "slug");

-- CreateIndex
CREATE INDEX "dashboard_widgets_dashboardId_idx" ON "dashboard_widgets"("dashboardId");

-- CreateIndex
CREATE INDEX "dashboard_widgets_kind_idx" ON "dashboard_widgets"("kind");

-- CreateIndex
CREATE INDEX "domain_events_storeId_idx" ON "domain_events"("storeId");

-- CreateIndex
CREATE INDEX "domain_events_eventType_idx" ON "domain_events"("eventType");

-- CreateIndex
CREATE INDEX "domain_events_aggregateType_aggregateId_idx" ON "domain_events"("aggregateType", "aggregateId");

-- CreateIndex
CREATE INDEX "domain_events_status_idx" ON "domain_events"("status");

-- CreateIndex
CREATE INDEX "domain_events_occurredAt_idx" ON "domain_events"("occurredAt");

-- CreateIndex
CREATE INDEX "export_definitions_storeId_idx" ON "export_definitions"("storeId");

-- CreateIndex
CREATE INDEX "export_definitions_subjectType_idx" ON "export_definitions"("subjectType");

-- CreateIndex
CREATE INDEX "export_definitions_isActive_idx" ON "export_definitions"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "export_definitions_storeId_code_key" ON "export_definitions"("storeId", "code");

-- CreateIndex
CREATE INDEX "export_requests_storeId_idx" ON "export_requests"("storeId");

-- CreateIndex
CREATE INDEX "export_requests_exportDefinitionId_idx" ON "export_requests"("exportDefinitionId");

-- CreateIndex
CREATE INDEX "export_requests_requestedByUserId_idx" ON "export_requests"("requestedByUserId");

-- CreateIndex
CREATE INDEX "export_requests_status_idx" ON "export_requests"("status");

-- CreateIndex
CREATE INDEX "export_requests_createdAt_idx" ON "export_requests"("createdAt");

-- CreateIndex
CREATE INDEX "feature_flags_storeId_idx" ON "feature_flags"("storeId");

-- CreateIndex
CREATE INDEX "feature_flags_status_idx" ON "feature_flags"("status");

-- CreateIndex
CREATE INDEX "feature_flags_isEnabled_idx" ON "feature_flags"("isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_storeId_code_key" ON "feature_flags"("storeId", "code");

-- CreateIndex
CREATE INDEX "fraud_risk_assessments_storeId_idx" ON "fraud_risk_assessments"("storeId");

-- CreateIndex
CREATE INDEX "fraud_risk_assessments_subjectKind_subjectId_idx" ON "fraud_risk_assessments"("subjectKind", "subjectId");

-- CreateIndex
CREATE INDEX "fraud_risk_assessments_level_idx" ON "fraud_risk_assessments"("level");

-- CreateIndex
CREATE INDEX "fraud_risk_assessments_decisionStatus_idx" ON "fraud_risk_assessments"("decisionStatus");

-- CreateIndex
CREATE INDEX "fraud_risk_assessments_orderId_idx" ON "fraud_risk_assessments"("orderId");

-- CreateIndex
CREATE INDEX "fraud_risk_assessments_paymentId_idx" ON "fraud_risk_assessments"("paymentId");

-- CreateIndex
CREATE INDEX "fraud_risk_assessments_customerId_idx" ON "fraud_risk_assessments"("customerId");

-- CreateIndex
CREATE INDEX "fraud_risk_assessments_checkoutId_idx" ON "fraud_risk_assessments"("checkoutId");

-- CreateIndex
CREATE INDEX "fraud_risk_signals_assessmentId_idx" ON "fraud_risk_signals"("assessmentId");

-- CreateIndex
CREATE INDEX "fraud_risk_signals_code_idx" ON "fraud_risk_signals"("code");

-- CreateIndex
CREATE INDEX "import_definitions_storeId_idx" ON "import_definitions"("storeId");

-- CreateIndex
CREATE INDEX "import_definitions_subjectType_idx" ON "import_definitions"("subjectType");

-- CreateIndex
CREATE INDEX "import_definitions_isActive_idx" ON "import_definitions"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "import_definitions_storeId_code_key" ON "import_definitions"("storeId", "code");

-- CreateIndex
CREATE INDEX "import_requests_storeId_idx" ON "import_requests"("storeId");

-- CreateIndex
CREATE INDEX "import_requests_importDefinitionId_idx" ON "import_requests"("importDefinitionId");

-- CreateIndex
CREATE INDEX "import_requests_requestedByUserId_idx" ON "import_requests"("requestedByUserId");

-- CreateIndex
CREATE INDEX "import_requests_status_idx" ON "import_requests"("status");

-- CreateIndex
CREATE INDEX "import_requests_createdAt_idx" ON "import_requests"("createdAt");

-- CreateIndex
CREATE INDEX "integrations_storeId_idx" ON "integrations"("storeId");

-- CreateIndex
CREATE INDEX "integrations_providerKind_idx" ON "integrations"("providerKind");

-- CreateIndex
CREATE INDEX "integrations_status_idx" ON "integrations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "integrations_storeId_code_key" ON "integrations"("storeId", "code");

-- CreateIndex
CREATE INDEX "integration_credentials_integrationId_idx" ON "integration_credentials"("integrationId");

-- CreateIndex
CREATE INDEX "integration_credentials_expiresAt_idx" ON "integration_credentials"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "integration_credentials_integrationId_credentialKey_key" ON "integration_credentials"("integrationId", "credentialKey");

-- CreateIndex
CREATE INDEX "jobs_storeId_idx" ON "jobs"("storeId");

-- CreateIndex
CREATE INDEX "jobs_type_idx" ON "jobs"("type");

-- CreateIndex
CREATE INDEX "jobs_status_idx" ON "jobs"("status");

-- CreateIndex
CREATE INDEX "jobs_scheduledAt_idx" ON "jobs"("scheduledAt");

-- CreateIndex
CREATE INDEX "jobs_startedAt_idx" ON "jobs"("startedAt");

-- CreateIndex
CREATE INDEX "legal_documents_storeId_idx" ON "legal_documents"("storeId");

-- CreateIndex
CREATE INDEX "legal_documents_kind_idx" ON "legal_documents"("kind");

-- CreateIndex
CREATE INDEX "legal_documents_status_idx" ON "legal_documents"("status");

-- CreateIndex
CREATE UNIQUE INDEX "legal_documents_storeId_code_key" ON "legal_documents"("storeId", "code");

-- CreateIndex
CREATE INDEX "legal_document_versions_legalDocumentId_idx" ON "legal_document_versions"("legalDocumentId");

-- CreateIndex
CREATE INDEX "legal_document_versions_isPublished_idx" ON "legal_document_versions"("isPublished");

-- CreateIndex
CREATE INDEX "legal_document_versions_publishedAt_idx" ON "legal_document_versions"("publishedAt");

-- CreateIndex
CREATE INDEX "legal_document_versions_locale_idx" ON "legal_document_versions"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "legal_document_versions_legalDocumentId_versionLabel_locale_key" ON "legal_document_versions"("legalDocumentId", "versionLabel", "locale");

-- CreateIndex
CREATE INDEX "legal_acceptances_legalDocumentVersionId_idx" ON "legal_acceptances"("legalDocumentVersionId");

-- CreateIndex
CREATE INDEX "legal_acceptances_customerId_idx" ON "legal_acceptances"("customerId");

-- CreateIndex
CREATE INDEX "legal_acceptances_userId_idx" ON "legal_acceptances"("userId");

-- CreateIndex
CREATE INDEX "legal_acceptances_acceptedAt_idx" ON "legal_acceptances"("acceptedAt");

-- CreateIndex
CREATE INDEX "monitoring_checks_storeId_idx" ON "monitoring_checks"("storeId");

-- CreateIndex
CREATE INDEX "monitoring_checks_kind_idx" ON "monitoring_checks"("kind");

-- CreateIndex
CREATE INDEX "monitoring_checks_status_idx" ON "monitoring_checks"("status");

-- CreateIndex
CREATE INDEX "monitoring_checks_checkedAt_idx" ON "monitoring_checks"("checkedAt");

-- CreateIndex
CREATE UNIQUE INDEX "monitoring_checks_storeId_code_key" ON "monitoring_checks"("storeId", "code");

-- CreateIndex
CREATE INDEX "observability_records_storeId_idx" ON "observability_records"("storeId");

-- CreateIndex
CREATE INDEX "observability_records_kind_idx" ON "observability_records"("kind");

-- CreateIndex
CREATE INDEX "observability_records_level_idx" ON "observability_records"("level");

-- CreateIndex
CREATE INDEX "observability_records_code_idx" ON "observability_records"("code");

-- CreateIndex
CREATE INDEX "observability_records_entityType_entityId_idx" ON "observability_records"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "observability_records_correlationKey_idx" ON "observability_records"("correlationKey");

-- CreateIndex
CREATE INDEX "observability_records_recordedAt_idx" ON "observability_records"("recordedAt");

-- CreateIndex
CREATE INDEX "scheduling_entries_storeId_idx" ON "scheduling_entries"("storeId");

-- CreateIndex
CREATE INDEX "scheduling_entries_subjectType_subjectId_idx" ON "scheduling_entries"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "scheduling_entries_actionCode_idx" ON "scheduling_entries"("actionCode");

-- CreateIndex
CREATE INDEX "scheduling_entries_status_idx" ON "scheduling_entries"("status");

-- CreateIndex
CREATE INDEX "scheduling_entries_scheduledFor_idx" ON "scheduling_entries"("scheduledFor");

-- CreateIndex
CREATE INDEX "webhook_endpoints_storeId_idx" ON "webhook_endpoints"("storeId");

-- CreateIndex
CREATE INDEX "webhook_endpoints_status_idx" ON "webhook_endpoints"("status");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_endpoints_storeId_code_key" ON "webhook_endpoints"("storeId", "code");

-- CreateIndex
CREATE INDEX "webhook_deliveries_endpointId_idx" ON "webhook_deliveries"("endpointId");

-- CreateIndex
CREATE INDEX "webhook_deliveries_eventName_idx" ON "webhook_deliveries"("eventName");

-- CreateIndex
CREATE INDEX "webhook_deliveries_status_idx" ON "webhook_deliveries"("status");

-- CreateIndex
CREATE INDEX "webhook_deliveries_nextRetryAt_idx" ON "webhook_deliveries"("nextRetryAt");

-- CreateIndex
CREATE INDEX "workflow_runs_storeId_idx" ON "workflow_runs"("storeId");

-- CreateIndex
CREATE INDEX "workflow_runs_workflowCode_idx" ON "workflow_runs"("workflowCode");

-- CreateIndex
CREATE INDEX "workflow_runs_subjectType_subjectId_idx" ON "workflow_runs"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "workflow_runs_status_idx" ON "workflow_runs"("status");

-- AddForeignKey
ALTER TABLE "ai_providers" ADD CONSTRAINT "ai_providers_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_credentials" ADD CONSTRAINT "ai_credentials_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ai_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_depth_policies" ADD CONSTRAINT "ai_depth_policies_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_content_generations" ADD CONSTRAINT "ai_content_generations_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_content_generations" ADD CONSTRAINT "ai_content_generations_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ai_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_content_generations" ADD CONSTRAINT "ai_content_generations_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ai_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversation_messages" ADD CONSTRAINT "ai_conversation_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ai_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_usage_summaries" ADD CONSTRAINT "ai_usage_summaries_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundles" ADD CONSTRAINT "bundles_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_items" ADD CONSTRAINT "bundle_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_types" ADD CONSTRAINT "product_types_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_attributes" ADD CONSTRAINT "catalog_attributes_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_type_attributes" ADD CONSTRAINT "product_type_attributes_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "product_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_type_attributes" ADD CONSTRAINT "product_type_attributes_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "catalog_attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_product_publications" ADD CONSTRAINT "channel_product_publications_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_product_publications" ADD CONSTRAINT "channel_product_publications_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_discounts" ADD CONSTRAINT "order_discounts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_discounts" ADD CONSTRAINT "order_discounts_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "discounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_discounts" ADD CONSTRAINT "order_discounts_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_adjustments" ADD CONSTRAINT "inventory_adjustments_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_media" ADD CONSTRAINT "product_variant_media_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_media" ADD CONSTRAINT "product_variant_media_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_lists" ADD CONSTRAINT "price_lists_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES "price_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_prices" ADD CONSTRAINT "product_variant_prices_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES "price_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_prices" ADD CONSTRAINT "product_variant_prices_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "product_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_defaultVariantId_fkey" FOREIGN KEY ("defaultVariantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "catalog_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_attribute_values" ADD CONSTRAINT "product_variant_attribute_values_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_attribute_values" ADD CONSTRAINT "product_variant_attribute_values_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "catalog_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_policies" ADD CONSTRAINT "sales_policies_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_rules" ADD CONSTRAINT "tax_rules_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_rules" ADD CONSTRAINT "tax_rules_storeId_productTypeCode_fkey" FOREIGN KEY ("storeId", "productTypeCode") REFERENCES "product_types"("storeId", "code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "excise_rules" ADD CONSTRAINT "excise_rules_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_lines" ADD CONSTRAINT "cart_lines_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_lines" ADD CONSTRAINT "cart_lines_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "shipping_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial_documents" ADD CONSTRAINT "commercial_documents_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial_documents" ADD CONSTRAINT "commercial_documents_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial_documents" ADD CONSTRAINT "commercial_documents_returnRequestId_fkey" FOREIGN KEY ("returnRequestId") REFERENCES "return_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fulfillments" ADD CONSTRAINT "fulfillments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fulfillment_lines" ADD CONSTRAINT "fulfillment_lines_fulfillmentId_fkey" FOREIGN KEY ("fulfillmentId") REFERENCES "fulfillments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fulfillment_lines" ADD CONSTRAINT "fulfillment_lines_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "order_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_card_transactions" ADD CONSTRAINT "gift_card_transactions_giftCardId_fkey" FOREIGN KEY ("giftCardId") REFERENCES "gift_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_card_transactions" ADD CONSTRAINT "gift_card_transactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gifting_contexts" ADD CONSTRAINT "gifting_contexts_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gifting_contexts" ADD CONSTRAINT "gifting_contexts_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "checkouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gifting_contexts" ADD CONSTRAINT "gifting_contexts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_accounts" ADD CONSTRAINT "loyalty_accounts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_accounts" ADD CONSTRAINT "loyalty_accounts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_loyaltyAccountId_fkey" FOREIGN KEY ("loyaltyAccountId") REFERENCES "loyalty_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "checkouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_lines" ADD CONSTRAINT "return_lines_returnRequestId_fkey" FOREIGN KEY ("returnRequestId") REFERENCES "return_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_lines" ADD CONSTRAINT "return_lines_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "order_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_methods" ADD CONSTRAINT "shipping_methods_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_rates" ADD CONSTRAINT "shipping_rates_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "shipping_methods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_shipping_selections" ADD CONSTRAINT "order_shipping_selections_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_shipping_selections" ADD CONSTRAINT "order_shipping_selections_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "shipping_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_topics" ADD CONSTRAINT "subscription_topics_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "subscription_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post_categories" ADD CONSTRAINT "blog_post_categories_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post_categories" ADD CONSTRAINT "blog_post_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "blog_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locale_definitions" ADD CONSTRAINT "locale_definitions_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localized_values" ADD CONSTRAINT "localized_values_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localized_values" ADD CONSTRAINT "localized_values_localeId_fkey" FOREIGN KEY ("localeId") REFERENCES "locale_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_lists" ADD CONSTRAINT "recommendation_lists_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_items" ADD CONSTRAINT "recommendation_items_recommendationListId_fkey" FOREIGN KEY ("recommendationListId") REFERENCES "recommendation_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_documents" ADD CONSTRAINT "search_documents_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_openGraphImageId_fkey" FOREIGN KEY ("openGraphImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_definitions" ADD CONSTRAINT "template_definitions_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_variants" ADD CONSTRAINT "template_variants_templateDefinitionId_fkey" FOREIGN KEY ("templateDefinitionId") REFERENCES "template_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_metrics" ADD CONSTRAINT "analytics_metrics_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribution_records" ADD CONSTRAINT "attribution_records_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribution_records" ADD CONSTRAINT "attribution_records_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribution_records" ADD CONSTRAINT "attribution_records_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribution_records" ADD CONSTRAINT "attribution_records_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "checkouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_profiles" ADD CONSTRAINT "behavior_profiles_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_profiles" ADD CONSTRAINT "behavior_profiles_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_segments" ADD CONSTRAINT "behavior_segments_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_segment_assignments" ADD CONSTRAINT "behavior_segment_assignments_behaviorProfileId_fkey" FOREIGN KEY ("behaviorProfileId") REFERENCES "behavior_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_segment_assignments" ADD CONSTRAINT "behavior_segment_assignments_behaviorSegmentId_fkey" FOREIGN KEY ("behaviorSegmentId") REFERENCES "behavior_segments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_categories" ADD CONSTRAINT "consent_categories_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "consent_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversion_flows" ADD CONSTRAINT "conversion_flows_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversion_steps" ADD CONSTRAINT "conversion_steps_conversionFlowId_fkey" FOREIGN KEY ("conversionFlowId") REFERENCES "conversion_flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_tags" ADD CONSTRAINT "crm_tags_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_customer_tags" ADD CONSTRAINT "crm_customer_tags_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_customer_tags" ADD CONSTRAINT "crm_customer_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "crm_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_notes" ADD CONSTRAINT "crm_notes_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_notes" ADD CONSTRAINT "crm_notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_supportTicketId_fkey" FOREIGN KEY ("supportTicketId") REFERENCES "support_tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_templateDefinitionId_fkey" FOREIGN KEY ("templateDefinitionId") REFERENCES "template_definitions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_templateVariantId_fkey" FOREIGN KEY ("templateVariantId") REFERENCES "template_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_campaigns" ADD CONSTRAINT "marketing_campaigns_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_campaign_links" ADD CONSTRAINT "marketing_campaign_links_marketingCampaignId_fkey" FOREIGN KEY ("marketingCampaignId") REFERENCES "marketing_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_lists" ADD CONSTRAINT "newsletter_lists_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_subscriptions" ADD CONSTRAINT "newsletter_subscriptions_listId_fkey" FOREIGN KEY ("listId") REFERENCES "newsletter_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_subscriptions" ADD CONSTRAINT "newsletter_subscriptions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_campaigns" ADD CONSTRAINT "newsletter_campaigns_listId_fkey" FOREIGN KEY ("listId") REFERENCES "newsletter_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_fulfillmentId_fkey" FOREIGN KEY ("fulfillmentId") REFERENCES "fulfillments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_returnRequestId_fkey" FOREIGN KEY ("returnRequestId") REFERENCES "return_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "social_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_returnRequestId_fkey" FOREIGN KEY ("returnRequestId") REFERENCES "return_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_clients" ADD CONSTRAINT "api_clients_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_client_credentials" ADD CONSTRAINT "api_client_credentials_apiClientId_fkey" FOREIGN KEY ("apiClientId") REFERENCES "api_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_client_permissions" ADD CONSTRAINT "api_client_permissions_apiClientId_fkey" FOREIGN KEY ("apiClientId") REFERENCES "api_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_client_permissions" ADD CONSTRAINT "api_client_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_client_permissions" ADD CONSTRAINT "api_client_permissions_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_identities" ADD CONSTRAINT "auth_identities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_password_credentials" ADD CONSTRAINT "auth_password_credentials_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "auth_identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "auth_identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_recovery_requests" ADD CONSTRAINT "auth_recovery_requests_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "auth_identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_recovery_requests" ADD CONSTRAINT "auth_recovery_requests_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_mfa_enrollments" ADD CONSTRAINT "auth_mfa_enrollments_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "auth_identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_recovery_codes" ADD CONSTRAINT "auth_recovery_codes_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "auth_identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_capabilities" ADD CONSTRAINT "store_capabilities_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_apiClientId_fkey" FOREIGN KEY ("apiClientId") REFERENCES "api_clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log_changes" ADD CONSTRAINT "audit_log_changes_auditLogId_fkey" FOREIGN KEY ("auditLogId") REFERENCES "audit_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboards" ADD CONSTRAINT "dashboards_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboard_widgets" ADD CONSTRAINT "dashboard_widgets_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "dashboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domain_events" ADD CONSTRAINT "domain_events_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_definitions" ADD CONSTRAINT "export_definitions_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_requests" ADD CONSTRAINT "export_requests_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_requests" ADD CONSTRAINT "export_requests_exportDefinitionId_fkey" FOREIGN KEY ("exportDefinitionId") REFERENCES "export_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_requests" ADD CONSTRAINT "export_requests_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_risk_assessments" ADD CONSTRAINT "fraud_risk_assessments_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_risk_assessments" ADD CONSTRAINT "fraud_risk_assessments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_risk_assessments" ADD CONSTRAINT "fraud_risk_assessments_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_risk_assessments" ADD CONSTRAINT "fraud_risk_assessments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_risk_assessments" ADD CONSTRAINT "fraud_risk_assessments_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "checkouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_risk_assessments" ADD CONSTRAINT "fraud_risk_assessments_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_risk_signals" ADD CONSTRAINT "fraud_risk_signals_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "fraud_risk_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_definitions" ADD CONSTRAINT "import_definitions_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_requests" ADD CONSTRAINT "import_requests_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_requests" ADD CONSTRAINT "import_requests_importDefinitionId_fkey" FOREIGN KEY ("importDefinitionId") REFERENCES "import_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_requests" ADD CONSTRAINT "import_requests_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_credentials" ADD CONSTRAINT "integration_credentials_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_documents" ADD CONSTRAINT "legal_documents_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_document_versions" ADD CONSTRAINT "legal_document_versions_legalDocumentId_fkey" FOREIGN KEY ("legalDocumentId") REFERENCES "legal_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_acceptances" ADD CONSTRAINT "legal_acceptances_legalDocumentVersionId_fkey" FOREIGN KEY ("legalDocumentVersionId") REFERENCES "legal_document_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_acceptances" ADD CONSTRAINT "legal_acceptances_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_acceptances" ADD CONSTRAINT "legal_acceptances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoring_checks" ADD CONSTRAINT "monitoring_checks_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observability_records" ADD CONSTRAINT "observability_records_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observability_records" ADD CONSTRAINT "observability_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observability_records" ADD CONSTRAINT "observability_records_apiClientId_fkey" FOREIGN KEY ("apiClientId") REFERENCES "api_clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduling_entries" ADD CONSTRAINT "scheduling_entries_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "webhook_endpoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_runs" ADD CONSTRAINT "workflow_runs_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- ============================================================
-- Contraintes SQL complémentaires
-- (partial unique indexes, checks non générés par Prisma)
-- ============================================================

-- ------------------------------------------------------------
-- Partial unique indexes
-- NOTE : Prisma utilise des noms de colonnes en camelCase avec
-- guillemets doubles ("isPrimary", "isDefault").
-- ------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS product_media_primary_per_product_unique
  ON "product_media" ("productId")
  WHERE "isPrimary" = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS product_variant_media_primary_per_variant_unique
  ON "product_variant_media" ("variantId")
  WHERE "isPrimary" = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS product_categories_primary_per_product_unique
  ON "product_categories" ("productId")
  WHERE "isPrimary" = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS shipping_methods_default_per_store_unique
  ON "shipping_methods" ("storeId")
  WHERE "isDefault" = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS shipping_rates_geographic_scope_per_method_unique
  ON "shipping_rates" (
    "shippingMethodId",
    "countryCode",
    ("region" IS NULL),
    COALESCE("region", ''),
    ("postalCodePattern" IS NULL),
    COALESCE("postalCodePattern", ''),
    ("minSubtotalAmount" IS NULL),
    COALESCE("minSubtotalAmount", 0),
    ("maxSubtotalAmount" IS NULL),
    COALESCE("maxSubtotalAmount", 0)
  );

CREATE UNIQUE INDEX IF NOT EXISTS blog_post_categories_primary_per_post_unique
  ON "blog_post_categories" ("postId")
  WHERE "isPrimary" = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS template_variants_default_per_definition_unique
  ON "template_variants" ("templateDefinitionId")
  WHERE "isDefault" = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS locale_definitions_default_per_store_unique
  ON "locale_definitions" ("storeId")
  WHERE "isDefault" = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_lists_default_per_store_unique
  ON "newsletter_lists" ("storeId")
  WHERE "isDefault" = TRUE;

-- ------------------------------------------------------------
-- Quantity checks
-- ------------------------------------------------------------
ALTER TABLE "cart_lines" ADD CONSTRAINT cart_lines_quantity_positive CHECK (quantity > 0);

ALTER TABLE "bundle_items" ADD CONSTRAINT bundle_items_quantity_positive CHECK (quantity > 0);

ALTER TABLE "fulfillment_lines" ADD CONSTRAINT fulfillment_lines_quantity_positive CHECK (quantity > 0);

ALTER TABLE "return_lines" ADD CONSTRAINT return_lines_quantity_positive CHECK (quantity > 0);

ALTER TABLE "order_lines" ADD CONSTRAINT order_lines_quantity_positive CHECK (quantity > 0);

-- ------------------------------------------------------------
-- Monetary checks
-- ------------------------------------------------------------
ALTER TABLE "gift_cards" ADD CONSTRAINT gift_cards_amounts_non_negative CHECK (
  "initialAmount" >= 0
  AND "balanceAmount" >= 0
);

ALTER TABLE "product_prices" ADD CONSTRAINT product_prices_amounts_valid CHECK (
  amount >= 0
  AND ("compareAtAmount" IS NULL OR "compareAtAmount" >= 0)
);

ALTER TABLE "product_variant_prices" ADD CONSTRAINT product_variant_prices_amounts_valid CHECK (
  amount >= 0
  AND ("compareAtAmount" IS NULL OR "compareAtAmount" >= 0)
);

ALTER TABLE "shipping_rates" ADD CONSTRAINT shipping_rates_amounts_non_negative CHECK (
  "priceAmount" >= 0
  AND ("minSubtotalAmount" IS NULL OR "minSubtotalAmount" >= 0)
  AND ("maxSubtotalAmount" IS NULL OR "maxSubtotalAmount" >= 0)
);

ALTER TABLE "order_shipping_selections" ADD CONSTRAINT order_shipping_selections_price_amount_non_negative CHECK (
  "priceAmount" >= 0
);

ALTER TABLE "checkouts" ADD CONSTRAINT checkouts_amounts_non_negative CHECK (
  ("shippingPriceAmount" IS NULL OR "shippingPriceAmount" >= 0)
  AND "subtotalAmount" >= 0
  AND "discountAmount" >= 0
  AND "taxAmount" >= 0
  AND "totalAmount" >= 0
);

ALTER TABLE "orders" ADD CONSTRAINT orders_amounts_non_negative CHECK (
  "subtotalAmount" >= 0
  AND "discountAmount" >= 0
  AND "shippingAmount" >= 0
  AND "taxAmount" >= 0
  AND "totalAmount" >= 0
);

ALTER TABLE "order_lines" ADD CONSTRAINT order_lines_amounts_non_negative CHECK (
  "unitPriceAmount" >= 0
  AND "lineSubtotalAmount" >= 0
  AND "lineDiscountAmount" >= 0
  AND "lineTaxAmount" >= 0
  AND "lineTotalAmount" >= 0
);

ALTER TABLE "payments" ADD CONSTRAINT payments_amount_positive CHECK (amount > 0);

ALTER TABLE "payment_refunds" ADD CONSTRAINT payment_refunds_amount_positive CHECK (amount > 0);

COMMIT;

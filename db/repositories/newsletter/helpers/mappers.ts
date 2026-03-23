import type {
  NewsletterCampaignDetail,
  NewsletterCampaignStatus,
} from "@db-newsletter/campaigns";
import type {
  NewsletterSubscriptionDetail,
  NewsletterSubscriptionStatus,
} from "@db-newsletter/subscribers";
import type {
  NewsletterCampaignRow,
  NewsletterSubscriptionRow,
} from "@db-newsletter/types/rows";

export function mapNewsletterSubscriptionStatusToPrisma(
  status: NewsletterSubscriptionStatus
): "PENDING" | "ACTIVE" | "UNSUBSCRIBED" | "BOUNCED" | "COMPLAINED" {
  switch (status) {
    case "pending":
      return "PENDING";
    case "active":
      return "ACTIVE";
    case "unsubscribed":
      return "UNSUBSCRIBED";
    case "bounced":
      return "BOUNCED";
    case "complained":
      return "COMPLAINED";
  }
}

export function mapNewsletterCampaignStatusToPrisma(
  status: NewsletterCampaignStatus
): "DRAFT" | "SCHEDULED" | "SENDING" | "SENT" | "CANCELLED" {
  switch (status) {
    case "draft":
      return "DRAFT";
    case "scheduled":
      return "SCHEDULED";
    case "sending":
      return "SENDING";
    case "sent":
      return "SENT";
    case "cancelled":
      return "CANCELLED";
  }
}

function mapNewsletterSubscriptionStatus(
  status: "PENDING" | "ACTIVE" | "UNSUBSCRIBED" | "BOUNCED" | "COMPLAINED"
): NewsletterSubscriptionStatus {
  switch (status) {
    case "PENDING":
      return "pending";
    case "ACTIVE":
      return "active";
    case "UNSUBSCRIBED":
      return "unsubscribed";
    case "BOUNCED":
      return "bounced";
    case "COMPLAINED":
      return "complained";
  }
}

function mapNewsletterCampaignStatus(
  status: "DRAFT" | "SCHEDULED" | "SENDING" | "SENT" | "CANCELLED"
): NewsletterCampaignStatus {
  switch (status) {
    case "DRAFT":
      return "draft";
    case "SCHEDULED":
      return "scheduled";
    case "SENDING":
      return "sending";
    case "SENT":
      return "sent";
    case "CANCELLED":
      return "cancelled";
  }
}

export function mapNewsletterSubscription(
  row: NewsletterSubscriptionRow
): NewsletterSubscriptionDetail {
  return {
    id: row.id,
    listId: row.listId,
    customerId: row.customerId,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    status: mapNewsletterSubscriptionStatus(row.status),
    confirmedAt: row.confirmedAt,
    unsubscribedAt: row.unsubscribedAt,
    bouncedAt: row.bouncedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapNewsletterCampaign(row: NewsletterCampaignRow): NewsletterCampaignDetail {
  return {
    id: row.id,
    listId: row.listId,
    name: row.name,
    subject: row.subject,
    previewText: row.previewText,
    status: mapNewsletterCampaignStatus(row.status),
    scheduledAt: row.scheduledAt,
    sentAt: row.sentAt,
    cancelledAt: row.cancelledAt,
    recipientsCount: row.recipientsCount,
    opensCount: row.opensCount,
    clicksCount: row.clicksCount,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

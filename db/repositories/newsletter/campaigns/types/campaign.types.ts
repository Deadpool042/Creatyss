export type NewsletterCampaignStatus =
  | "draft"
  | "scheduled"
  | "sending"
  | "sent"
  | "cancelled";

export type NewsletterCampaignSummary = {
  id: string;
  listId: string;
  name: string;
  subject: string;
  previewText: string | null;
  status: NewsletterCampaignStatus;
  scheduledAt: Date | null;
  sentAt: Date | null;
  cancelledAt: Date | null;
  recipientsCount: number;
  opensCount: number;
  clicksCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type NewsletterCampaignDetail = NewsletterCampaignSummary;

export type CreateNewsletterCampaignInput = {
  listId: string;
  name: string;
  subject: string;
  previewText?: string | null;
  status?: NewsletterCampaignStatus;
  scheduledAt?: Date | null;
};

export type UpdateNewsletterCampaignInput = {
  id: string;
  name?: string;
  subject?: string;
  previewText?: string | null;
  status?: NewsletterCampaignStatus;
  scheduledAt?: Date | null;
};

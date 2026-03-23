export type NewsletterSubscriptionStatus =
  | "pending"
  | "active"
  | "unsubscribed"
  | "bounced"
  | "complained";

export type NewsletterSubscriptionSummary = {
  id: string;
  listId: string;
  customerId: string | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: NewsletterSubscriptionStatus;
  confirmedAt: Date | null;
  unsubscribedAt: Date | null;
  bouncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type NewsletterSubscriptionDetail = NewsletterSubscriptionSummary;

export type SubscribeNewsletterInput = {
  listId: string;
  email: string;
  customerId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export type ConfirmNewsletterSubscriptionInput = {
  listId: string;
  email: string;
};

export type UnsubscribeNewsletterInput = {
  listId: string;
  email: string;
};

export class NewsletterRepositoryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "NewsletterRepositoryError";
    this.code = code;
  }
}

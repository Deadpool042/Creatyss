export type NewsletterSubscriberStatus = "pending" | "subscribed" | "unsubscribed";

export type NewsletterSubscriber = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: NewsletterSubscriberStatus;
  source: string | null;
  confirmationToken: string | null;
  subscribedAt: Date | null;
  unsubscribedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SubscribeNewsletterInput = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  source?: string | null;
  confirmationToken?: string | null;
};

export type ConfirmNewsletterSubscriptionInput = {
  email: string;
};

export type UnsubscribeNewsletterInput = {
  email: string;
};

export type NewsletterRepositoryErrorCode =
  | "newsletter_email_invalid"
  | "newsletter_subscriber_not_found";

export class NewsletterRepositoryError extends Error {
  readonly code: NewsletterRepositoryErrorCode;

  constructor(code: NewsletterRepositoryErrorCode, message: string) {
    super(message);
    this.name = "NewsletterRepositoryError";
    this.code = code;
  }
}

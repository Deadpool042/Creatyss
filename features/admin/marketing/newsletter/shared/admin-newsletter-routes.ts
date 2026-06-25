export const ADMIN_NEWSLETTER_PATH = "/admin/marketing/newsletter";
export const ADMIN_NEWSLETTER_CAMPAIGNS_PATH = "/admin/marketing/newsletter/campaigns";

export type AdminNewsletterSearchParams = {
  status?: string | undefined;
  source?: string | undefined;
  customerLink?: string | undefined;
  recency?: string | undefined;
};

export const AUTOMATION_TRIGGER_TYPES = [
  "CART_ABANDONED",
  "ORDER_PLACED",
  "NEWSLETTER_SUBSCRIBED",
  "CUSTOMER_CREATED",
  "MANUAL",
  "OTHER",
] as const;

export const AUTOMATION_ACTION_TYPES = [
  "EMAIL_MESSAGE",
  "NEWSLETTER_CAMPAIGN",
  "NOTIFICATION",
  "WEBHOOK",
  "OTHER",
] as const;

export type AdminAutomationTriggerType = (typeof AUTOMATION_TRIGGER_TYPES)[number];
export type AdminAutomationActionType = (typeof AUTOMATION_ACTION_TYPES)[number];

export const AUTOMATION_TRIGGER_LABELS: Record<AdminAutomationTriggerType, string> = {
  CART_ABANDONED: "Panier abandonné",
  ORDER_PLACED: "Commande passée",
  NEWSLETTER_SUBSCRIBED: "Inscription newsletter",
  CUSTOMER_CREATED: "Nouveau client",
  MANUAL: "Déclenchement manuel",
  OTHER: "Autre",
};

export const AUTOMATION_ACTION_LABELS: Record<AdminAutomationActionType, string> = {
  EMAIL_MESSAGE: "Email",
  NEWSLETTER_CAMPAIGN: "Campagne newsletter",
  NOTIFICATION: "Notification",
  WEBHOOK: "Webhook",
  OTHER: "Autre",
};

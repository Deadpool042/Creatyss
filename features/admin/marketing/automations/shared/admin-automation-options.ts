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

/**
 * Déclencheurs réellement câblés à une file d'exécution automatique
 * (cf. `features/automations/services/queue-*-automation-jobs.service.ts`).
 * Les autres valeurs de `AUTOMATION_TRIGGER_TYPES` existent dans le schéma
 * mais ne produisent aujourd'hui aucun job — niveau `basic` de
 * `engagement.automations`.
 */
export const AUTOMATION_WIRED_TRIGGER_TYPES = [
  "ORDER_PLACED",
  "NEWSLETTER_SUBSCRIBED",
] as const satisfies readonly AdminAutomationTriggerType[];

/**
 * Actions réellement exécutées par `execute-automation-job.service.ts`.
 * Les autres valeurs de `AUTOMATION_ACTION_TYPES` existent dans le schéma
 * mais sont rejetées à l'exécution — niveau `basic`.
 */
export const AUTOMATION_WIRED_ACTION_TYPES = [
  "EMAIL_MESSAGE",
] as const satisfies readonly AdminAutomationActionType[];

export function isWiredAutomationCombination(triggerType: string, actionType: string): boolean {
  return (
    (AUTOMATION_WIRED_TRIGGER_TYPES as readonly string[]).includes(triggerType) &&
    (AUTOMATION_WIRED_ACTION_TYPES as readonly string[]).includes(actionType)
  );
}

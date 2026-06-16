import type { CustomerLifecycleStatus } from "./customer-status";

export const CUSTOMER_STATUS_LABELS = {
  LEAD: "Prospect",
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  BLOCKED: "Bloque",
  ARCHIVED: "Archive",
} as const satisfies Record<CustomerLifecycleStatus, string>;

export function getCustomerFullName(input: {
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
}): string | null {
  return [input.firstName, input.lastName].filter(Boolean).join(" ") || input.displayName;
}

export function getCustomerDisplayInitial(input: {
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
}): string {
  return (getCustomerFullName(input) ?? input.email).charAt(0).toUpperCase();
}

export function getCustomerEmailOptInLabel(acceptsEmail: boolean): "Oui" | "Non" {
  return acceptsEmail ? "Oui" : "Non";
}

export const CUSTOMER_EMAIL_CONSENT_LABEL = "Consentement email";

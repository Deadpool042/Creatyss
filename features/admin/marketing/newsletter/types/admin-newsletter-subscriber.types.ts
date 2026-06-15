import type { NewsletterSubscriberStatus } from "@/prisma-generated/client";

/**
 * Résumé d'un `NewsletterSubscriber` pour la liste admin (niveau `basic`,
 * cf. `docs/lots/2026-06-13-engagement-newsletter-automations-cadrage.md`).
 *
 * Niveau `basic` : CRUD référentiel des abonnés uniquement. Aucune
 * `NewsletterCampaign` n'est créée ou envoyée par ce lot.
 */
export type AdminNewsletterSubscriberSummary = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: NewsletterSubscriberStatus;
  source: string | null;
  createdAt: Date;
};

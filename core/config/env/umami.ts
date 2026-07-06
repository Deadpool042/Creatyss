//core/config/env/umami.ts
import "server-only";

/**
 * Vérifie si Umami est opérationnellement configuré sans throw.
 * Lit process.env directement pour rester indépendant du parse Zod strict.
 * À utiliser pour conditionner la disponibilité des lectures Umami.
 */
export function isUmamiConfigured(): boolean {
  const host = process.env.UMAMI_API_HOST;
  const username = process.env.UMAMI_USERNAME;
  const password = process.env.UMAMI_PASSWORD;
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  return (
    typeof host === "string" &&
    host.length > 0 &&
    typeof username === "string" &&
    username.length > 0 &&
    typeof password === "string" &&
    password.length > 0 &&
    typeof websiteId === "string" &&
    websiteId.length > 0
  );
}

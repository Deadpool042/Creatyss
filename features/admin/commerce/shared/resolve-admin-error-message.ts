/**
 * Résout un code d'erreur porté par un searchParam (`?xxx_error=code`) en
 * message affichable, à partir d'une table de correspondance locale à la
 * page. Remplace un `switch`/`case` par page par une donnée déclarative.
 */
export function resolveAdminErrorMessage(
  code: string,
  messages: Readonly<Record<string, string>>,
  fallback: string
): string {
  return messages[code] ?? fallback;
}
